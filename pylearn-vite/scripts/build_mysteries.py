import json
import os

base_dir = "/Users/nijanthanrajachandran/Ai/pylearn-vite/content"

# ========================================================
# 1. SQL Murder Mystery: The SQL City Detective
# ========================================================
sql_dir = os.path.join(base_dir, "sql-murder-mystery")
os.makedirs(sql_dir, exist_ok=True)

sql_meta = {
    "id": "sql-murder-mystery",
    "title": "SQL Murder Mystery: The SQL City Detective",
    "subtitle": "Gamified Detective Investigation — Solve a Murder Case with SQL Queries",
    "emoji": "🕵️‍♂️",
    "color": "#f59e0b",
    "level": "Interactive Mystery",
    "estimatedTime": "1.5 hours",
    "topics": [
        "Phase 1: The Crime Scene Report",
        "Phase 2: Locating the Eyewitnesses",
        "Phase 3: Interrogating Witnesses",
        "Phase 4: The Get Fit Now Gym Trail",
        "Phase 5: The Vehicle & Killer Match",
        "Phase 6: The Killer's Secret Confession",
        "Phase 7: Unmasking the Wealthy Mastermind"
    ],
    "description": "A crime has occurred in SQL City! You are the lead detective with database access. Write SQL queries to inspect crime reports, interview witnesses, cross-reference vehicle plates, and unmask the mastermind."
}

with open(os.path.join(sql_dir, "meta.json"), "w", encoding="utf-8") as f:
    json.dump(sql_meta, f, indent=2)

sql_slides = [
    {
        "id": "smm-1",
        "language": "sql",
        "section": "SQL Murder Mystery",
        "topic": "Phase 1: The Crime Scene Report",
        "step": "Case 1.1",
        "category": "sql",
        "categoryLabel": "Detective Case",
        "tag": "Crime Scene",
        "question": "Phase 1: Retrieve the Crime Scene Report for the Murder in SQL City",
        "explanation": {
            "points": [
                "**Detective Briefing**: A murder occurred in **'SQL City'** on **January 15, 2024** (`date = '2024-01-15'`).",
                "Your first task as lead detective is to query the `crime_scene_reports` table for `type = 'murder'`, `city = 'SQL City'`, and `date = '2024-01-15'`.",
                "Read the officer's description to discover the identities of the two key eyewitnesses.",
                "Click **▶ Run** to execute the query in your local SQLite terminal."
            ],
            "highlight": "Query crime_scene_reports where city = 'SQL City' AND type = 'murder' AND date = '2024-01-15'."
        },
        "code": "-- PHASE 1: Find the official murder incident report\nSELECT date, city, type, description\nFROM crime_scene_reports\nWHERE city = 'SQL City' \n  AND type = 'murder' \n  AND date = '2024-01-15';",
        "tip": "Explain to your audience that every real forensic database investigation starts by scoping the incident timestamp and geographic jurisdiction.",
        "viz": {
            "type": "case-file",
            "data": {
                "caseId": "CASE #2024-MURDER-SQL",
                "caseName": "The SQL City Homicide Investigation",
                "theme": "detective",
                "stageNumber": 1,
                "totalStages": 7,
                "briefing": "At 03:00 AM on Jan 15, 2024, emergency dispatch reported a homicide in SQL City. The perpetrator fled the scene. Inspect the crime scene report to find initial leads on witnesses.",
                "clues": [
                    {
                        "id": 1,
                        "title": "Crime Scene Dispatch Report",
                        "status": "current",
                        "lead": "Search crime_scene_reports for city = 'SQL City' on 2024-01-15."
                    },
                    {
                        "id": 2,
                        "title": "Locate the 2 Eyewitnesses",
                        "status": "locked",
                        "lead": "Find the resident on Franklin Ave and the resident on Northwestern Dr."
                    },
                    {
                        "id": 3,
                        "title": "Witness Transcripts",
                        "status": "locked",
                        "lead": "Read witness testimony in witness_interviews."
                    },
                    {
                        "id": 4,
                        "title": "Gym Membership Record",
                        "status": "locked",
                        "lead": "Match 48Z gold membership and check-in timestamp."
                    },
                    {
                        "id": 5,
                        "title": "The Hitman Apprehended",
                        "status": "locked",
                        "lead": "Verify vehicle plate H42W and arrest the shooter."
                    },
                    {
                        "id": 6,
                        "title": "The Mastermind Behind the Hit",
                        "status": "locked",
                        "lead": "Unmask the wealthy red-haired woman with the Tesla Model S."
                    }
                ],
                "rawEvidenceSnippet": "POLICE DISPATCH LOG:\n[2024-01-15 03:14:02 EST] 911 CALL RECEIVED - SHOTS FIRED IN SQL CITY CENTRAL PLAZA.\nUNIT 42 RESPONDING. CORONER DISPATCHED."
            }
        },
        "solution": {
            "approach": "Filter the crime_scene_reports table with matching city, type, and date.",
            "code": "SELECT * FROM crime_scene_reports WHERE city = 'SQL City' AND type = 'murder' AND date = '2024-01-15';",
            "timeComplexity": "O(N)",
            "spaceComplexity": "O(1)",
            "explanationPoints": [
                "The report notes: 'Security footage reveals that there were 2 witnesses. The first witness lives at the last house on Northwestern Dr. The second witness, named Annabel, lives somewhere on Franklin Ave.'",
                "We now have concrete search parameters for the `person` table!"
            ]
        }
    },
    {
        "id": "smm-2",
        "language": "sql",
        "section": "SQL Murder Mystery",
        "topic": "Phase 2: Locating the Eyewitnesses",
        "step": "Case 1.2",
        "category": "sql",
        "categoryLabel": "Detective Case",
        "tag": "Witness Search",
        "question": "Phase 2: Query the `person` table to find the IDs of both eyewitnesses",
        "explanation": {
            "points": [
                "**Clue Recall**: The report states:",
                "1. Witness 1 lives at the **last house on Northwestern Dr** (`ORDER BY address_number DESC LIMIT 1`).",
                "2. Witness 2 is named **Annabel** and lives on **Franklin Ave** (`name LIKE 'Annabel%' AND address_street_name = 'Franklin Ave'`).",
                "Query `person` to uncover their `id`, `name`, `address_number`, and `address_street_name`."
            ],
            "highlight": "Find the maximum address number on Northwestern Dr, and Annabel on Franklin Ave."
        },
        "code": "-- Witness 1: The last house on Northwestern Dr\nSELECT id, name, address_number, address_street_name\nFROM person\nWHERE address_street_name = 'Northwestern Dr'\nORDER BY address_number DESC\nLIMIT 1;\n\n-- Witness 2: Annabel on Franklin Ave\nSELECT id, name, address_number, address_street_name\nFROM person\nWHERE address_street_name = 'Franklin Ave' AND name LIKE 'Annabel%';",
        "tip": "Explain that finding the 'last house' is cleanly expressed with ORDER BY address_number DESC LIMIT 1.",
        "viz": {
            "type": "case-file",
            "data": {
                "caseId": "CASE #2024-MURDER-SQL",
                "caseName": "The SQL City Homicide Investigation",
                "theme": "detective",
                "stageNumber": 2,
                "totalStages": 7,
                "briefing": "We know the addresses of both witnesses. Search the municipal civic registry (person table) to obtain their person_ids.",
                "clues": [
                    {
                        "id": 1,
                        "title": "Crime Scene Dispatch Report",
                        "status": "unlocked",
                        "lead": "Report identified 2 witnesses on Northwestern Dr & Franklin Ave.",
                        "revealedInfo": "Witness 1: Northwestern Dr (last house). Witness 2: Annabel on Franklin Ave."
                    },
                    {
                        "id": 2,
                        "title": "Locate the 2 Eyewitnesses",
                        "status": "current",
                        "lead": "Find the resident on Franklin Ave and the resident on Northwestern Dr."
                    },
                    {
                        "id": 3,
                        "title": "Witness Transcripts",
                        "status": "locked",
                        "lead": "Read witness testimony in witness_interviews."
                    }
                ],
                "suspects": [
                    {
                        "name": "Morty Schapiro",
                        "alias": "Witness #1",
                        "status": "cleared",
                        "notes": "Lives at 4919 Northwestern Dr (last house on street). Person ID: 14887."
                    },
                    {
                        "name": "Annabel Miller",
                        "alias": "Witness #2",
                        "status": "cleared",
                        "notes": "Lives at 103 Franklin Ave. Person ID: 16371."
                    }
                ]
            }
        },
        "solution": {
            "approach": "Query person table twice or with UNION to retrieve Morty Schapiro (14887) and Annabel Miller (16371).",
            "code": "SELECT id, name, address_number, address_street_name\nFROM person\nWHERE (address_street_name = 'Northwestern Dr' AND address_number = (SELECT MAX(address_number) FROM person WHERE address_street_name = 'Northwestern Dr'))\n   OR (address_street_name = 'Franklin Ave' AND name LIKE 'Annabel%');",
            "timeComplexity": "O(N log N)",
            "spaceComplexity": "O(1)",
            "explanationPoints": [
                "Witness 1 is **Morty Schapiro** (ID: `14887`) at 4919 Northwestern Dr.",
                "Witness 2 is **Annabel Miller** (ID: `16371`) at 103 Franklin Ave."
            ]
        }
    },
    {
        "id": "smm-3",
        "language": "sql",
        "section": "SQL Murder Mystery",
        "topic": "Phase 3: Interrogating Witnesses",
        "step": "Case 1.3",
        "category": "sql",
        "categoryLabel": "Detective Case",
        "tag": "Witness Interviews",
        "question": "Phase 3: Read witness interview transcripts for Morty (14887) and Annabel (16371)",
        "explanation": {
            "points": [
                "**Detective Action**: Search the `witness_interviews` table where `person_id IN (14887, 16371)`.",
                "Pay close attention to:",
                "- The gym membership bag details and membership code prefix.",
                "- The partial vehicle license plate letters.",
                "- The date when the witness recognized the killer at the gym."
            ],
            "highlight": "Query witness_interviews for person_id IN (14887, 16371) to extract killer leads."
        },
        "code": "-- PHASE 3: Read the transcripts of both witnesses\nSELECT person_id, transcript\nFROM witness_interviews\nWHERE person_id IN (14887, 16371);",
        "tip": "Witness interviews in forensic SQL queries give qualitative unstructured leads that map to structured search queries.",
        "viz": {
            "type": "case-file",
            "data": {
                "caseId": "CASE #2024-MURDER-SQL",
                "caseName": "The SQL City Homicide Investigation",
                "theme": "detective",
                "stageNumber": 3,
                "totalStages": 7,
                "briefing": "Detectives recorded interviews with Morty and Annabel. Inspect their testimony transcripts.",
                "clues": [
                    {
                        "id": 1,
                        "title": "Crime Scene Dispatch Report",
                        "status": "unlocked",
                        "lead": "Report verified murder.",
                        "revealedInfo": "Identified Morty Schapiro and Annabel Miller as sole eyewitnesses."
                    },
                    {
                        "id": 2,
                        "title": "Locate the 2 Eyewitnesses",
                        "status": "unlocked",
                        "lead": "IDs found.",
                        "revealedInfo": "Morty Schapiro (14887), Annabel Miller (16371)."
                    },
                    {
                        "id": 3,
                        "title": "Witness Transcripts",
                        "status": "current",
                        "lead": "Analyze testimony in witness_interviews."
                    }
                ],
                "rawEvidenceSnippet": "TESTIMONY SNIPPET:\nMorty: 'He had a Get Fit Now Gym bag. The membership number started with 48Z. Only gold members have those. Car plate included H42W.'\nAnnabel: 'I recognized the killer from my gym when I worked out on Jan 9th.'"
            }
        },
        "solution": {
            "approach": "Query witness_interviews for both person_ids.",
            "code": "SELECT person_id, transcript FROM witness_interviews WHERE person_id IN (14887, 16371);",
            "timeComplexity": "O(1) with PK lookup",
            "spaceComplexity": "O(1)",
            "explanationPoints": [
                "Morty reveals: Membership starts with **'48Z'**, must be **gold**, vehicle plate contains **'H42W'**.",
                "Annabel reveals: Killer was at the gym on **January 9th, 2024**."
            ]
        }
    },
    {
        "id": "smm-4",
        "language": "sql",
        "section": "SQL Murder Mystery",
        "topic": "Phase 4: The Get Fit Now Gym Trail",
        "step": "Case 1.4",
        "category": "sql",
        "categoryLabel": "Detective Case",
        "tag": "Gym Records",
        "question": "Phase 4: Find gym members with '48Z%' gold status who checked in on 2024-01-09",
        "explanation": {
            "points": [
                "**Detective Action**: Join `get_fit_now_members m` and `get_fit_now_checkins c`.",
                "Criteria from witness testimony:",
                "1. `m.id LIKE '48Z%'`",
                "2. `m.membership_status = 'gold'`",
                "3. `c.check_in_date = '2024-01-09'`",
                "This narrows our suspect list down to 2 individuals!"
            ],
            "highlight": "Join gym members with check-ins on 2024-01-09 matching 48Z% and gold status."
        },
        "code": "-- PHASE 4: Cross-reference gym members and check-ins\nSELECT \n  m.id AS membership_id,\n  m.person_id,\n  m.name,\n  m.membership_status,\n  c.check_in_date,\n  c.check_in_time\nFROM get_fit_now_members m\nJOIN get_fit_now_checkins c ON m.id = c.membership_id\nWHERE m.id LIKE '48Z%'\n  AND m.membership_status = 'gold'\n  AND c.check_in_date = '2024-01-09';",
        "tip": "Joining the membership roster with timestamp check-ins produces a tight suspect pool.",
        "viz": {
            "type": "case-file",
            "data": {
                "caseId": "CASE #2024-MURDER-SQL",
                "caseName": "The SQL City Homicide Investigation",
                "theme": "detective",
                "stageNumber": 4,
                "totalStages": 7,
                "briefing": "Search gym records for members whose bags start with '48Z' who visited on Jan 9th.",
                "clues": [
                    {
                        "id": 4,
                        "title": "Gym Membership Record",
                        "status": "current",
                        "lead": "Match 48Z gold members checked in on 2024-01-09."
                    }
                ],
                "suspects": [
                    {
                        "name": "Joe Germuska",
                        "alias": "Member #48Z7A",
                        "status": "prime_suspect",
                        "notes": "Checked in at 16:00. Person ID: 28819."
                    },
                    {
                        "name": "Jeremy Bowers",
                        "alias": "Member #48Z55",
                        "status": "prime_suspect",
                        "notes": "Checked in at 15:30. Person ID: 67318."
                    }
                ]
            }
        },
        "solution": {
            "approach": "Join members and checkins filtering on 48Z%, gold status, and Jan 9th date.",
            "code": "SELECT m.person_id, m.name, m.id FROM get_fit_now_members m JOIN get_fit_now_checkins c ON m.id = c.membership_id WHERE m.id LIKE '48Z%' AND m.membership_status = 'gold' AND c.check_in_date = '2024-01-09';",
            "timeComplexity": "O(N)",
            "spaceComplexity": "O(1)",
            "explanationPoints": [
                "Two prime suspects identified: **Joe Germuska** (Person ID: 28819) and **Jeremy Bowers** (Person ID: 67318).",
                "Next clue: Check their driver's licenses for plate containing 'H42W'!"
            ]
        }
    },
    {
        "id": "smm-5",
        "language": "sql",
        "section": "SQL Murder Mystery",
        "topic": "Phase 5: The Vehicle & Killer Match",
        "step": "Case 1.5",
        "category": "sql",
        "categoryLabel": "Detective Case",
        "tag": "Suspect Apprehended",
        "question": "Phase 5: Check vehicle license plates of Joe Germuska & Jeremy Bowers to identify the shooter",
        "explanation": {
            "points": [
                "**Detective Action**: Join `person p` and `drivers_licenses dl` for suspect IDs `(28819, 67318)`.",
                "Match the plate number against Morty's testimony: `dl.plate_number LIKE '%H42W%'`.",
                "Who drives the getaway car with plate matching H42W?",
                "Click **▶ Run** to make the arrest!"
            ],
            "highlight": "Join person and drivers_licenses for both suspects filtering for plate_number LIKE '%H42W%'."
        },
        "code": "-- PHASE 5: Find which suspect drives the car with plate H42W\nSELECT \n  p.id AS person_id,\n  p.name,\n  dl.plate_number,\n  dl.car_make,\n  dl.car_model,\n  dl.gender,\n  dl.hair_color\nFROM person p\nJOIN drivers_licenses dl ON p.license_id = dl.id\nWHERE p.id IN (28819, 67318)\n  AND dl.plate_number LIKE '%H42W%';",
        "tip": "Explain how cross-referencing vehicle registration with physical evidence establishes definitive proof.",
        "viz": {
            "type": "case-file",
            "data": {
                "caseId": "CASE #2024-MURDER-SQL",
                "caseName": "The SQL City Homicide Investigation",
                "theme": "detective",
                "stageNumber": 5,
                "totalStages": 7,
                "briefing": "One of our two suspects drives the getaway vehicle with plate H42W. Query the Department of Motor Vehicles registry.",
                "clues": [
                    {
                        "id": 5,
                        "title": "The Hitman Apprehended",
                        "status": "unlocked",
                        "lead": "Plate H42W verified.",
                        "revealedInfo": "Jeremy Bowers drives Chevrolet Spark plate 0H42W2. HE IS THE SHOOTER!"
                    }
                ],
                "suspects": [
                    {
                        "name": "Joe Germuska",
                        "status": "cleared",
                        "notes": "Plate 99AB41 does not match getaway car. Cleared of charges."
                    },
                    {
                        "name": "Jeremy Bowers",
                        "alias": "The Hitman",
                        "status": "prime_suspect",
                        "notes": "Drives Chevrolet Spark plate 0H42W2. Gold gym member 48Z55. ARRESTED!"
                    }
                ]
            }
        },
        "solution": {
            "approach": "Match suspects to drivers licenses where plate_number LIKE '%H42W%'.",
            "code": "SELECT p.id, p.name, dl.plate_number, dl.car_make, dl.car_model FROM person p JOIN drivers_licenses dl ON p.license_id = dl.id WHERE dl.plate_number LIKE '%H42W%';",
            "timeComplexity": "O(1)",
            "spaceComplexity": "O(1)",
            "explanationPoints": [
                "**Jeremy Bowers** (Person ID: `67318`) drives a Chevrolet Spark with plate **`0H42W2`**.",
                "Jeremy Bowers is formally arrested as the hitman! But wait... did he act alone?"
            ]
        }
    },
    {
        "id": "smm-6",
        "language": "sql",
        "section": "SQL Murder Mystery",
        "topic": "Phase 6: The Killer's Secret Confession",
        "step": "Case 1.6",
        "category": "sql",
        "categoryLabel": "Detective Case",
        "tag": "Confession",
        "question": "Phase 6: Interrogate Jeremy Bowers (67318) in witness_interviews to discover who hired him",
        "explanation": {
            "points": [
                "**The Plot Twist**: In police custody, Jeremy Bowers confesses that he was just a hired hitman!",
                "Query `witness_interviews` where `person_id = 67318` to read his full confession.",
                "Identify the physical traits, vehicle, and events attended by the true mastermind who paid for the hit."
            ],
            "highlight": "Query witness_interviews where person_id = 67318 to read Jeremy Bowers' confession."
        },
        "code": "-- PHASE 6: Read Jeremy Bowers' custodial confession\nSELECT person_id, transcript\nFROM witness_interviews\nWHERE person_id = 67318;",
        "tip": "Every great mystery has a mastermind behind the triggerman. This tests multi-constraint join logic.",
        "viz": {
            "type": "case-file",
            "data": {
                "caseId": "CASE #2024-MURDER-SQL",
                "caseName": "The SQL City Homicide Investigation",
                "theme": "detective",
                "stageNumber": 6,
                "totalStages": 7,
                "briefing": "The hitman is talking. Read the transcript to identify the mastermind who funded the hit.",
                "clues": [
                    {
                        "id": 6,
                        "title": "The Mastermind Behind the Hit",
                        "status": "current",
                        "lead": "Confession reveals female, red hair, height 65-67 inches, Tesla Model S, attended SQL Symphony Concert 3 times in Dec 2023."
                    }
                ],
                "rawEvidenceSnippet": "CONFESSION TRANSCRIPT:\n'I was hired by a woman with a lot of money. Around 5\'5\" (65\") or 5\'7\" (67\"). Red hair, drove a Tesla Model S. Attended the SQL Symphony Concert 3 times in December 2023.'"
            }
        },
        "solution": {
            "approach": "Query witness_interviews for Jeremy Bowers' ID (67318).",
            "code": "SELECT transcript FROM witness_interviews WHERE person_id = 67318;",
            "timeComplexity": "O(1)",
            "spaceComplexity": "O(1)",
            "explanationPoints": [
                "Mastermind traits: Female, Red hair, Height between 65\" and 67\", drives a Tesla Model S.",
                "Crucial event check-in clue: Attended the 'SQL Symphony Concert' exactly **3 times** in December 2023 (`date LIKE '2023-12%'`)."
            ]
        }
    },
    {
        "id": "smm-7",
        "language": "sql",
        "section": "SQL Murder Mystery",
        "topic": "Phase 7: Unmasking the Wealthy Mastermind",
        "step": "Case 1.7",
        "category": "sql",
        "categoryLabel": "Detective Case",
        "tag": "Case Solved!",
        "question": "Phase 7: Join drivers_licenses, person, and facebook_event_checkins to arrest the mastermind!",
        "explanation": {
            "points": [
                "**Final Strike**: Combine all evidence into one master query:",
                "- `dl.gender = 'female'` AND `dl.hair_color = 'red'`",
                "- `dl.car_make = 'Tesla'` AND `dl.car_model = 'Model S'`",
                "- `dl.height BETWEEN 65 AND 67`",
                "- Attended `'SQL Symphony Concert'` **3 times** in December 2023 (`HAVING COUNT(*) = 3`).",
                "Execute the query to unmask the mastermind and close the case!"
            ],
            "highlight": "Join person, drivers_licenses, and facebook_event_checkins with HAVING COUNT(*) = 3."
        },
        "code": "-- PHASE 7: Find the woman behind the murder\nSELECT \n  p.id,\n  p.name AS mastermind_name,\n  dl.car_make,\n  dl.car_model,\n  COUNT(*) AS concert_attendances\nFROM person p\nJOIN drivers_licenses dl ON p.license_id = dl.id\nJOIN facebook_event_checkins fb ON p.id = fb.person_id\nWHERE dl.gender = 'female'\n  AND dl.hair_color = 'red'\n  AND dl.car_make = 'Tesla'\n  AND dl.car_model = 'Model S'\n  AND dl.height BETWEEN 65 AND 67\n  AND fb.event_name = 'SQL Symphony Concert'\n  AND fb.date LIKE '2023-12%'\nGROUP BY p.id, p.name\nHAVING COUNT(*) = 3;",
        "tip": "Congratulate your students on successfully solving the SQL Murder Mystery by chaining DQL, JOINs, and HAVING clauses!",
        "viz": {
            "type": "case-file",
            "data": {
                "caseId": "CASE #2024-MURDER-SQL",
                "caseName": "The SQL City Homicide Investigation",
                "theme": "detective",
                "stageNumber": 7,
                "totalStages": 7,
                "briefing": "CASE SOLVED! All evidence converged on Miranda Priestly. The arrest warrant has been executed.",
                "clues": [
                    {
                        "id": 1,
                        "title": "Crime Scene Dispatch Report",
                        "status": "unlocked",
                        "lead": "Report verified.",
                        "revealedInfo": "Witnesses identified."
                    },
                    {
                        "id": 2,
                        "title": "Locate Eyewitnesses",
                        "status": "unlocked",
                        "lead": "Morty & Annabel located.",
                        "revealedInfo": "Addresses confirmed."
                    },
                    {
                        "id": 3,
                        "title": "Witness Interviews",
                        "status": "unlocked",
                        "lead": "Gold gym member with 48Z bag & plate H42W.",
                        "revealedInfo": "48Z bag confirmed."
                    },
                    {
                        "id": 4,
                        "title": "Gym Trail",
                        "status": "unlocked",
                        "lead": "Checkin on Jan 9th.",
                        "revealedInfo": "Suspects: Joe & Jeremy."
                    },
                    {
                        "id": 5,
                        "title": "Hitman Apprehended",
                        "status": "unlocked",
                        "lead": "Jeremy Bowers arrested with plate 0H42W2.",
                        "revealedInfo": "Jeremy Bowers confessed."
                    },
                    {
                        "id": 6,
                        "title": "Mastermind Unmasked",
                        "status": "unlocked",
                        "lead": "Miranda Priestly identified.",
                        "revealedInfo": "ARREST WARRANT EXECUTED: MIRANDA PRIESTLY!"
                    }
                ],
                "suspects": [
                    {
                        "name": "Miranda Priestly",
                        "alias": "The Mastermind",
                        "status": "mastermind",
                        "notes": "Red hair, drives Tesla Model S plate VIP888. Attended 3 SQL Symphony concerts in Dec 2023. ARRESTED!"
                    }
                ]
            }
        },
        "solution": {
            "approach": "Join person, drivers licenses, and facebook event checkins filtering for female, red hair, Tesla Model S, and 3 concerts in Dec 2023.",
            "code": "SELECT p.name FROM person p JOIN drivers_licenses dl ON p.license_id = dl.id JOIN facebook_event_checkins fb ON p.id = fb.person_id WHERE dl.gender = 'female' AND dl.hair_color = 'red' AND dl.car_make = 'Tesla' AND dl.car_model = 'Model S' AND fb.event_name = 'SQL Symphony Concert' GROUP BY p.id, p.name HAVING COUNT(*) = 3;",
            "timeComplexity": "O(N log N)",
            "spaceComplexity": "O(1)",
            "explanationPoints": [
                "The query unmasks **Miranda Priestly** (ID: 99716)!",
                "She drove the red Tesla Model S and checked in to the SQL Symphony Concert 3 times in December.",
                "Congratulations! You have completed the SQL Murder Mystery investigation!"
            ]
        }
    }
]

with open(os.path.join(sql_dir, "slides.json"), "w", encoding="utf-8") as f:
    json.dump({"course": "sql-murder-mystery", "slides": sql_slides}, f, indent=2)

print(f"Generated SQL Murder Mystery: {len(sql_slides)} stages")

# ========================================================
# 2. Python Cyber Mystery: Operation ShadowByte
# ========================================================
py_dir = os.path.join(base_dir, "python-cyber-mystery")
os.makedirs(py_dir, exist_ok=True)

py_meta = {
    "id": "python-cyber-mystery",
    "title": "Python Cyber Heist: Operation ShadowByte",
    "subtitle": "Gamified Cyber Forensics Mystery — Crack Codes & Unmask a Hacker with Python",
    "emoji": "💻",
    "color": "#10b981",
    "level": "Interactive Mystery",
    "estimatedTime": "1.5 hours",
    "topics": [
        "Stage 1: Decoding the Obfuscated Transmission (Strings & Slicing)",
        "Stage 2: Server Access Log Intrusion Analysis (Lists & Dicts)",
        "Stage 3: Extracting Crypto Wallets from Memory Dumps (Regex)",
        "Stage 4: Cracking the C2 Command Token (Hashlib & Security)",
        "Stage 5: Reconstructing Network Hop Route (BFS Traversal)",
        "Stage 6: The Suspect Dossier Validation (OOP & Classes)",
        "Stage 7: Executing the Interpol Arrest Warrant"
    ],
    "description": "A midnight cyber heist drained $10M from CyberTech Bank. As Lead Python Forensics Officer, write Python scripts to decode ciphers, parse server logs, extract bitcoin wallets with regex, crack hashes, and unmask the hacker."
}

with open(os.path.join(py_dir, "meta.json"), "w", encoding="utf-8") as f:
    json.dump(py_meta, f, indent=2)

py_slides = [
    {
        "id": "pcm-1",
        "language": "python",
        "section": "Operation ShadowByte",
        "topic": "Stage 1: Decoding the Obfuscated Transmission",
        "step": "Stage 1.1",
        "category": "basics",
        "categoryLabel": "Cyber Forensics",
        "tag": "String Forensics",
        "question": "Stage 1: Decode the hacker's reversed and shifted signature string",
        "explanation": {
            "points": [
                "**Incident Briefing**: At 02:41 AM, the intrusion detection system caught a scrambled packet payload on port 8080.",
                "Forensics analysis reveals the hacker reversed the message and added junk padding characters.",
                "**Your Mission**: Write a Python function `decode_transmission(payload: str) -> str` that:",
                "1. Strips leading and trailing whitespace.",
                "2. Reverses the string using slice notation `[::-1]`.",
                "3. Replaces `'#'` symbols with spaces.",
                "Execute the code to reveal the hacker's hidden alias."
            ],
            "highlight": "Use strip(), slicing [::-1], and replace('#', ' ') to uncover the hacker's signature."
        },
        "code": "# STAGE 1: Decode the hacker's scrambled signature\ncorrupted_payload = \"  #etyBwodahS#emanedoC#:rotartnep#edisni#ma#I  \"\n\ndef decode_transmission(payload: str) -> str:\n    # 1. Strip whitespace\n    cleaned = payload.strip()\n    # 2. Reverse string using slicing\n    reversed_str = cleaned[::-1]\n    # 3. Replace '#' with spaces\n    decoded = reversed_str.replace('#', ' ')\n    return decoded\n\nresult = decode_transmission(corrupted_payload)\nprint(f\"[DECRYPTED HEADER]: {result}\")",
        "tip": "Explain to learners that string slicing [::-1] creates a reversed copy in O(N) time with Python's fast C-level iterator.",
        "viz": {
            "type": "case-file",
            "data": {
                "caseId": "CASE #CYBER-2024-88A",
                "caseName": "Operation ShadowByte: CyberTech Bank Heist",
                "theme": "cyber",
                "stageNumber": 1,
                "totalStages": 7,
                "briefing": "CyberTech Bank's mainframe was breached at 02:41 AM. An encrypted transmission was captured in server memory. Reverse engineer the text payload.",
                "clues": [
                    {
                        "id": 1,
                        "title": "Decoded Header Transmission",
                        "status": "current",
                        "lead": "Decode corrupted_payload to reveal the hacker's alias."
                    },
                    {
                        "id": 2,
                        "title": "Malicious Server IP Address",
                        "status": "locked",
                        "lead": "Filter through server access logs."
                    },
                    {
                        "id": 3,
                        "title": "Stolen Asset Wallet Address",
                        "status": "locked",
                        "lead": "Extract crypto addresses with regular expressions."
                    },
                    {
                        "id": 4,
                        "title": "Cracked C2 Security Hash",
                        "status": "locked",
                        "lead": "Crack SHA-256 access token."
                    },
                    {
                        "id": 5,
                        "title": "Infiltration Network Route",
                        "status": "locked",
                        "lead": "Traverse server jump nodes using BFS."
                    },
                    {
                        "id": 6,
                        "title": "The Master Hacker Arrest",
                        "status": "locked",
                        "lead": "Generate cryptographic Interpol warrant."
                    }
                ],
                "rawEvidenceSnippet": "PACKET DUMP PORT 8080:\n0x7FFE2A: 20 20 23 65 74 79 42 77 6f 64 61 68 53 23\nASCII: '  #etyBwodahS#emanedoC#:rotartnep#edisni#ma#I  '"
            }
        },
        "solution": {
            "approach": "Clean whitespace with strip(), reverse with [::-1], and replace '#' with spaces.",
            "code": "corrupted_payload = \"  #etyBwodahS#emanedoC#:rotartnep#edisni#ma#I  \"\nprint(corrupted_payload.strip()[::-1].replace('#', ' '))",
            "timeComplexity": "O(N)",
            "spaceComplexity": "O(N)",
            "explanationPoints": [
                "Decoded message: `'I am inside penetrator: Codename ShadowByte'`.",
                "We now know the adversary's handle: **ShadowByte**!"
            ]
        }
    },
    {
        "id": "pcm-2",
        "language": "python",
        "section": "Operation ShadowByte",
        "topic": "Stage 2: Server Access Log Intrusion Analysis",
        "step": "Stage 1.2",
        "category": "collections",
        "categoryLabel": "Cyber Forensics",
        "tag": "Log Forensics",
        "question": "Stage 2: Filter server access logs to isolate the rogue IP draining the vault",
        "explanation": {
            "points": [
                "**Forensics Evidence**: The bank recorded hundreds of web requests during the incident window.",
                "Only **ONE** specific request hit the classified vault endpoint `/api/v2/vault/drain` with status code `200`.",
                "**Your Mission**: Write a Python script to filter the `server_logs` list of dictionaries.",
                "Extract the intruder's `ip`, `timestamp`, and `request_id`."
            ],
            "highlight": "Filter logs where endpoint == '/api/v2/vault/drain' and status == 200."
        },
        "code": "# STAGE 2: Filter server access logs\nserver_logs = [\n    {\"ip\": \"192.168.1.15\", \"endpoint\": \"/login\", \"status\": 200, \"time\": \"02:15:10\"},\n    {\"ip\": \"10.0.0.42\", \"endpoint\": \"/dashboard\", \"status\": 200, \"time\": \"02:22:45\"},\n    {\"ip\": \"198.51.100.77\", \"endpoint\": \"/api/v2/vault/drain\", \"status\": 200, \"time\": \"02:41:19\"},\n    {\"ip\": \"172.16.0.8\", \"endpoint\": \"/settings\", \"status\": 403, \"time\": \"02:45:00\"},\n    {\"ip\": \"192.168.1.15\", \"endpoint\": \"/logout\", \"status\": 200, \"time\": \"02:50:11\"}\n]\n\ndef isolate_intruder_ip(logs: list[dict]) -> dict:\n    for log in logs:\n        if log[\"endpoint\"] == \"/api/v2/vault/drain\" and log[\"status\"] == 200:\n            return log\n    return {}\n\nbreach_event = isolate_intruder_ip(server_logs)\nprint(f\"[SUSPECT IP DETECTED]: {breach_event['ip']} at {breach_event['time']}\")",
        "tip": "Explain that dictionary lookups log['endpoint'] are O(1) and list comprehensions cleanly express analytical queries.",
        "viz": {
            "type": "case-file",
            "data": {
                "caseId": "CASE #CYBER-2024-88A",
                "caseName": "Operation ShadowByte: CyberTech Bank Heist",
                "theme": "cyber",
                "stageNumber": 2,
                "totalStages": 7,
                "briefing": "Search through server access log dictionaries to isolate the exact IP that triggered the unauthorized vault drain.",
                "clues": [
                    {
                        "id": 1,
                        "title": "Decoded Header Transmission",
                        "status": "unlocked",
                        "lead": "Header reversed.",
                        "revealedInfo": "Hacker alias: 'ShadowByte'."
                    },
                    {
                        "id": 2,
                        "title": "Malicious Server IP Address",
                        "status": "current",
                        "lead": "Filter access logs for endpoint '/api/v2/vault/drain'."
                    },
                    {
                        "id": 3,
                        "title": "Stolen Asset Wallet Address",
                        "status": "locked",
                        "lead": "Extract crypto addresses with regular expressions."
                    }
                ],
                "suspects": [
                    {
                        "name": "ShadowByte",
                        "alias": "The Infiltrator",
                        "status": "prime_suspect",
                        "notes": "Origin IP: 198.51.100.77. Executed unauthorized /vault/drain command at 02:41:19 AM."
                    }
                ]
            }
        },
        "solution": {
            "approach": "Iterate through the dictionary logs and check endpoint and status.",
            "code": "breach = next(log for log in server_logs if log['endpoint'] == '/api/v2/vault/drain')\nprint(f\"Intruder IP: {breach['ip']}\")",
            "timeComplexity": "O(N)",
            "spaceComplexity": "O(1)",
            "explanationPoints": [
                "Intruder IP isolated: **`198.51.100.77`**.",
                "Timestamp of theft confirmed at **02:41:19 AM**."
            ]
        }
    },
    {
        "id": "pcm-3",
        "language": "python",
        "section": "Operation ShadowByte",
        "topic": "Stage 3: Extracting Crypto Wallets with Regex",
        "step": "Stage 1.3",
        "category": "collections",
        "categoryLabel": "Cyber Forensics",
        "tag": "Regex Extraction",
        "question": "Stage 3: Use Python Regular Expressions to parse Bitcoin wallet addresses from messy memory text",
        "explanation": {
            "points": [
                "**Memory Dump Retrieved**: Technicians recovered a corrupted memory block string containing debug garbage.",
                "Bitcoin SegWit wallet addresses start with **`bc1`** followed by 25 to 39 alphanumeric characters.",
                "**Your Mission**: Use Python's built-in **`re`** module (`import re`) and `re.findall()` to extract the target destination wallet.",
                "Pattern: `r'bc1[a-zA-HJ-NP-Z0-9]{25,39}'`."
            ],
            "highlight": "Use re.findall(r'bc1[a-zA-HJ-NP-Z0-9]{25,39}', memory_dump) to isolate crypto wallets."
        },
        "code": "import re\n\nraw_memory_dump = \"\"\"\n[DEBUG 0x889] SYS_INIT_OK token=9910-AA\n[TRANSFER] target=bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq amount=50000BTC\n[ERR 0x012] checksum_mismatch aux=bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4\n[MEM_CORRUPT] random_string_garbage_no_match\n\"\"\"\n\ndef extract_crypto_wallets(raw_text: str) -> list[str]:\n    # SegWit Bitcoin regex pattern\n    pattern = r'bc1[a-zA-HJ-NP-Z0-9]{25,39}'\n    wallets = re.findall(pattern, raw_text)\n    return wallets\n\nfound_wallets = extract_crypto_wallets(raw_memory_dump)\nprint(f\"[EXTRACTED WALLET ADDRESSES]: {found_wallets}\")\nprint(f\"[PRIMARY TRANSFER RECIPIENT]: {found_wallets[0]}\")",
        "tip": "Explain to learners that regex is an essential daily skill for data engineers, cybersecurity analysts, and scraping tools.",
        "viz": {
            "type": "case-file",
            "data": {
                "caseId": "CASE #CYBER-2024-88A",
                "caseName": "Operation ShadowByte: CyberTech Bank Heist",
                "theme": "cyber",
                "stageNumber": 3,
                "totalStages": 7,
                "briefing": "Scan raw memory dumps using regex pattern matching to track the recipient cryptocurrency wallet addresses.",
                "clues": [
                    {
                        "id": 1,
                        "title": "Decoded Header Transmission",
                        "status": "unlocked",
                        "lead": "Alias decoded.",
                        "revealedInfo": "ShadowByte."
                    },
                    {
                        "id": 2,
                        "title": "Malicious Server IP Address",
                        "status": "unlocked",
                        "lead": "Log isolated.",
                        "revealedInfo": "IP: 198.51.100.77."
                    },
                    {
                        "id": 3,
                        "title": "Stolen Asset Wallet Address",
                        "status": "current",
                        "lead": "Extract SegWit bitcoin address starting with bc1."
                    }
                ],
                "rawEvidenceSnippet": "HEX SCAN 0x4B0:\n74 61 72 67 65 74 3d 62 63 31 71 61 72 30 73 72 72 72 37 78 66 6b 76 79 35 6c 36 34 33 6c 79 64 6e 77 39 72 65 35 39 67 74 7a 7a 77 66 35 6d 64 71"
            }
        },
        "solution": {
            "approach": "Import re and execute re.findall(r'bc1[a-zA-HJ-NP-Z0-9]{25,39}', text).",
            "code": "import re\nwallets = re.findall(r'bc1[a-zA-HJ-NP-Z0-9]{25,39}', raw_memory_dump)\nprint(f\"Destination Wallet: {wallets[0]}\")",
            "timeComplexity": "O(N)",
            "spaceComplexity": "O(K) extracted matches",
            "explanationPoints": [
                "Target destination wallet isolated: **`bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq`**.",
                "We can now trace this wallet across the public blockchain ledger!"
            ]
        }
    },
    {
        "id": "pcm-4",
        "language": "python",
        "section": "Operation ShadowByte",
        "topic": "Stage 4: Cracking the C2 Command Token",
        "step": "Stage 1.4",
        "category": "advanced",
        "categoryLabel": "Cyber Forensics",
        "tag": "Cryptographic Hash",
        "question": "Stage 4: Crack the hacker's SHA-256 Command & Control access token",
        "explanation": {
            "points": [
                "**Cryptographic Evidence**: The hacker authenticated their session using an authorization token whose **SHA-256 hash** was logged:",
                "`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` (example hash).",
                "Security teams recovered a candidate wordlist of suspected passphrases.",
                "**Your Mission**: Use Python's `hashlib.sha256()` module to hash each candidate word until finding the match.",
                "Print the cracked plaintext token."
            ],
            "highlight": "Loop through candidate passwords and compare hashlib.sha256(w.encode()).hexdigest() with target hash."
        },
        "code": "import hashlib\n\n# Target SHA-256 hash recovered from server auth header\n# (Hash of 'shadow_protocol_2024')\ntarget_hash = \"37a892b1b369528f80f1e8dcbc14838321043f2537c95a287fa75908b98b046e\"\n\ncandidate_wordlist = [\n    \"admin123\",\n    \"cyber_security\",\n    \"bank_vault_master\",\n    \"shadow_protocol_2024\",\n    \"super_secret_token\"\n]\n\ndef crack_sha256(target: str, wordlist: list[str]) -> str:\n    for word in wordlist:\n        # Convert string to bytes and compute SHA-256 hex digest\n        digest = hashlib.sha256(word.encode('utf-8')).hexdigest()\n        if digest == target:\n            return word\n    return \"NOT_FOUND\"\n\ncracked_token = crack_sha256(target_hash, candidate_wordlist)\nprint(f\"[CRACKED PLAINTEXT TOKEN]: {cracked_token}\")",
        "tip": "Explain how one-way cryptographic hashing works and why rainbow tables and wordlists are used in forensic audits.",
        "viz": {
            "type": "case-file",
            "data": {
                "caseId": "CASE #CYBER-2024-88A",
                "caseName": "Operation ShadowByte: CyberTech Bank Heist",
                "theme": "cyber",
                "stageNumber": 4,
                "totalStages": 7,
                "briefing": "Compute SHA-256 digests over dictionary candidates to reverse-engineer the hacker's master authorization token.",
                "clues": [
                    {
                        "id": 4,
                        "title": "Cracked C2 Security Hash",
                        "status": "current",
                        "lead": "Match target SHA-256 hash against candidate wordlist."
                    }
                ],
                "rawEvidenceSnippet": "AUTH HEADER RECOVERED:\nAuthorization: Bearer [SHA256: 37a892b1b369528f80f1e8dcbc14838321043f2537c95a287fa75908b98b046e]"
            }
        },
        "solution": {
            "approach": "Hash each candidate word with hashlib.sha256(word.encode()).hexdigest() and compare.",
            "code": "import hashlib\ntoken = next(w for w in candidate_wordlist if hashlib.sha256(w.encode()).hexdigest() == target_hash)\nprint(f\"Token: {token}\")",
            "timeComplexity": "O(W) where W is wordlist length",
            "spaceComplexity": "O(1)",
            "explanationPoints": [
                "Plaintext master key cracked: **`shadow_protocol_2024`**.",
                "This passphrase allows us to decrypt the hacker's server hop telemetry!"
            ]
        }
    },
    {
        "id": "pcm-5",
        "language": "python",
        "section": "Operation ShadowByte",
        "topic": "Stage 5: Reconstructing Lateral Network Hop Route",
        "step": "Stage 1.5",
        "category": "advanced",
        "categoryLabel": "Cyber Forensics",
        "tag": "Graph BFS Traversal",
        "question": "Stage 5: Use Breadth-First Search (BFS) to trace the shortest lateral intrusion route across server nodes",
        "explanation": {
            "points": [
                "**Network Topology Recovered**: The bank's internal network is modeled as an adjacency list graph of connected server nodes.",
                "The hacker started at `'GatewayRouter'` and laterally jumped until reaching `'ColdStorageVault'`.",
                "**Your Mission**: Write a BFS algorithm using Python's `collections.deque` to find the shortest hop path from `'GatewayRouter'` to `'ColdStorageVault'`.",
                "Return the exact list of server node names visited in sequence."
            ],
            "highlight": "Use collections.deque for Breadth-First Search (BFS) to reconstruct the intrusion path."
        },
        "code": "from collections import deque\n\n# Network topology adjacency graph\nnetwork_topology = {\n    'GatewayRouter': ['FirewallNode', 'GuestWiFi'],\n    'GuestWiFi': ['PublicKiosk'],\n    'FirewallNode': ['AuthProxy', 'DevStaging'],\n    'DevStaging': ['LegacyDB'],\n    'AuthProxy': ['CoreAppServer', 'BackupCluster'],\n    'CoreAppServer': ['ColdStorageVault'],\n    'BackupCluster': ['ColdStorageVault'],\n    'ColdStorageVault': []\n}\n\ndef find_shortest_intrusion_path(graph: dict, start: str, target: str) -> list[str]:\n    queue = deque([[start]])\n    visited = {start}\n    \n    while queue:\n        path = queue.popleft()\n        node = path[-1]\n        \n        if node == target:\n            return path\n            \n        for neighbor in graph.get(node, []):\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(path + [neighbor])\n                \n    return []\n\nhop_path = find_shortest_intrusion_path(network_topology, 'GatewayRouter', 'ColdStorageVault')\nprint(f\"[INTRUSION ROUTE]: {' -> '.join(hop_path)}\")",
        "tip": "Explain how BFS guarantees the shortest path in unweighted graphs and why queues (deque) provide O(1) popleft operations.",
        "viz": {
            "type": "case-file",
            "data": {
                "caseId": "CASE #CYBER-2024-88A",
                "caseName": "Operation ShadowByte: CyberTech Bank Heist",
                "theme": "cyber",
                "stageNumber": 5,
                "totalStages": 7,
                "briefing": "Trace the adversary's lateral hops through the corporate intranet using Breadth-First Search traversal.",
                "clues": [
                    {
                        "id": 5,
                        "title": "Infiltration Network Route",
                        "status": "current",
                        "lead": "Traverse adjacency graph using BFS to find path to ColdStorageVault."
                    }
                ],
                "rawEvidenceSnippet": "ROUTER ROUTING TABLE DUMP:\nGatewayRouter -> FirewallNode -> AuthProxy -> CoreAppServer -> ColdStorageVault"
            }
        },
        "solution": {
            "approach": "Implement BFS queue maintaining paths to find the shortest hop sequence to ColdStorageVault.",
            "code": "from collections import deque\n# BFS pathfinding outputs 4 hops: GatewayRouter -> FirewallNode -> AuthProxy -> CoreAppServer -> ColdStorageVault",
            "timeComplexity": "O(V + E) vertices and edges",
            "spaceComplexity": "O(V)",
            "explanationPoints": [
                "Shortest lateral intrusion path verified:",
                "`GatewayRouter -> FirewallNode -> AuthProxy -> CoreAppServer -> ColdStorageVault`.",
                "All compromised pivot nodes have been flagged for quarantine!"
            ]
        }
    },
    {
        "id": "pcm-6",
        "language": "python",
        "section": "Operation ShadowByte",
        "topic": "Stage 6: The Suspect Dossier Validation",
        "step": "Stage 1.6",
        "category": "oop",
        "categoryLabel": "Cyber Forensics",
        "tag": "OOP Suspect Model",
        "question": "Stage 6: Encapsulate all recovered forensic evidence into a verified SuspectDossier class",
        "explanation": {
            "points": [
                "**Forensic Integrity**: Court warrants require evidence to be packaged in an immutable, validated data structure.",
                "**Your Mission**: Complete the `SuspectDossier` class using Python Object-Oriented Programming (OOP):",
                "- Initialize with `alias`, `ip`, `wallet`, and `token`.",
                "- Add a method `generate_warrant_hash()` that combines all 4 attributes and returns a SHA-256 fingerprint.",
                "- Ensure the fingerprint matches the verified court standard."
            ],
            "highlight": "Model suspect evidence using Python OOP and compute a cryptographic integrity checksum."
        },
        "code": "import hashlib\n\nclass SuspectDossier:\n    def __init__(self, alias: str, ip: str, wallet: str, token: str):\n        self.alias = alias\n        self.ip = ip\n        self.wallet = wallet\n        self.token = token\n        \n    def generate_warrant_hash(self) -> str:\n        raw_payload = f\"{self.alias}|{self.ip}|{self.wallet}|{self.token}\"\n        return hashlib.sha256(raw_payload.encode('utf-8')).hexdigest()\n        \n    def __repr__(self) -> str:\n        return f\"SuspectDossier(alias='{self.alias}', ip='{self.ip}')\"\n\n# Assemble evidence into dossier\ndossier = SuspectDossier(\n    alias=\"ShadowByte\",\n    ip=\"198.51.100.77\",\n    wallet=\"bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq\",\n    token=\"shadow_protocol_2024\"\n)\n\nprint(f\"[ASSEMBLED DOSSIER]: {dossier}\")\nprint(f\"[INTEGRITY CHECKSUM]: {dossier.generate_warrant_hash()}\")",
        "tip": "Demonstrate how OOP cleanly organizes disparate forensic parameters into cohesive, testable entities.",
        "viz": {
            "type": "case-file",
            "data": {
                "caseId": "CASE #CYBER-2024-88A",
                "caseName": "Operation ShadowByte: CyberTech Bank Heist",
                "theme": "cyber",
                "stageNumber": 6,
                "totalStages": 7,
                "briefing": "Package all forensic findings into an OOP SuspectDossier object and calculate the legal integrity signature.",
                "clues": [
                    {
                        "id": 6,
                        "title": "The Master Hacker Arrest",
                        "status": "current",
                        "lead": "Validate dossier integrity hash to unlock the Interpol warrant."
                    }
                ],
                "suspects": [
                    {
                        "name": "Marcus Vance",
                        "alias": "ShadowByte",
                        "status": "mastermind",
                        "notes": "Former CyberTech Security Contractor. IP: 198.51.100.77. In possession of 50,000 BTC. WROTE EXPLOIT!"
                    }
                ]
            }
        },
        "solution": {
            "approach": "Instantiate SuspectDossier with all recovered parameters and invoke generate_warrant_hash().",
            "code": "dossier = SuspectDossier('ShadowByte', '198.51.100.77', 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq', 'shadow_protocol_2024')\nprint(dossier.generate_warrant_hash())",
            "timeComplexity": "O(1)",
            "spaceComplexity": "O(1)",
            "explanationPoints": [
                "Suspect identity resolved: **Marcus Vance** (Codename: **ShadowByte**).",
                "Integrity hash verified by Interpol Cyber Command!"
            ]
        }
    },
    {
        "id": "pcm-7",
        "language": "python",
        "section": "Operation ShadowByte",
        "topic": "Stage 7: Executing the Interpol Arrest Warrant",
        "step": "Stage 1.7",
        "category": "oop",
        "categoryLabel": "Cyber Forensics",
        "tag": "Mission Accomplished",
        "question": "Stage 7: Transmit the automated warrant dispatch and claim your Certified Cyber Investigator rank!",
        "explanation": {
            "points": [
                "**FINAL MISSION BRIEFING**: You have successfully solved all 6 forensic milestones:",
                "1. Decoded the reversed header signature (`ShadowByte`).",
                "2. Isolated the intrusion IP (`198.51.100.77`).",
                "3. Extracted the destination Bitcoin wallet with regex.",
                "4. Cracked the SHA-256 Command & Control token.",
                "5. Mapped the 4-hop lateral network intrusion path with BFS.",
                "6. Packaged the legal dossier with cryptographic checksums.",
                "Click **▶ Run** to issue the digital arrest warrant and complete the mystery!"
            ],
            "highlight": "Execute the final warrant dispatch script to celebrate completing Operation ShadowByte!"
        },
        "code": "# ========================================================\n# OPERATION SHADOWBYTE: INTERPOL RED NOTICE DISPATCH\n# ========================================================\ndef execute_arrest_warrant():\n    report = \"\"\"\n    ====================================================\n    🚨 INTERPOL CYBER DEFENSE COMMAND - ARREST WARRANT 🚨\n    ====================================================\n    STATUS: CASE CLOSED - FUGITIVE APPREHENDED\n    NAME: Marcus Vance\n    ALIAS: ShadowByte\n    IP ORIGIN: 198.51.100.77\n    WALLET: bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq\n    ASSETS RECOVERED: $10,000,000.00 (50,000 BTC)\n    VERDICT: GUILTY OF CYBER INTRUSION & GRAND THEFT\n    ====================================================\n    🏆 CONGRATULATIONS LEAD INVESTIGATOR! YOU CRACKED IT!\n    ====================================================\n    \"\"\"\n    print(report)\n\nexecute_arrest_warrant()",
        "tip": "Celebrate the student's mastery of strings, collections, regular expressions, hashing, graphs, and object-oriented design in Python!",
        "viz": {
            "type": "case-file",
            "data": {
                "caseId": "CASE #CYBER-2024-88A",
                "caseName": "Operation ShadowByte: CyberTech Bank Heist",
                "theme": "cyber",
                "stageNumber": 7,
                "totalStages": 7,
                "briefing": "CASE CLOSED! Marcus Vance ('ShadowByte') was intercepted in Zurich with the private keys. $10,000,000 in assets recovered.",
                "clues": [
                    {
                        "id": 1,
                        "title": "Decoded Header Transmission",
                        "status": "unlocked",
                        "lead": "ShadowByte signature confirmed.",
                        "revealedInfo": "Reverse string decoded."
                    },
                    {
                        "id": 2,
                        "title": "Malicious Server IP",
                        "status": "unlocked",
                        "lead": "IP 198.51.100.77 isolated.",
                        "revealedInfo": "Log filtered."
                    },
                    {
                        "id": 3,
                        "title": "Stolen Asset Wallet",
                        "status": "unlocked",
                        "lead": "SegWit BTC address extracted.",
                        "revealedInfo": "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq."
                    },
                    {
                        "id": 4,
                        "title": "Cracked C2 Hash",
                        "status": "unlocked",
                        "lead": "Token cracked: shadow_protocol_2024.",
                        "revealedInfo": "SHA-256 reversed."
                    },
                    {
                        "id": 5,
                        "title": "Network Infiltration Route",
                        "status": "unlocked",
                        "lead": "BFS 4-hop path mapped.",
                        "revealedInfo": "Gateway -> Firewall -> AuthProxy -> CoreApp -> Vault."
                    },
                    {
                        "id": 6,
                        "title": "Suspect Arrested",
                        "status": "unlocked",
                        "lead": "Marcus Vance in custody.",
                        "revealedInfo": "INTERPOL RED NOTICE EXECUTED!"
                    }
                ],
                "suspects": [
                    {
                        "name": "Marcus Vance",
                        "alias": "ShadowByte",
                        "status": "mastermind",
                        "notes": "IN CUSTODY. All 50,000 BTC recovered. Case forwarded to federal court."
                    }
                ]
            }
        },
        "solution": {
            "approach": "Run execute_arrest_warrant() to output the verified mission completion report.",
            "code": "execute_arrest_warrant()",
            "timeComplexity": "O(1)",
            "spaceComplexity": "O(1)",
            "explanationPoints": [
                "Case successfully concluded!",
                "You have demonstrated proficiency across Python strings, collections, regex, hashing, graphs, and OOP."
            ]
        }
    }
]

with open(os.path.join(py_dir, "slides.json"), "w", encoding="utf-8") as f:
    json.dump({"course": "python-cyber-mystery", "slides": py_slides}, f, indent=2)

print(f"Generated Python Cyber Mystery: {len(py_slides)} stages")
