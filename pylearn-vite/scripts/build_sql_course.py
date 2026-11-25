import json
import os

target_dir = "/Users/nijanthanrajachandran/Ai/pylearn-vite/content/sql-mastery"
os.makedirs(target_dir, exist_ok=True)

meta = {
    "id": "sql-mastery",
    "title": "Complete SQL & Relational Databases",
    "subtitle": "Interactive Hands-On SQL from Fundamentals to Advanced Analytics",
    "emoji": "🗄️",
    "color": "#3b82f6",
    "level": "Complete Guide",
    "estimatedTime": "20 hours",
    "topics": [
        "1. Introduction to Databases",
        "2. SQL Basics (SELECT, WHERE, ORDER BY, LIMIT)",
        "3. Manipulating Data (INSERT, UPDATE, DELETE)",
        "4. Defining Tables & Schema Constraints",
        "5. Multi-Table Queries & Relational JOINs",
        "6. Aggregate Functions & GROUP BY / HAVING",
        "7. Scalar Functions (String, Numeric, Date, CASE)",
        "8. Subqueries & Common Table Expressions (CTEs)",
        "9. Window Functions (OVER, PARTITION BY, Ranking)"
    ],
    "description": "Comprehensive, presenter-ready SQL curriculum with 105 interactive lessons, quizzes, and real-world challenges. Features live SQLite WASM in-browser execution, relational schema tables, Venn JOIN simulator, and instant solution reveal."
}

with open(os.path.join(target_dir, "meta.json"), "w", encoding="utf-8") as f:
    json.dump(meta, f, indent=2)

print("meta.json created successfully.")
