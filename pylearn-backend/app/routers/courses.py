import json
from pathlib import Path
from typing import Any, Dict, List
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/courses", tags=["Courses"])

CONTENT_DIR = Path(__file__).resolve().parent.parent.parent / "content"


def _load_course_sections(course_dir: Path) -> List[Dict[str, Any]]:
    sections_dir = course_dir / "sections"
    if not sections_dir.is_dir():
        return []

    sections: List[Dict[str, Any]] = []
    for section_file in sorted(sections_dir.glob("*.json")):
        with section_file.open("r", encoding="utf-8") as f:
            sections.append(json.load(f))

    sections.sort(key=lambda s: s.get("order", 0))
    return sections


def _flatten_slides(sections: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    slides: List[Dict[str, Any]] = []
    for sec in sections:
        for topic_group in sec.get("topics", []):
            slides.extend(topic_group.get("slides", []))
    return slides


@router.get("")
async def list_courses():
    """Return course catalog metadata and slide/section counts."""
    if not CONTENT_DIR.is_dir():
        return {"courses": []}

    courses: List[Dict[str, Any]] = []
    for course_dir in sorted(CONTENT_DIR.iterdir()):
        if not course_dir.is_dir():
            continue
        meta_file = course_dir / "meta.json"
        if not meta_file.is_file():
            continue

        with meta_file.open("r", encoding="utf-8") as f:
            meta = json.load(f)

        sections = _load_course_sections(course_dir)
        slide_count = sum(
            len(topic.get("slides", []))
            for sec in sections
            for topic in sec.get("topics", [])
        )

        courses.append({
            "slug": course_dir.name,
            "meta": meta,
            "slideCount": slide_count,
            "sectionCount": len(sections),
        })

    return {"courses": courses}


@router.get("/{slug}")
async def get_course(slug: str):
    """Return full course metadata, structural sections, and ordered slides."""
    if "/" in slug or "\\" in slug or ".." in slug:
        raise HTTPException(status_code=400, detail="Invalid course slug")

    course_dir = CONTENT_DIR / slug
    meta_file = course_dir / "meta.json"
    if not course_dir.is_dir() or not meta_file.is_file():
        raise HTTPException(status_code=404, detail=f"Course '{slug}' not found")

    with meta_file.open("r", encoding="utf-8") as f:
        meta = json.load(f)

    sections = _load_course_sections(course_dir)
    slides = _flatten_slides(sections)

    return {
        "slug": slug,
        "meta": meta,
        "sections": sections,
        "slides": slides,
    }


@router.get("/{slug}/sections")
async def get_course_sections(slug: str):
    """Return course content strictly in structural section -> topic -> slides format."""
    course = await get_course(slug)
    return {
        "slug": course["slug"],
        "meta": course["meta"],
        "sections": course["sections"],
    }
