import json
import os

target_dir = "/Users/nijanthanrajachandran/Ai/pylearn-vite/content/sql-mastery"

slides = []
current_id = 1

def add_slide(section, topic, step, tag, question, explanation_points, highlight, code, tip, viz, solution=None):
    global current_id
    slide = {
        "id": f"sql-{current_id}",
        "language": "sql",
        "section": section,
        "topic": topic,
        "step": step,
        "category": "sql",
        "categoryLabel": section.split(". ")[-1] if ". " in section else section,
        "tag": tag,
        "question": question,
        "explanation": {
            "points": explanation_points,
            "highlight": highlight
        },
        "code": code,
        "tip": tip,
        "viz": viz
    }
    if solution:
        slide["solution"] = solution
    slides.append(slide)
    current_id += 1

# ==========================================
# SECTION 1: Introduction (5 slides)
# ==========================================
sec1 = "1. Introduction"

add_slide(
    sec1, "Basics of Databases", "1.1", "Lesson",
    "What is a Relational Database Management System (RDBMS) and how is data structured?",
    [
        "A **Database** is an organized electronic repository managed by a **DBMS** (Database Management System).",
        "In **Relational Databases (RDBMS)**, data is stored in two-dimensional **tables** consisting of rows (tuples/records) and columns (attributes).",
        "Each column has a specific **data type** (INTEGER, TEXT, REAL), and rows are uniquely identifiable through a **Primary Key**.",
        "Relational guarantees follow the **ACID principle**: Atomicity, Consistency, Isolation, and Durability."
    ],
    "Relational databases store structured data in rows and columns, enforcing ACID guarantees.",
    "-- Inspect existing tables in our bookstore SQLite database\nSELECT name, type \nFROM sqlite_master \nWHERE type = 'table' AND name NOT LIKE 'sqlite_%'\nORDER BY name;",
    "Demonstrate to students that sqlite_master is SQLite's built-in system catalog containing schema definitions.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "sqlite_master (System Catalog)",
            "columns": [
                {"name": "name", "type": "TEXT", "isPk": True},
                {"name": "type", "type": "TEXT"},
                {"name": "description", "type": "TEXT"}
            ],
            "rows": [
                ["authors", "table", "Stores book writers, nationalities, and tiers"],
                ["books", "table", "Inventory catalog with pricing, stock, and ratings"],
                ["customers", "table", "Registered shoppers and referral linkages"],
                ["orders", "table", "Purchase transactions and fulfillment statuses"],
                ["order_items", "table", "Line items linking orders to specific books"],
                ["employees", "table", "Internal staff and hierarchy"]
            ],
            "note": "The bookstore database is fully loaded in in-memory SQLite."
        }
    }
)

add_slide(
    sec1, "What is SQL?", "1.2", "Lesson",
    "What is Structured Query Language (SQL) and how does declarative querying work?",
    [
        "**SQL (Structured Query Language)** is the ANSI/ISO standard declarative language for relational databases.",
        "Unlike imperative programming (Python, C++) where you write loops step-by-step, in SQL you declare **WHAT** data you want, not how to fetch it.",
        "The database's internal **Query Optimizer** builds an execution plan using indexes and cost-based heuristics.",
        "SQL keywords are case-insensitive (`SELECT` vs `select`), but uppercase keywords are industry standard."
    ],
    "SQL is declarative: you describe the target dataset, and the query optimizer figures out the most efficient way to fetch it.",
    "-- Declarative Query: Fetch all books in the catalog\nSELECT title, category, price, stock\nFROM books\nORDER BY price DESC;",
    "Encourage learners to click '▶ Run' to see the instant tabular execution in the SQLite WASM terminal.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "books",
            "columns": [
                {"name": "title", "type": "TEXT"},
                {"name": "category", "type": "TEXT"},
                {"name": "price", "type": "REAL"},
                {"name": "stock", "type": "INTEGER"}
            ],
            "rows": [
                ["Designing Data-Intensive Applications", "Distributed Systems", 45.00, 80],
                ["System Design Interview Vol 2", "System Design", 42.00, 95],
                ["System Design Interview Vol 1", "System Design", 39.99, 120],
                ["Designing Machine Learning Systems", "AI & Data", 38.50, 60],
                ["Clean Code", "Software Engineering", 32.50, 45]
            ],
            "note": "Sorted descending by book price"
        }
    }
)

add_slide(
    sec1, "Types of Queries", "1.3", "Lesson",
    "What are the core sub-languages of SQL (DQL, DDL, DML, DCL, TCL)?",
    [
        "**DQL (Data Query Language)**: `SELECT` retrieves records without mutating state.",
        "**DML (Data Manipulation Language)**: `INSERT`, `UPDATE`, `DELETE` modify stored data.",
        "**DDL (Data Definition Language)**: `CREATE`, `ALTER`, `DROP`, `TRUNCATE` define and alter table structures.",
        "**TCL (Transaction Control Language)**: `COMMIT`, `ROLLBACK`, `SAVEPOINT` ensure atomic transaction boundaries.",
        "**DCL (Data Control Language)**: `GRANT`, `REVOKE` manage user permissions and security roles."
    ],
    "SQL is divided into 5 specialized sublanguages: DQL (Query), DML (Modify), DDL (Define), TCL (Transactions), and DCL (Permissions).",
    "-- 1. DQL Query\nSELECT COUNT(*) AS total_books, AVG(price) AS average_price FROM books;\n\n-- 2. DDL Schema Inspection\nPRAGMA table_info(books);",
    "Point out that DDL commands change table shapes, while DML commands change the rows inside them.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "PRAGMA table_info(books)",
            "columns": [
                {"name": "cid", "type": "INTEGER"},
                {"name": "name", "type": "TEXT"},
                {"name": "type", "type": "TEXT"},
                {"name": "notnull", "type": "INTEGER"},
                {"name": "pk", "type": "INTEGER"}
            ],
            "rows": [
                [0, "id", "INTEGER", 0, 1],
                [1, "title", "TEXT", 1, 0],
                [2, "author_id", "INTEGER", 0, 0],
                [3, "category", "TEXT", 0, 0],
                [4, "price", "REAL", 0, 0],
                [5, "stock", "INTEGER", 0, 0]
            ],
            "note": "Schema metadata for books table"
        }
    }
)

add_slide(
    sec1, "Next Steps", "1.4", "Lesson",
    "What is our learning roadmap across the 9 modules of SQL Mastery?",
    [
        "**Module 2 (SQL Basics)**: `SELECT`, filtering (`WHERE`), sorting (`ORDER BY`), pagination (`LIMIT`), and `NULL` handling.",
        "**Module 3 & 4 (DML & DDL)**: `INSERT`, `UPDATE`, `DELETE`, schema creation, data types, and primary key constraints.",
        "**Module 5 (Relational Joins)**: `INNER`, `LEFT`, `RIGHT`, `SELF JOIN`, and `UNION` sets.",
        "**Module 6 & 7 (Analytics)**: `GROUP BY`, `HAVING`, aggregations, scalar math, string & date parsing.",
        "**Module 8 & 9 (Advanced SQL)**: Correlated subqueries, Common Table Expressions (`WITH`), and Window Functions (`OVER`, `PARTITION BY`, `RANK`)."
    ],
    "You will master both everyday operational queries and advanced analytical reporting.",
    "-- Verify SQLite WASM engine readiness\nSELECT \n  sqlite_version() AS engine_version,\n  (SELECT COUNT(*) FROM books) AS book_catalog_count,\n  (SELECT COUNT(*) FROM customers) AS customer_count;",
    "Every slide in this course runs on an in-memory SQLite WASM database with zero server latency.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "System Readiness Check",
            "columns": [
                {"name": "engine_version", "type": "TEXT"},
                {"name": "book_catalog_count", "type": "INTEGER"},
                {"name": "customer_count", "type": "INTEGER"}
            ],
            "rows": [
                ["3.45.0", 8, 6]
            ],
            "note": "Pre-seeded relational tables ready for queries"
        }
    }
)

add_slide(
    sec1, "Introduction Quiz", "1.5", "Quiz",
    "Module 1 Mastery Quiz: Test your grasp of databases, ACID, and SQL sublanguages",
    [
        "Test your grasp of core database concepts.",
        "Answer all 4 questions in the visual panel to verify your understanding before diving into SQL Basics.",
        "Instant feedback and explanations are provided on each selection."
    ],
    "Complete the 4 questions in the quiz panel to unlock the next module.",
    "-- Interactive quiz slide.\n-- Click your answers on the interactive visual panel on the left!\nSELECT 'Please answer questions in the left panel.' AS notice;",
    "Use quizzes to test retention before transitioning to query syntax.",
    {
        "type": "sql-quiz",
        "data": {
            "quizTitle": "Module 1: Introduction & Relational Foundations",
            "questions": [
                {
                    "question": "Which of the following best describes SQL?",
                    "options": [
                        "An imperative language that defines memory addresses",
                        "A declarative language specifying WHAT data is needed",
                        "An object-oriented programming language like Java",
                        "A markup language for styling database schemas"
                    ],
                    "answer": 1,
                    "explanation": "SQL is declarative: developers describe what dataset they want, and the query planner figures out how to retrieve it."
                },
                {
                    "question": "Which SQL sublanguage does the 'CREATE TABLE' command belong to?",
                    "options": ["DQL", "DML", "DDL", "TCL"],
                    "answer": 2,
                    "explanation": "CREATE TABLE is DDL (Data Definition Language) because it defines database structure and schema."
                },
                {
                    "question": "What does the 'A' in ACID transactions stand for?",
                    "options": ["Availability", "Atomicity", "Accuracy", "Asynchronous"],
                    "answer": 1,
                    "explanation": "Atomicity ensures that all operations in a transaction succeed completely, or the entire transaction is rolled back."
                },
                {
                    "question": "In a relational database table, what does each row represent?",
                    "options": [
                        "An individual column type definition",
                        "A single record or entity instance",
                        "A table constraint rule",
                        "An index pointer only"
                    ],
                    "answer": 1,
                    "explanation": "In relational modeling, each row (tuple) represents a specific instance of the entity (e.g., a specific customer or book)."
                }
            ]
        }
    }
)

print(f"Generated Section 1 (Current total slides: {len(slides)})")

# ==========================================
# SECTION 2: SQL Basics (17 slides)
# ==========================================
sec2 = "2. SQL Basics"

add_slide(
    sec2, "SELECT Fundamentals", "2.1", "Lesson",
    "How does the SELECT statement retrieve columns and rows from a database table?",
    [
        "The **`SELECT`** statement is the cornerstone of SQL queries.",
        "Use **`SELECT *`** to retrieve every column in the table, or specify explicit column names (e.g. `SELECT title, price`) for better performance and clarity.",
        "In production applications, avoid `SELECT *` because fetching unnecessary columns wastes memory and prevents index-only scans.",
        "The **`FROM`** clause identifies the source table from which rows are read."
    ],
    "Specify explicit column names in SELECT to save bandwidth and enable index-only query optimizations.",
    "-- 1. Explicit column projection (Recommended for production)\nSELECT id, title, price, stock\nFROM books;\n\n-- 2. Wildcard projection (Exploration only)\nSELECT * FROM authors;",
    "Demonstrate how explicit column names prevent breaking changes when database columns are added or removed in migrations.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "books (Projected Columns)",
            "columns": [
                {"name": "id", "type": "INTEGER", "isPk": True},
                {"name": "title", "type": "TEXT"},
                {"name": "price", "type": "REAL"},
                {"name": "stock", "type": "INTEGER"}
            ],
            "rows": [
                [1, "Clean Code", 32.50, 45],
                [2, "Designing Data-Intensive Applications", 45.00, 80],
                [3, "Machine Learning Yearning", 29.99, 30],
                [4, "System Design Interview Vol 1", 39.99, 120]
            ],
            "note": "Output restricted to 4 requested columns"
        }
    }
)

add_slide(
    sec2, "Aliases and Constants", "2.2", "Lesson",
    "How do column aliases (AS) and literal constants format query results?",
    [
        "Use the **`AS`** keyword to rename a column or computed expression in the returned result set.",
        "Aliases make column headers readable for frontend consumers and reports (e.g., `price AS unit_cost_usd`).",
        "You can include **literal constants** (numbers, strings) directly in the SELECT clause.",
        "Double quotes `\"My Column\"` are used for aliases with spaces; single quotes `'value'` are for string literals."
    ],
    "Use AS to provide human-readable column names and incorporate fixed constants into result sets.",
    "-- Using column aliases and literal constants\nSELECT \n  title AS book_title,\n  price AS retail_price_usd,\n  'In Stock' AS availability_status,\n  stock\nFROM books\nWHERE stock > 50;",
    "Warn students never to confuse single quotes (string values) with double quotes or backticks (column identifiers).",
    {
        "type": "sql-table",
        "data": {
            "tableName": "Aliased Results",
            "columns": [
                {"name": "book_title", "type": "TEXT"},
                {"name": "retail_price_usd", "type": "REAL"},
                {"name": "availability_status", "type": "TEXT"},
                {"name": "stock", "type": "INTEGER"}
            ],
            "rows": [
                ["Designing Data-Intensive Applications", 45.00, "In Stock", 80],
                ["System Design Interview Vol 1", 39.99, "In Stock", 120],
                ["System Design Interview Vol 2", 42.00, "In Stock", 95],
                ["Designing Machine Learning Systems", 38.50, "In Stock", 60]
            ],
            "note": "Aliases replace physical column names in the returned tabular output"
        }
    }
)

add_slide(
    sec2, "Expressions in SELECT", "2.3", "Lesson",
    "How can arithmetic and scalar mathematical expressions be evaluated in SELECT?",
    [
        "SQL can evaluate arithmetic expressions directly on columns: addition `+`, subtraction `-`, multiplication `*`, and division `/`.",
        "You can calculate business metrics like total valuation (`price * stock`) on the fly.",
        "Parentheses `(...)` enforce operator precedence just like in algebra.",
        "SQLite supports the string concatenation operator `||` to merge text columns."
    ],
    "Compute derived metrics directly in SQL using arithmetic operators and concatenation.",
    "-- Calculate total inventory value and discount pricing\nSELECT \n  title,\n  price,\n  stock,\n  (price * stock) AS total_inventory_value,\n  ROUND(price * 0.85, 2) AS discounted_price_15pct\nFROM books;",
    "Demonstrate how offloading basic math to the database reduces CPU overhead on backend web servers.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "Computed Expressions",
            "columns": [
                {"name": "title", "type": "TEXT"},
                {"name": "price", "type": "REAL"},
                {"name": "stock", "type": "INTEGER"},
                {"name": "total_inventory_value", "type": "REAL"},
                {"name": "discounted_price_15pct", "type": "REAL"}
            ],
            "rows": [
                ["Clean Code", 32.50, 45, 1462.50, 27.63],
                ["Designing Data-Intensive Applications", 45.00, 80, 3600.00, 38.25],
                ["Machine Learning Yearning", 29.99, 30, 899.70, 25.49]
            ],
            "note": "Dynamically computed financial columns"
        }
    }
)

add_slide(
    sec2, "Selecting DISTINCT Values", "2.4", "Lesson",
    "How does the DISTINCT keyword eliminate duplicate rows from query results?",
    [
        "The **`DISTINCT`** keyword filters out duplicate tuples so that each row in the result set is unique.",
        "When applied to a single column (`SELECT DISTINCT category`), it produces a list of unique categories.",
        "When applied across multiple columns (`SELECT DISTINCT country, status`), it returns unique combinations of all listed columns.",
        "Under the hood, `DISTINCT` requires a sorting or hashing step, so only use it when duplicates are expected."
    ],
    "DISTINCT removes duplicate rows from the query output across all selected columns.",
    "-- Find all distinct book categories and distinct customer countries\nSELECT DISTINCT category \nFROM books\nORDER BY category;\n\nSELECT DISTINCT country \nFROM customers\nORDER BY country;",
    "Explain that DISTINCT operates on the entire row tuple being returned, not just the first column.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "Distinct Categories",
            "columns": [
                {"name": "category", "type": "TEXT"}
            ],
            "rows": [
                ["AI & Data"],
                ["Distributed Systems"],
                ["Software Engineering"],
                ["System Design"]
            ],
            "note": "Duplicates collapsed into a unique set"
        }
    }
)

add_slide(
    sec2, "Filtering with WHERE", "2.5", "Lesson",
    "How does the WHERE clause filter records based on boolean conditions?",
    [
        "The **`WHERE`** clause filters rows before any grouping or projection happens.",
        "Comparison operators: `=`, `!=` (or `<>`), `>`, `<`, `>=`, `<=`, `BETWEEN ... AND ...`.",
        "List membership: `IN ('USA', 'Canada', 'UK')`.",
        "Pattern matching: `LIKE '%System%'` (`%` matches any number of characters, `_` matches one character).",
        "Compound logic: Combine expressions using `AND`, `OR`, and `NOT`."
    ],
    "The WHERE clause evaluates row-by-row boolean conditions to filter records before returning results.",
    "-- Complex filtering with WHERE\nSELECT title, category, price, rating\nFROM books\nWHERE (category = 'System Design' OR category = 'Distributed Systems')\n  AND price <= 45.00\n  AND rating >= 4.8;",
    "Highlight that AND has higher operator precedence than OR, so always wrap OR conditions in parentheses.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "Filtered Books",
            "columns": [
                {"name": "title", "type": "TEXT"},
                {"name": "category", "type": "TEXT"},
                {"name": "price", "type": "REAL"},
                {"name": "rating", "type": "REAL"}
            ],
            "rows": [
                ["Designing Data-Intensive Applications", "Distributed Systems", 45.00, 4.9],
                ["System Design Interview Vol 1", "System Design", 39.99, 4.8],
                ["System Design Interview Vol 2", "System Design", 42.00, 4.9]
            ],
            "note": "Only rows satisfying all boolean conditions returned"
        }
    }
)

add_slide(
    sec2, "SQL Basics Quiz", "2.6", "Quiz",
    "Module 2 Quiz: Test your grasp of SELECT, WHERE, Aliases, and Expressions",
    [
        "Verify your knowledge of foundational query syntax.",
        "Test operator precedence, DISTINCT behavior, and filter expressions.",
        "Select your answers in the interactive quiz card on the left."
    ],
    "Score 4/4 to demonstrate complete mastery of foundational SQL querying.",
    "-- Interactive quiz slide.\n-- Answer questions in the visual panel on the left.\nSELECT 'Test your SQL Basics knowledge.' AS status;",
    "Encourage learners to review WHY incorrect options fail in relational databases.",
    {
        "type": "sql-quiz",
        "data": {
            "quizTitle": "Module 2: SQL Basics Quiz",
            "questions": [
                {
                    "question": "Which clause is evaluated first in a standard SQL query: SELECT or WHERE?",
                    "options": [
                        "SELECT is evaluated before WHERE",
                        "WHERE is evaluated before SELECT",
                        "Both are evaluated simultaneously",
                        "ORDER BY is evaluated before WHERE"
                    ],
                    "answer": 1,
                    "explanation": "Logical query processing order evaluates FROM first, then WHERE to filter rows, and only then SELECT to project columns."
                },
                {
                    "question": "What does the expression 'WHERE price BETWEEN 20 AND 40' include?",
                    "options": [
                        "Values strictly greater than 20 and strictly less than 40",
                        "Values greater than or equal to 20 and less than or equal to 40 (inclusive)",
                        "Only the two discrete numbers 20 and 40",
                        "Values outside the range 20 to 40"
                    ],
                    "answer": 1,
                    "explanation": "The BETWEEN operator in SQL is inclusive of both boundary endpoints."
                },
                {
                    "question": "Which operator performs wildcard pattern matching in SQL strings?",
                    "options": ["CONTAINS", "MATCHES", "LIKE", "REGEXP_FIND"],
                    "answer": 2,
                    "explanation": "The LIKE operator uses '%' for any string of characters and '_' for a single character."
                },
                {
                    "question": "If a table has 10 rows with duplicate categories, what will 'SELECT DISTINCT category' return?",
                    "options": [
                        "An error because categories must be unique",
                        "Only the categories that appear exactly once",
                        "A list of unique category names with all duplicates removed",
                        "All 10 rows without changes"
                    ],
                    "answer": 2,
                    "explanation": "DISTINCT eliminates duplicate rows from the projected result set."
                }
            ]
        }
    }
)

add_slide(
    sec2, "Sorting with ORDER BY", "2.7", "Lesson",
    "How does ORDER BY sort query results ascending (ASC) and descending (DESC)?",
    [
        "Relational tables are unordered sets by definition. Without **`ORDER BY`**, row order is non-deterministic.",
        "Use **`ASC`** for ascending order (smallest to largest, A-Z) — this is the default.",
        "Use **`DESC`** for descending order (largest to smallest, Z-A).",
        "You can sort by **multiple columns**: `ORDER BY category ASC, price DESC` sorts primarily by category, breaking ties by price."
    ],
    "Relational tables have no inherent order; always specify ORDER BY if output order matters.",
    "-- Multi-column sorting: First by category ASC, then by price DESC\nSELECT title, category, price, rating\nFROM books\nORDER BY category ASC, price DESC;",
    "Emphasize that databases execute ORDER BY near the very end of query processing.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "Ordered Results",
            "columns": [
                {"name": "title", "type": "TEXT"},
                {"name": "category", "type": "TEXT"},
                {"name": "price", "type": "REAL"},
                {"name": "rating", "type": "REAL"}
            ],
            "rows": [
                ["Designing Machine Learning Systems", "AI & Data", 38.50, 4.7],
                ["Machine Learning Yearning", "AI & Data", 29.99, 4.8],
                ["Designing Data-Intensive Applications", "Distributed Systems", 45.00, 4.9],
                ["The Pragmatic Programmer", "Software Engineering", 39.99, 4.9],
                ["Clean Architecture", "Software Engineering", 35.00, 4.6],
                ["Clean Code", "Software Engineering", 32.50, 4.7],
                ["System Design Interview Vol 2", "System Design", 42.00, 4.9],
                ["System Design Interview Vol 1", "System Design", 39.99, 4.8]
            ],
            "note": "Sorted primarily by Category (A-Z), secondarily by Price (High to Low)"
        }
    }
)

add_slide(
    sec2, "Limiting Results with LIMIT", "2.8", "Lesson",
    "How do LIMIT and OFFSET implement pagination for large datasets?",
    [
        "**`LIMIT n`** restricts the output to at most `n` records.",
        "**`OFFSET m`** skips the first `m` records before returning the next batch.",
        "Together, `LIMIT` and `OFFSET` power client-side table pagination (e.g., Page 2 with 5 items/page: `LIMIT 5 OFFSET 5`).",
        "**Crucial rule**: Always pair `LIMIT` with an explicit `ORDER BY` to ensure consistent and predictable pages."
    ],
    "Always pair LIMIT with ORDER BY to guarantee deterministic pagination across pages.",
    "-- Get the top 3 most expensive books (Page 1)\nSELECT id, title, price, stock\nFROM books\nORDER BY price DESC\nLIMIT 3 OFFSET 0;\n\n-- Page 2: Next 3 books\nSELECT id, title, price, stock\nFROM books\nORDER BY price DESC\nLIMIT 3 OFFSET 3;",
    "Warn students that OFFSET becomes slow on massive tables (deep pagination), where keyset pagination is preferred.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "Page 1: LIMIT 3 OFFSET 0",
            "columns": [
                {"name": "id", "type": "INTEGER", "isPk": True},
                {"name": "title", "type": "TEXT"},
                {"name": "price", "type": "REAL"},
                {"name": "stock", "type": "INTEGER"}
            ],
            "rows": [
                [2, "Designing Data-Intensive Applications", 45.00, 80],
                [5, "System Design Interview Vol 2", 42.00, 95],
                [4, "System Design Interview Vol 1", 39.99, 120]
            ],
            "note": "Highest 3 priced titles in stock"
        }
    }
)

add_slide(
    sec2, "Handling Null Values", "2.9", "Lesson",
    "How does three-valued logic work with NULL, IS NULL, and COALESCE?",
    [
        "**`NULL`** represents missing, unknown, or inapplicable data. It is NOT equal to zero or an empty string.",
        "In SQL, comparisons with `NULL` yield **`UNKNOWN`** (Three-Valued Logic: TRUE, FALSE, UNKNOWN).",
        "Never check `column = NULL`! Always use **`IS NULL`** or **`IS NOT NULL`**.",
        "Use **`COALESCE(val1, val2, default)`** to provide a fallback value for NULL records."
    ],
    "Never use '= NULL'. Always use 'IS NULL' or 'COALESCE()' due to SQL's three-valued logic.",
    "-- Inspect customers with and without referrers\nSELECT \n  id,\n  name,\n  referrer_id,\n  COALESCE(referrer_id, 0) AS safe_referrer_id,\n  CASE WHEN referrer_id IS NULL THEN 'Organic' ELSE 'Referred' END AS acquisition_channel\nFROM customers;",
    "Demonstrate how WHERE referrer_id = NULL returns 0 rows, while WHERE referrer_id IS NULL returns the actual organic customers.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "Null Handling in Customers",
            "columns": [
                {"name": "id", "type": "INTEGER", "isPk": True},
                {"name": "name", "type": "TEXT"},
                {"name": "referrer_id", "type": "INTEGER"},
                {"name": "safe_referrer_id", "type": "INTEGER"},
                {"name": "acquisition_channel", "type": "TEXT"}
            ],
            "rows": [
                [1, "Alice Smith", None, 0, "Organic"],
                [2, "Bob Johnson", 1, 1, "Referred"],
                [3, "Charlie Brown", 1, 1, "Referred"],
                [4, "Diana Prince", 2, 2, "Referred"],
                [5, "Ethan Hunt", None, 0, "Organic"]
            ],
            "note": "COALESCE replaces NULL with 0"
        }
    }
)

add_slide(
    sec2, "Comments", "2.10", "Lesson",
    "How are single-line and multi-line comments formatted in SQL?",
    [
        "Comments document complex query logic, index hints, and business formulas.",
        "**Single-line comments** start with two hyphens: `-- This is a single line comment`.",
        "**Multi-line comments** use C-style delimiters: `/* Multi-line comment block */`.",
        "The database query parser completely ignores comments during syntax validation and execution."
    ],
    "Document tricky join conditions and business metrics using '--' or '/* ... */' comments.",
    "-- =============================================\n-- Author: Analytics Team\n-- Description: Active catalog inventory report\n-- =============================================\nSELECT \n  title,       -- Product title\n  price,       -- Retail MSRP in USD\n  stock        /* Current warehouse inventory level */\nFROM books\nWHERE stock > 0;",
    "Encourage clean documentation above CTEs and complex subqueries in real production repos.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "Documented Query Output",
            "columns": [
                {"name": "title", "type": "TEXT"},
                {"name": "price", "type": "REAL"},
                {"name": "stock", "type": "INTEGER"}
            ],
            "rows": [
                ["Clean Code", 32.50, 45],
                ["Designing Data-Intensive Applications", 45.00, 80]
            ],
            "note": "Cleanly formatted result set"
        }
    }
)

# Challenges in Section 2
add_slide(
    sec2, "Projection Challenge", "2.11", "Challenge",
    "Challenge: Project specific customer details for international marketing",
    [
        "**Task**: Write a query that selects only `name`, `email`, and `country` from the `customers` table.",
        "**Condition**: Restrict rows to customers residing in `'USA'` or `'Canada'`.",
        "**Order**: Sort the results alphabetically by `name` ASC.",
        "Click **[ 💡 Reveal Solution & Explanation ]** if you need step-by-step guidance."
    ],
    "Select customer name, email, and country for USA and Canada customers sorted by name.",
    "-- WRITE YOUR QUERY HERE:\nSELECT \n  -- Columns here\nFROM customers\nWHERE country IN ('USA', 'Canada')\nORDER BY name ASC;",
    "Have students compare using IN ('USA', 'Canada') versus country = 'USA' OR country = 'Canada'.",
    {
        "type": "solution"
    },
    {
        "approach": "Use explicit column projection in SELECT, filter with IN operator on country, and sort using ORDER BY name ASC.",
        "code": "SELECT name, email, country\nFROM customers\nWHERE country IN ('USA', 'Canada')\nORDER BY name ASC;",
        "timeComplexity": "O(N log N) due to sorting (or O(N) if indexed on name)",
        "spaceComplexity": "O(N) result set",
        "explanationPoints": [
            "We specify only the 3 requested columns in the SELECT clause.",
            "`WHERE country IN ('USA', 'Canada')` is cleaner and faster to read than multiple OR statements.",
            "`ORDER BY name ASC` sorts alphabetical order A to Z."
        ]
    }
)

add_slide(
    sec2, "Select Expression", "2.12", "Challenge",
    "Challenge: Calculate total warehouse inventory valuation per book",
    [
        "**Task**: Calculate the total inventory value for each book by multiplying `price * stock`.",
        "**Columns**: Return `title`, `price`, `stock`, and the computed column aliased as `inventory_valuation`.",
        "**Filter**: Only include books with an `inventory_valuation` greater than `$2000`.",
        "**Sorting**: Sort descending by `inventory_valuation`."
    ],
    "Calculate (price * stock) AS inventory_valuation and filter records exceeding $2000.",
    "-- WRITE YOUR QUERY HERE:\nSELECT \n  title,\n  price,\n  stock,\n  (price * stock) AS inventory_valuation\nFROM books\nWHERE (price * stock) > 2000\nORDER BY inventory_valuation DESC;",
    "Remind students that standard SQL does not allow using column aliases in the WHERE clause, hence repeating (price * stock).",
    {
        "type": "solution"
    },
    {
        "approach": "Evaluate the arithmetic product in SELECT with an AS alias, duplicate the expression in WHERE because WHERE executes before SELECT, and sort DESC.",
        "code": "SELECT \n  title,\n  price,\n  stock,\n  (price * stock) AS inventory_valuation\nFROM books\nWHERE (price * stock) > 2000\nORDER BY inventory_valuation DESC;",
        "timeComplexity": "O(N log N) sorting output",
        "spaceComplexity": "O(N)",
        "explanationPoints": [
            "Because SQL evaluates WHERE before SELECT, the alias `inventory_valuation` is not yet available in the WHERE clause.",
            "Repeating `WHERE (price * stock) > 2000` satisfies standard SQL parsing.",
            "ORDER BY executes after SELECT, so using the alias in ORDER BY is completely valid."
        ]
    }
)

add_slide(
    sec2, "Select Unique", "2.13", "Challenge",
    "Challenge: Extract a deduplicated list of active book categories",
    [
        "**Task**: Retrieve all unique `category` values present in the `books` table.",
        "**Format**: Return a single column named `unique_category`.",
        "**Ordering**: Order alphabetically from A to Z.",
        "Test your query against the live database."
    ],
    "Extract a distinct list of book categories aliased as unique_category, sorted A-Z.",
    "-- WRITE YOUR QUERY HERE:\nSELECT DISTINCT category AS unique_category\nFROM books\nORDER BY unique_category ASC;",
    "Demonstrate how DISTINCT automatically deduplicates rows in the projection.",
    {
        "type": "solution"
    },
    {
        "approach": "Use SELECT DISTINCT on the category column and order ascending.",
        "code": "SELECT DISTINCT category AS unique_category\nFROM books\nORDER BY unique_category ASC;",
        "timeComplexity": "O(N log N) for deduplication sorting",
        "spaceComplexity": "O(U) where U is unique categories",
        "explanationPoints": [
            "`SELECT DISTINCT` collapses duplicate category rows into single distinct values.",
            "The alias `unique_category` provides clear frontend labeling.",
            "`ORDER BY unique_category ASC` ensures a clean alphabetical presentation."
        ]
    }
)

add_slide(
    sec2, "Logical Operators", "2.14", "Challenge",
    "Challenge: Compound filtering with AND, OR, and NOT",
    [
        "**Task**: Find all books that meet **BOTH** of these business criteria:",
        "1. Category is either `'Software Engineering'` OR `'AI & Data'`.",
        "2. Rating is at least `4.7` AND price is under `$40.00`.",
        "Return `title`, `category`, `price`, and `rating`."
    ],
    "Filter books using compound boolean logic with proper parenthesis grouping.",
    "-- WRITE YOUR QUERY HERE:\nSELECT title, category, price, rating\nFROM books\nWHERE (category = 'Software Engineering' OR category = 'AI & Data')\n  AND rating >= 4.7\n  AND price < 40.00\nORDER BY rating DESC;",
    "Explain how missing parentheses around the OR condition creates accidental logic bugs.",
    {
        "type": "solution"
    },
    {
        "approach": "Group category comparisons in parentheses so the OR evaluation does not override the price and rating AND filters.",
        "code": "SELECT title, category, price, rating\nFROM books\nWHERE category IN ('Software Engineering', 'AI & Data')\n  AND rating >= 4.7\n  AND price < 40.00\nORDER BY rating DESC;",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "explanationPoints": [
            "Using `category IN ('Software Engineering', 'AI & Data')` avoids operator precedence pitfalls with OR.",
            "`rating >= 4.7` and `price < 40.00` enforce quality and affordability criteria.",
            "`ORDER BY rating DESC` surfaces the highest rated books first."
        ]
    }
)

add_slide(
    sec2, "Sorting Challenge", "2.15", "Challenge",
    "Challenge: Rank company employees by salary and seniority",
    [
        "**Task**: List all records from the `employees` table.",
        "**Ordering**: Sort primarily by `salary` descending (highest paid first).",
        "**Tie-breaker**: If two employees have the exact same salary, sort by `hire_date` ascending (earlier hire dates first).",
        "Return `name`, `department`, `salary`, and `hire_date`."
    ],
    "Sort employees by salary DESC, breaking ties with hire_date ASC.",
    "-- WRITE YOUR QUERY HERE:\nSELECT name, department, salary, hire_date\nFROM employees\nORDER BY salary DESC, hire_date ASC;",
    "Multi-column sorting is fundamental for tie-breaking in business leaderboards.",
    {
        "type": "solution"
    },
    {
        "approach": "Specify two column sorting expressions in ORDER BY separated by a comma.",
        "code": "SELECT name, department, salary, hire_date\nFROM employees\nORDER BY salary DESC, hire_date ASC;",
        "timeComplexity": "O(N log N)",
        "spaceComplexity": "O(N)",
        "explanationPoints": [
            "The primary sorting key is `salary DESC`.",
            "The secondary sorting key `hire_date ASC` is only evaluated when two salaries match identically.",
            "Projecting specific columns avoids leaking internal primary key IDs."
        ]
    }
)

add_slide(
    sec2, "Sorting and Limiting", "2.16", "Challenge",
    "Challenge: Find the top 3 highest-rated books with ample stock",
    [
        "**Task**: Find the **top 3** highest-rated books in our store.",
        "**Constraint**: Only include books that have at least `50 units` in stock (`stock >= 50`).",
        "**Output**: Return `title`, `rating`, `stock`, and `price`.",
        "**Sorting**: Highest `rating` first; break ties by `price` ascending."
    ],
    "Filter stock >= 50, sort by rating DESC, price ASC, and restrict to 3 rows using LIMIT.",
    "-- WRITE YOUR QUERY HERE:\nSELECT title, rating, stock, price\nFROM books\nWHERE stock >= 50\nORDER BY rating DESC, price ASC\nLIMIT 3;",
    "Show students how this pattern mirrors top-recommendation widgets on e-commerce sites.",
    {
        "type": "solution"
    },
    {
        "approach": "Filter with WHERE stock >= 50, sort by rating DESC and price ASC, and cap results with LIMIT 3.",
        "code": "SELECT title, rating, stock, price\nFROM books\nWHERE stock >= 50\nORDER BY rating DESC, price ASC\nLIMIT 3;",
        "timeComplexity": "O(N log K) with top-K heap or O(N log N)",
        "spaceComplexity": "O(1) memory for 3 rows",
        "explanationPoints": [
            "`WHERE stock >= 50` ensures out-of-stock or low-stock items are excluded.",
            "`ORDER BY rating DESC, price ASC` favors high-quality and affordable titles.",
            "`LIMIT 3` returns exactly the top 3 contenders."
        ]
    }
)

add_slide(
    sec2, "Sorting and Filtering", "2.17", "Challenge",
    "Challenge: Identify modern mid-priced technical publications",
    [
        "**Task**: Find all books published in year `2018 or later` (`published_year >= 2018`).",
        "**Price Range**: Price must be between `$35.00` and `$45.00` (inclusive).",
        "**Sorting**: Order by `published_year` DESC, then `title` ASC.",
        "Return `title`, `published_year`, `price`, and `category`."
    ],
    "Combine BETWEEN for pricing, published_year filtering, and multi-column sorting.",
    "-- WRITE YOUR QUERY HERE:\nSELECT title, published_year, price, category\nFROM books\nWHERE published_year >= 2018\n  AND price BETWEEN 35.00 AND 45.00\nORDER BY published_year DESC, title ASC;",
    "Demonstrate how BETWEEN simplifies range filtering without redundant >= and <= pairs.",
    {
        "type": "solution"
    },
    {
        "approach": "Combine published_year >= 2018 with price BETWEEN 35.00 AND 45.00, and sort by published_year DESC, title ASC.",
        "code": "SELECT title, published_year, price, category\nFROM books\nWHERE published_year >= 2018\n  AND price BETWEEN 35.00 AND 45.00\nORDER BY published_year DESC, title ASC;",
        "timeComplexity": "O(N log N)",
        "spaceComplexity": "O(N)",
        "explanationPoints": [
            "`published_year >= 2018` limits search to modern technical books.",
            "`price BETWEEN 35.00 AND 45.00` uses SQL's inclusive range operator.",
            "`ORDER BY published_year DESC, title ASC` groups newer books first with alphabetical ordering."
        ]
    }
)

print(f"Generated Section 2 (Current total slides: {len(slides)})")

# ==========================================
# SECTION 3: Manipulating Data (7 slides)
# ==========================================
sec3 = "3. Manipulating Data"

add_slide(
    sec3, "INSERT Operations", "3.1", "Lesson",
    "How does the INSERT INTO statement add new records into database tables?",
    [
        "**`INSERT INTO table (col1, col2) VALUES (val1, val2);`** inserts a single new row.",
        "Always explicitly list target column names: this ensures your query won't break if table columns change order later.",
        "You can insert **multiple rows** in a single statement by chaining tuples: `VALUES (1, 'A'), (2, 'B'), (3, 'C');`.",
        "Omitting a column sets it to its default value or `NULL` (if the column allows nulls)."
    ],
    "Always specify target columns in INSERT to maintain schema resilience and support batch insertions.",
    "-- Insert a new customer record\nINSERT INTO customers (id, name, email, country, referrer_id, joined_date)\nVALUES (7, 'Grace Hopper', 'grace@navy.mil', 'USA', NULL, '2024-04-01');\n\n-- Verify the inserted row\nSELECT * FROM customers WHERE id = 7;",
    "Demonstrate how batch multi-row inserts reduce network roundtrips between backend apps and the database.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "customers (After INSERT)",
            "columns": [
                {"name": "id", "type": "INTEGER", "isPk": True},
                {"name": "name", "type": "TEXT"},
                {"name": "email", "type": "TEXT"},
                {"name": "country", "type": "TEXT"},
                {"name": "joined_date", "type": "TEXT"}
            ],
            "rows": [
                [7, "Grace Hopper", "grace@navy.mil", "USA", "2024-04-01"]
            ],
            "note": "New row successfully persisted"
        }
    }
)

add_slide(
    sec3, "UPDATE Operations", "3.2", "Lesson",
    "How does the UPDATE statement modify existing table values?",
    [
        "The **`UPDATE table SET col1 = val1, col2 = val2 WHERE condition;`** modifies matching rows.",
        "**CRITICAL WARNING**: Always include a `WHERE` clause! An `UPDATE` without a `WHERE` updates **EVERY SINGLE ROW** in the table.",
        "You can compute new values based on existing values (e.g. `SET price = price * 1.10` to apply a 10% price bump).",
        "SQLite returns the count of affected rows upon completion."
    ],
    "Never run an UPDATE without a WHERE clause unless you genuinely intend to overwrite every row in the table.",
    "-- Apply a 10% inflation adjustment to Software Engineering books\nUPDATE books \nSET price = ROUND(price * 1.10, 2)\nWHERE category = 'Software Engineering';\n\n-- Verify updated prices\nSELECT id, title, category, price FROM books WHERE category = 'Software Engineering';",
    "Tell students the industry horror story of missing WHERE clauses in production, and how transactions prevent disasters.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "books (Software Engineering Prices Adjusted)",
            "columns": [
                {"name": "id", "type": "INTEGER", "isPk": True},
                {"name": "title", "type": "TEXT"},
                {"name": "category", "type": "TEXT"},
                {"name": "price", "type": "REAL"}
            ],
            "rows": [
                [1, "Clean Code", "Software Engineering", 35.75],
                [7, "Clean Architecture", "Software Engineering", 38.50],
                [8, "The Pragmatic Programmer", "Software Engineering", 43.99]
            ],
            "note": "Prices increased by 10%"
        }
    }
)

add_slide(
    sec3, "Data Manipulation Quiz", "3.3", "Quiz",
    "Module 3 Quiz: Test your grasp of INSERT, UPDATE, and DELETE operations",
    [
        "Verify your understanding of SQL data manipulation rules.",
        "Check what happens when constraints, nullability, or WHERE clauses are misconfigured.",
        "Answer the questions on the interactive quiz card."
    ],
    "Test your DML knowledge before running production mutations.",
    "-- Interactive quiz slide.\n-- Answer questions in the visual panel on the left.\nSELECT 'Test your DML knowledge.' AS status;",
    "Review transaction rollback procedures for accidental mass updates.",
    {
        "type": "sql-quiz",
        "data": {
            "quizTitle": "Module 3: Data Manipulation Language (DML) Quiz",
            "questions": [
                {
                    "question": "What happens if you execute 'UPDATE employees SET salary = 90000;' without a WHERE clause?",
                    "options": [
                        "An error is raised because WHERE is strictly required",
                        "Only the first employee record is updated",
                        "Every employee in the entire table gets their salary changed to 90000",
                        "The database creates a backup copy first"
                    ],
                    "answer": 2,
                    "explanation": "Without a WHERE clause, UPDATE acts on all rows in the table unconditionally."
                },
                {
                    "question": "Which statement can insert multiple rows into a table simultaneously?",
                    "options": [
                        "INSERT INTO t VALUES (1, 'A'), (2, 'B'), (3, 'C');",
                        "INSERT MULTIPLE t (1, 'A') AND (2, 'B');",
                        "ADD ROWS TO t WITH (1, 'A'), (2, 'B');",
                        "BULK INSERT t [1, 'A', 2, 'B'];"
                    ],
                    "answer": 0,
                    "explanation": "Standard SQL supports multi-row inserts by separating value tuples with commas."
                },
                {
                    "question": "What is the primary danger of running 'DELETE FROM customers;'?",
                    "options": [
                        "It deletes the table structure and indexes",
                        "It deletes all rows in the customers table, leaving an empty table",
                        "It will prompt for confirmation automatically",
                        "It only deletes customers with NULL IDs"
                    ],
                    "answer": 1,
                    "explanation": "DELETE without WHERE removes all row records while preserving the table schema definition."
                }
            ]
        }
    }
)

add_slide(
    sec3, "DELETE Operations", "3.4", "Lesson",
    "How does the DELETE statement safely remove records from a table?",
    [
        "**`DELETE FROM table WHERE condition;`** removes rows that satisfy the boolean condition.",
        "Like `UPDATE`, omitting the `WHERE` clause deletes **ALL** records in the table.",
        "Difference from `DROP TABLE`: `DELETE` removes data rows while leaving the table structure and indexes intact. `DROP` destroys the table entirely.",
        "Foreign key constraints can prevent deletions if child tables reference the row, unless `ON DELETE CASCADE` is configured."
    ],
    "DELETE FROM table removes row records based on WHERE; DROP TABLE destroys the table itself.",
    "-- Remove cancelled test orders\nDELETE FROM orders \nWHERE status = 'CANCELLED';\n\n-- Inspect remaining active orders\nSELECT id, customer_id, total_amount, status FROM orders;",
    "Show how soft-deletes (e.g. is_deleted = 1) are frequently preferred over hard physical DELETEs in production systems.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "orders (Active Records Remaining)",
            "columns": [
                {"name": "id", "type": "INTEGER", "isPk": True},
                {"name": "customer_id", "type": "INTEGER"},
                {"name": "total_amount", "type": "REAL"},
                {"name": "status", "type": "TEXT"}
            ],
            "rows": [
                [1, 1, 77.50, "COMPLETED"],
                [2, 2, 45.00, "COMPLETED"],
                [3, 1, 119.98, "COMPLETED"],
                [4, 3, 29.99, "COMPLETED"],
                [5, 4, 81.99, "SHIPPED"],
                [6, 5, 38.50, "PROCESSING"]
            ],
            "note": "Cancelled orders successfully purged"
        }
    }
)

# Challenges in Section 3
add_slide(
    sec3, "Inserting Customers", "3.5", "Challenge",
    "Challenge: Onboard a new international loyalty customer",
    [
        "**Task**: Insert a new customer into the `customers` table with the following details:",
        "- `id`: `7`",
        "- `name`: `'Ada Lovelace'`",
        "- `email`: `'ada@computing.org'`",
        "- `country`: `'UK'`",
        "- `referrer_id`: `1` (referred by Alice Smith)",
        "- `joined_date`: `'2024-05-15'`",
        "Follow with a `SELECT` statement to verify insertion."
    ],
    "Insert Ada Lovelace with referrer_id 1 and verify with SELECT * FROM customers WHERE id = 7.",
    "-- WRITE YOUR INSERT AND SELECT HERE:\nINSERT INTO customers (id, name, email, country, referrer_id, joined_date)\nVALUES (7, 'Ada Lovelace', 'ada@computing.org', 'UK', 1, '2024-05-15');\n\nSELECT * FROM customers WHERE id = 7;",
    "Emphasize the importance of matching data types (integers vs strings in single quotes).",
    {
        "type": "solution"
    },
    {
        "approach": "Execute INSERT INTO specifying all 6 column names, provide corresponding values, and query back with WHERE id = 7.",
        "code": "INSERT INTO customers (id, name, email, country, referrer_id, joined_date)\nVALUES (7, 'Ada Lovelace', 'ada@computing.org', 'UK', 1, '2024-05-15');\n\nSELECT * FROM customers WHERE id = 7;",
        "timeComplexity": "O(1) insert",
        "spaceComplexity": "O(1) row",
        "explanationPoints": [
            "All columns are explicitly declared in the target column list.",
            "Strings are enclosed in single quotes `'Ada Lovelace'`.",
            "The verification SELECT query confirms row insertion in SQLite."
        ]
    }
)

add_slide(
    sec3, "Updating Bookstore", "3.6", "Challenge",
    "Challenge: Restock inventory and adjust pricing for bestseller",
    [
        "**Task**: Update the book `'Designing Data-Intensive Applications'` (id = 2) in the `books` table:",
        "1. Increase its `stock` by `25 units` (`stock = stock + 25`).",
        "2. Set its `rating` to `5.0`.",
        "Ensure your `WHERE` condition matches `id = 2`.",
        "Verify your changes with a SELECT query."
    ],
    "Update book id = 2 to add 25 to stock and set rating = 5.0.",
    "-- WRITE YOUR UPDATE HERE:\nUPDATE books\nSET stock = stock + 25, rating = 5.0\nWHERE id = 2;\n\nSELECT id, title, stock, rating FROM books WHERE id = 2;",
    "Demonstrate updating multiple columns simultaneously separated by commas.",
    {
        "type": "solution"
    },
    {
        "approach": "Use UPDATE books SET stock = stock + 25, rating = 5.0 WHERE id = 2.",
        "code": "UPDATE books\nSET stock = stock + 25, rating = 5.0\nWHERE id = 2;\n\nSELECT id, title, stock, rating FROM books WHERE id = 2;",
        "timeComplexity": "O(1) with primary key lookup",
        "spaceComplexity": "O(1)",
        "explanationPoints": [
            "`stock = stock + 25` reads the current value (80) and writes 105 atomically.",
            "Multiple column assignments are separated by commas in the SET clause.",
            "`WHERE id = 2` targets the specific book record."
        ]
    }
)

add_slide(
    sec3, "Deleting Books", "3.7", "Challenge",
    "Challenge: Safely purge obsolete books from catalog",
    [
        "**Task**: Delete any book from `books` that has a `stock` of `0` OR a `price` less than `$10.00`.",
        "To test this, first insert a test row: `INSERT INTO books VALUES (99, 'Obsolete Draft', 1, 'Testing', 5.00, 0, 2000, 1.0);`",
        "Then run your `DELETE` statement.",
        "Finally, check that the row is gone."
    ],
    "Delete books with stock = 0 OR price < 10.00 using safe boolean conditions.",
    "-- Step 1: Insert test book\nINSERT INTO books VALUES (99, 'Obsolete Draft', 1, 'Testing', 5.00, 0, 2000, 1.0);\n\n-- Step 2: Delete it\nDELETE FROM books \nWHERE stock = 0 OR price < 10.00;\n\n-- Step 3: Verify deletion\nSELECT * FROM books WHERE id = 99;",
    "Encourage testing DELETE statements as SELECT queries first to inspect matching rows before deletion.",
    {
        "type": "solution"
    },
    {
        "approach": "Execute DELETE FROM books WHERE stock = 0 OR price < 10.00.",
        "code": "DELETE FROM books \nWHERE stock = 0 OR price < 10.00;\n\nSELECT COUNT(*) AS obsolete_count FROM books WHERE id = 99;",
        "timeComplexity": "O(N) table scan or index scan",
        "spaceComplexity": "O(1)",
        "explanationPoints": [
            "The OR condition removes records failing either health check.",
            "Best practice: Always run `SELECT * FROM books WHERE ...` first to verify which rows will be affected before calling `DELETE`."
        ]
    }
)

print(f"Generated Section 3 (Current total slides: {len(slides)})")

# ==========================================
# SECTION 4: Defining Tables (17 slides)
# ==========================================
sec4 = "4. Defining Tables"

add_slide(
    sec4, "Creating Tables", "4.1", "Lesson",
    "How does CREATE TABLE define schema structure, column types, and default values?",
    [
        "**`CREATE TABLE table_name (column1 datatype constraints, ...);`** sets up the physical blueprint.",
        "A well-designed schema defines data integrity constraints directly at the database engine level.",
        "Common column constraints: `NOT NULL` (disallows nulls), `UNIQUE` (prevents duplicates), `DEFAULT value` (provides fallback value if omitted).",
        "Use `CREATE TABLE IF NOT EXISTS` in application migrations to avoid errors if the table is already present."
    ],
    "CREATE TABLE IF NOT EXISTS establishes schemas with type safety, nullability, and default fallbacks.",
    "-- Create a book_reviews table with integrity constraints\nCREATE TABLE IF NOT EXISTS book_reviews (\n  id INTEGER PRIMARY KEY,\n  book_id INTEGER NOT NULL,\n  reviewer_name TEXT NOT NULL,\n  rating INTEGER CHECK (rating BETWEEN 1 AND 5),\n  review_text TEXT,\n  created_at TEXT DEFAULT CURRENT_TIMESTAMP,\n  FOREIGN KEY (book_id) REFERENCES books(id)\n);\n\n-- Inspect created schema\nPRAGMA table_info(book_reviews);",
    "Show how enforcing constraints at the database level protects against buggy backend code writing corrupt data.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "book_reviews (Schema Info)",
            "columns": [
                {"name": "cid", "type": "INTEGER"},
                {"name": "name", "type": "TEXT"},
                {"name": "type", "type": "TEXT"},
                {"name": "notnull", "type": "INTEGER"},
                {"name": "dflt_value", "type": "TEXT"},
                {"name": "pk", "type": "INTEGER"}
            ],
            "rows": [
                [0, "id", "INTEGER", 0, "None", 1],
                [1, "book_id", "INTEGER", 1, "None", 0],
                [2, "reviewer_name", "TEXT", 1, "None", 0],
                [3, "rating", "INTEGER", 0, "None", 0],
                [4, "review_text", "TEXT", 0, "None", 0],
                [5, "created_at", "TEXT", 0, "CURRENT_TIMESTAMP", 0]
            ],
            "note": "Schema definition with NOT NULL and DEFAULT constraints"
        }
    }
)

add_slide(
    sec4, "Data Types in SQLite", "4.2", "Lesson",
    "How does SQLite's type affinity model differ from rigid RDBMS types?",
    [
        "SQLite uses a dynamic typing system known as **Type Affinity**.",
        "The 5 native storage classes in SQLite are: **`INTEGER`**, **`REAL`** (floating point), **`TEXT`**, **`BLOB`** (binary), and **`NULL`**.",
        "Any column can theoretically store any type (except for strict tables), but SQLite attempts to convert data to the column's preferred affinity.",
        "SQLite 3.37+ introduced `STRICT` tables (`CREATE TABLE t (...) STRICT;`) to enforce rigid PostgreSQL/MySQL-style type checking."
    ],
    "SQLite provides 5 core storage classes: INTEGER, REAL, TEXT, BLOB, and NULL, with type affinity.",
    "-- Inspecting data types and affinities using typeof()\nSELECT \n  title,\n  typeof(title) AS title_type,\n  price,\n  typeof(price) AS price_type,\n  stock,\n  typeof(stock) AS stock_type\nFROM books\nLIMIT 3;",
    "Demonstrate using the typeof() function to inspect how values are physically encoded inside SQLite pages.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "typeof() Inspection",
            "columns": [
                {"name": "title", "type": "TEXT"},
                {"name": "title_type", "type": "TEXT"},
                {"name": "price", "type": "REAL"},
                {"name": "price_type", "type": "TEXT"},
                {"name": "stock", "type": "INTEGER"},
                {"name": "stock_type", "type": "TEXT"}
            ],
            "rows": [
                ["Clean Code", "text", 32.50, "real", 45, "integer"],
                ["Designing Data-Intensive Applications", "text", 45.00, "real", 80, "integer"]
            ],
            "note": "Physical storage classes confirmed by SQLite engine"
        }
    }
)

add_slide(
    sec4, "Common Data Types", "4.3", "Lesson",
    "How do standard SQL types (VARCHAR, CHAR, BOOLEAN, DECIMAL) map to storage engines?",
    [
        "**`VARCHAR(n)` / `CHAR(n)`**: Variable vs fixed-length strings (maps to TEXT in SQLite).",
        "**`BOOLEAN`**: Stored as `0` (FALSE) and `1` (TRUE).",
        "**`DECIMAL(p, s)` / `NUMERIC`**: Used for financial calculations where floating-point rounding errors cannot be tolerated.",
        "Choosing appropriate data types optimizes page-cache storage density and accelerates index scans."
    ],
    "Standard types like VARCHAR, BOOLEAN, and DECIMAL map cleanly across Postgres, MySQL, and SQLite.",
    "-- Create table utilizing cross-database standard types\nCREATE TABLE IF NOT EXISTS product_inventory (\n  sku VARCHAR(20) PRIMARY KEY,\n  product_name VARCHAR(100) NOT NULL,\n  is_available BOOLEAN DEFAULT 1,\n  unit_price DECIMAL(10, 2) NOT NULL\n);\n\nINSERT INTO product_inventory VALUES ('SKU-1001', 'Ergonomic Desk', 1, 299.99);\nSELECT sku, product_name, is_available, unit_price FROM product_inventory;",
    "Explain why financial systems use integers (cents) or DECIMAL, never raw floating point numbers.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "product_inventory",
            "columns": [
                {"name": "sku", "type": "VARCHAR(20)", "isPk": True},
                {"name": "product_name", "type": "VARCHAR(100)"},
                {"name": "is_available", "type": "BOOLEAN"},
                {"name": "unit_price", "type": "DECIMAL(10, 2)"}
            ],
            "rows": [
                ["SKU-1001", "Ergonomic Desk", 1, 299.99]
            ],
            "note": "Cross-database portable schema"
        }
    }
)

add_slide(
    sec4, "More on Numeric Types", "4.4", "Lesson",
    "How do integer sizes (TINYINT, INT, BIGINT) and floating point representations work?",
    [
        "**`INT / INTEGER`**: Signed integer stored in 1, 2, 3, 4, 6, or 8 bytes depending on value magnitude in SQLite.",
        "In Postgres/MySQL: `SMALLINT` (2 bytes, ±32K), `INTEGER` (4 bytes, ±2.1B), `BIGINT` (8 bytes, ±9 quintillion).",
        "**`REAL / FLOAT / DOUBLE`**: 8-byte IEEE floating point numbers; fast, but can experience tiny binary precision anomalies.",
        "Always use `INTEGER` for primary keys and foreign keys for maximal join performance."
    ],
    "Select integer sizes to fit expected scale; use 64-bit BIGINT for global primary keys like snowflake IDs.",
    "-- Demonstrating numeric calculations and integer division\nSELECT \n  title,\n  price,\n  CAST(price AS INTEGER) AS integer_dollars,\n  ROUND(price - CAST(price AS INTEGER), 2) AS remaining_cents\nFROM books\nLIMIT 4;",
    "Demonstrate using CAST(col AS INTEGER) to perform explicit type conversions.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "Numeric Breakdown",
            "columns": [
                {"name": "title", "type": "TEXT"},
                {"name": "price", "type": "REAL"},
                {"name": "integer_dollars", "type": "INTEGER"},
                {"name": "remaining_cents", "type": "REAL"}
            ],
            "rows": [
                ["Clean Code", 32.50, 32, 0.50],
                ["Designing Data-Intensive Applications", 45.00, 45, 0.00],
                ["Machine Learning Yearning", 29.99, 29, 0.99]
            ],
            "note": "Integer and fractional parts separated via CAST"
        }
    }
)

add_slide(
    sec4, "Temporal Data Types", "4.5", "Lesson",
    "How are dates, times, and timestamps represented and queried in SQL?",
    [
        "Relational databases offer temporal types: `DATE` ('YYYY-MM-DD'), `TIME` ('HH:MM:SS'), and `TIMESTAMP` ('YYYY-MM-DD HH:MM:SS').",
        "SQLite stores temporal data as **ISO-8601 text strings** or unix timestamps.",
        "Built-in temporal helper functions: `DATE()`, `TIME()`, `DATETIME()`, `STRFTIME()`, and `CURRENT_TIMESTAMP`.",
        "Because ISO-8601 ('2024-03-15') is lexicographically sorted, standard string comparisons (`>`, `<`, `BETWEEN`) work seamlessly."
    ],
    "Store dates in ISO-8601 'YYYY-MM-DD HH:MM:SS' format to ensure sorting and filtering work seamlessly.",
    "-- Querying temporal orders and calculating time diffs\nSELECT \n  id AS order_id,\n  order_date,\n  DATE(order_date, '+30 days') AS payment_due_date,\n  JULIANDAY('2024-04-01') - JULIANDAY(order_date) AS days_elapsed\nFROM orders\nLIMIT 4;",
    "Show how JULIANDAY() calculates exact day differences between two date strings.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "Temporal Calculation on Orders",
            "columns": [
                {"name": "order_id", "type": "INTEGER", "isPk": True},
                {"name": "order_date", "type": "TEXT"},
                {"name": "payment_due_date", "type": "TEXT"},
                {"name": "days_elapsed", "type": "REAL"}
            ],
            "rows": [
                [1, "2024-01-10", "2024-02-09", 82.0],
                [2, "2024-01-14", "2024-02-13", 78.0],
                [3, "2024-02-01", "2024-03-02", 60.0]
            ],
            "note": "Date arithmetic evaluated by SQLite temporal functions"
        }
    }
)

add_slide(
    sec4, "Defining Tables Quiz", "4.6", "Quiz",
    "Module 4 Quiz: Test your grasp of DDL, data types, constraints, and schemas",
    [
        "Verify your knowledge of table creation and constraint guarantees.",
        "Answer the 4 questions in the interactive quiz card.",
        "Master DDL principles before writing table modifications."
    ],
    "Test your database design and DDL schema knowledge.",
    "-- Interactive quiz slide.\n-- Answer questions in the visual panel on the left.\nSELECT 'Test your DDL knowledge.' AS status;",
    "Review constraint enforcement rules in relational database engines.",
    {
        "type": "sql-quiz",
        "data": {
            "quizTitle": "Module 4: Defining Tables & Constraints Quiz",
            "questions": [
                {
                    "question": "Which constraint ensures that a column cannot store NULL values?",
                    "options": ["UNIQUE", "NOT NULL", "CHECK", "DEFAULT"],
                    "answer": 1,
                    "explanation": "NOT NULL guarantees that every inserted row must have an explicit non-null value for that column."
                },
                {
                    "question": "What is the recommended format for storing temporal dates in SQL text columns?",
                    "options": [
                        "MM/DD/YYYY",
                        "DD-MM-YYYY",
                        "YYYY-MM-DD (ISO-8601)",
                        "Month Day, Year"
                    ],
                    "answer": 2,
                    "explanation": "ISO-8601 ('YYYY-MM-DD') preserves alphabetical sort order identical to chronological order."
                },
                {
                    "question": "What does a CHECK constraint do?",
                    "options": [
                        "Checks if the table exists before inserting",
                        "Validates that row values satisfy a boolean expression (e.g. price > 0)",
                        "Checks user password permissions",
                        "Checks foreign key references"
                    ],
                    "answer": 1,
                    "explanation": "CHECK constraints reject any INSERT or UPDATE where the boolean condition evaluates to FALSE."
                },
                {
                    "question": "What is the difference between DROP TABLE and TRUNCATE TABLE?",
                    "options": [
                        "They are completely identical synonyms",
                        "DROP TABLE removes the entire table and schema; TRUNCATE deletes all rows while keeping the table structure",
                        "TRUNCATE is only for views",
                        "DROP TABLE can be undone without transactions"
                    ],
                    "answer": 1,
                    "explanation": "DROP TABLE destroys the table schema completely. TRUNCATE rapidly empties row data while preserving the table definition."
                }
            ]
        }
    }
)

add_slide(
    sec4, "CHECK Constraints", "4.7", "Lesson",
    "How do CHECK constraints enforce business rules at the database engine level?",
    [
        "A **`CHECK (condition)`** constraint enforces custom domain validation rules directly on table columns.",
        "Examples: `CHECK (price > 0)`, `CHECK (rating BETWEEN 1 AND 5)`, `CHECK (email LIKE '%@%')`.",
        "If an `INSERT` or `UPDATE` violates the expression, the database engine aborts the transaction with a constraint violation error.",
        "Using database-level CHECK constraints guarantees that corrupt data can never enter your database, even if application code has bugs."
    ],
    "Use CHECK constraints to ensure prices are positive, ratings stay in bounds, and email formats are valid.",
    "-- Create an accounts table with strict balance and status constraints\nCREATE TABLE IF NOT EXISTS bank_accounts (\n  id INTEGER PRIMARY KEY,\n  account_number TEXT UNIQUE NOT NULL,\n  balance REAL CHECK (balance >= 0.00),\n  status TEXT CHECK (status IN ('ACTIVE', 'FROZEN', 'CLOSED'))\n);\n\n-- Valid insert\nINSERT INTO bank_accounts VALUES (1, 'ACC-9901', 500.00, 'ACTIVE');\nSELECT * FROM bank_accounts;",
    "Demonstrate intentionally trying to insert a negative balance to show the engine throwing 'CHECK constraint failed: balance >= 0.00'.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "bank_accounts",
            "columns": [
                {"name": "id", "type": "INTEGER", "isPk": True},
                {"name": "account_number", "type": "TEXT"},
                {"name": "balance", "type": "REAL"},
                {"name": "status", "type": "TEXT"}
            ],
            "rows": [
                [1, "ACC-9901", 500.00, "ACTIVE"]
            ],
            "note": "Engine validates balance >= 0 and valid status enum"
        }
    }
)

add_slide(
    sec4, "Primary Key Constraint", "4.8", "Lesson",
    "How does the PRIMARY KEY constraint uniquely identify table records?",
    [
        "A **`PRIMARY KEY`** uniquely identifies each row in a table. It is automatically `UNIQUE` and `NOT NULL`.",
        "Each table can have at most **one** primary key (which can be a single column or a composite of multiple columns).",
        "In SQLite, defining an **`INTEGER PRIMARY KEY`** automatically creates an auto-incrementing alias for the internal 64-bit `rowid`.",
        "Primary keys automatically build an underlying clustered B-Tree index for instantaneous $O(\\log N)$ lookup performance."
    ],
    "A PRIMARY KEY guarantees uniqueness and null-prevention while creating a lightning-fast B-Tree index.",
    "-- Inspecting primary keys and rowid in authors table\nSELECT rowid, id, name, country, tier\nFROM authors;",
    "Show how SQLite's internal 64-bit rowid is directly mapped to INTEGER PRIMARY KEY.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "authors (with Primary Key)",
            "columns": [
                {"name": "id", "type": "INTEGER", "isPk": True},
                {"name": "name", "type": "TEXT"},
                {"name": "country", "type": "TEXT"},
                {"name": "tier", "type": "TEXT"}
            ],
            "rows": [
                [1, "Robert C. Martin", "USA", "Tier 1"],
                [2, "Martin Kleppmann", "UK", "Tier 1"],
                [3, "Andrew Ng", "USA", "Tier 1"]
            ],
            "note": "Primary key index ensures instantaneous key lookups"
        }
    }
)

add_slide(
    sec4, "Modifying Tables", "4.9", "Lesson",
    "How does ALTER TABLE evolve schemas by adding columns and renaming tables?",
    [
        "**`ALTER TABLE table_name ADD COLUMN column_definition;`** appends a new column to an existing table.",
        "**`ALTER TABLE table_name RENAME TO new_name;`** renames an existing table safely without data loss.",
        "**`ALTER TABLE table_name RENAME COLUMN old_name TO new_name;`** renames specific fields.",
        "Adding columns with `NULL` or constant `DEFAULT` values is an instant $O(1)$ metadata-only operation in modern engines."
    ],
    "ALTER TABLE safely modifies schemas without dropping existing data or interrupting read operations.",
    "-- Create temporary test table, alter it, and verify\nCREATE TABLE IF NOT EXISTS promotions (\n  id INTEGER PRIMARY KEY,\n  code TEXT NOT NULL\n);\n\n-- Add discount_pct column\nALTER TABLE promotions ADD COLUMN discount_pct REAL DEFAULT 10.0;\n\nINSERT INTO promotions (id, code) VALUES (1, 'SPRING2024');\nSELECT * FROM promotions;",
    "Emphasize the difference between adding a column (instant) vs altering a column type in large tables.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "promotions (After ALTER TABLE)",
            "columns": [
                {"name": "id", "type": "INTEGER", "isPk": True},
                {"name": "code", "type": "TEXT"},
                {"name": "discount_pct", "type": "REAL"}
            ],
            "rows": [
                [1, "SPRING2024", 10.0]
            ],
            "note": "discount_pct column added via ALTER TABLE with default 10.0"
        }
    }
)

add_slide(
    sec4, "Dropping and Truncating", "4.10", "Lesson",
    "How do DROP TABLE and TRUNCATE differ in execution, memory, and transactional recovery?",
    [
        "**`DROP TABLE [IF EXISTS] table_name;`** completely removes the table schema, indexes, and all rows from the catalog.",
        "In databases with `TRUNCATE TABLE`, rows are wiped rapidly by deallocating storage pages rather than scanning row-by-row.",
        "In SQLite, `DELETE FROM table;` is optimized via the truncate optimization when no WHERE clause is provided.",
        "Always use `DROP TABLE IF EXISTS` in staging pipelines to ensure idempotent script execution."
    ],
    "Use DROP TABLE IF EXISTS to prevent catastrophic script aborts when tearing down temporary schemas.",
    "-- Safe idempotent table teardown demonstration\nCREATE TABLE IF NOT EXISTS temp_staging (\n  id INTEGER PRIMARY KEY,\n  payload TEXT\n);\n\nINSERT INTO temp_staging VALUES (1, 'Test Payload');\n\n-- Drop the table safely\nDROP TABLE IF EXISTS temp_staging;\n\n-- Verify it was removed\nSELECT count(*) AS table_count FROM sqlite_master WHERE name = 'temp_staging';",
    "Warn students that DROP TABLE is irreversible in production unless point-in-time recovery backups are configured.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "Catalog Verification",
            "columns": [
                {"name": "table_count", "type": "INTEGER"}
            ],
            "rows": [
                [0]
            ],
            "note": "temp_staging table successfully dropped from catalog"
        }
    }
)

# Challenges in Section 4
add_slide(
    sec4, "Simple Table Creation", "4.11", "Challenge",
    "Challenge: Design an article publishing table with constraints",
    [
        "**Task**: Create a table named `articles` with the following schema:",
        "- `id`: INTEGER PRIMARY KEY",
        "- `title`: TEXT NOT NULL",
        "- `author_id`: INTEGER NOT NULL",
        "- `word_count`: INTEGER DEFAULT 0",
        "- `is_published`: BOOLEAN DEFAULT 0",
        "Insert 1 sample row and query it."
    ],
    "Create the articles table with NOT NULL, PRIMARY KEY, and DEFAULT constraints.",
    "-- WRITE YOUR CREATE TABLE AND INSERT HERE:\nCREATE TABLE IF NOT EXISTS articles (\n  id INTEGER PRIMARY KEY,\n  title TEXT NOT NULL,\n  author_id INTEGER NOT NULL,\n  word_count INTEGER DEFAULT 0,\n  is_published BOOLEAN DEFAULT 0\n);\n\nINSERT INTO articles VALUES (1, 'Mastering SQL Joins', 2, 1850, 1);\nSELECT * FROM articles;",
    "Review how default values automatically populate when columns are omitted in INSERTs.",
    {
        "type": "solution"
    },
    {
        "approach": "Define columns with explicit constraints and verify using an INSERT and SELECT query.",
        "code": "CREATE TABLE IF NOT EXISTS articles (\n  id INTEGER PRIMARY KEY,\n  title TEXT NOT NULL,\n  author_id INTEGER NOT NULL,\n  word_count INTEGER DEFAULT 0,\n  is_published BOOLEAN DEFAULT 0\n);\n\nINSERT INTO articles VALUES (1, 'Mastering SQL Joins', 2, 1850, 1);\nSELECT * FROM articles;",
        "timeComplexity": "O(1) DDL creation",
        "spaceComplexity": "O(1) schema catalog entry",
        "explanationPoints": [
            "`INTEGER PRIMARY KEY` provides uniqueness and row indexing.",
            "`NOT NULL` prevents unassigned titles and author foreign keys.",
            "`DEFAULT` ensures columns are safely populated if omitted by backend writers."
        ]
    }
)

add_slide(
    sec4, "Data Types Challenge", "4.12", "Challenge",
    "Challenge: Construct a hardware sensor metrics schema",
    [
        "**Task**: Create a table named `sensor_telemetry` designed for high-frequency IoT readings:",
        "- `device_id`: TEXT NOT NULL",
        "- `recorded_at`: TEXT NOT NULL (ISO timestamp)",
        "- `temperature_celsius`: REAL NOT NULL",
        "- `humidity_pct`: REAL CHECK (humidity_pct BETWEEN 0.0 AND 100.0)",
        "- `battery_level`: INTEGER CHECK (battery_level BETWEEN 0 AND 100)"
    ],
    "Define sensor_telemetry table with realistic physical types and range CHECKs.",
    "-- WRITE YOUR TABLE CREATION HERE:\nCREATE TABLE IF NOT EXISTS sensor_telemetry (\n  id INTEGER PRIMARY KEY,\n  device_id TEXT NOT NULL,\n  recorded_at TEXT NOT NULL,\n  temperature_celsius REAL NOT NULL,\n  humidity_pct REAL CHECK (humidity_pct BETWEEN 0.0 AND 100.0),\n  battery_level INTEGER CHECK (battery_level BETWEEN 0 AND 100)\n);\n\nINSERT INTO sensor_telemetry VALUES (1, 'IOT-NODE-01', '2024-04-10 12:00:00', 23.4, 45.2, 98);\nSELECT * FROM sensor_telemetry;",
    "Demonstrate how CHECK constraints on humidity and battery prevent impossible values (like 150% battery).",
    {
        "type": "solution"
    },
    {
        "approach": "Use REAL for continuous sensor telemetry and INTEGER with CHECK limits for percentages.",
        "code": "CREATE TABLE IF NOT EXISTS sensor_telemetry (\n  id INTEGER PRIMARY KEY,\n  device_id TEXT NOT NULL,\n  recorded_at TEXT NOT NULL,\n  temperature_celsius REAL NOT NULL,\n  humidity_pct REAL CHECK (humidity_pct BETWEEN 0.0 AND 100.0),\n  battery_level INTEGER CHECK (battery_level BETWEEN 0 AND 100)\n);\n\nINSERT INTO sensor_telemetry VALUES (1, 'IOT-NODE-01', '2024-04-10 12:00:00', 23.4, 45.2, 98);\nSELECT * FROM sensor_telemetry;",
        "timeComplexity": "O(1)",
        "spaceComplexity": "O(1)",
        "explanationPoints": [
            "REAL data types accurately record decimal sensor readings.",
            "`CHECK (humidity_pct BETWEEN 0.0 AND 100.0)` enforces physically valid sensor ranges."
        ]
    }
)

add_slide(
    sec4, "Constraints Challenge", "4.13", "Challenge",
    "Challenge: Enforce uniqueness and check rules on user accounts",
    [
        "**Task**: Create a `user_credentials` table with strict security guarantees:",
        "- `user_id`: INTEGER PRIMARY KEY",
        "- `username`: TEXT UNIQUE NOT NULL",
        "- `email`: TEXT UNIQUE NOT NULL",
        "- `role`: TEXT CHECK (role IN ('ADMIN', 'STAFF', 'MEMBER'))",
        "- `is_active`: BOOLEAN DEFAULT 1"
    ],
    "Enforce UNIQUE on username and email, with an enumerated role CHECK.",
    "-- WRITE YOUR TABLE CREATION HERE:\nCREATE TABLE IF NOT EXISTS user_credentials (\n  user_id INTEGER PRIMARY KEY,\n  username TEXT UNIQUE NOT NULL,\n  email TEXT UNIQUE NOT NULL,\n  role TEXT CHECK (role IN ('ADMIN', 'STAFF', 'MEMBER')),\n  is_active BOOLEAN DEFAULT 1\n);\n\nINSERT INTO user_credentials VALUES (1, 'superadmin', 'admin@platform.io', 'ADMIN', 1);\nSELECT * FROM user_credentials;",
    "Highlight how UNIQUE constraints automatically build unique indexes behind the scenes.",
    {
        "type": "solution"
    },
    {
        "approach": "Create the table with UNIQUE constraints on credentials and an explicit CHECK IN constraint for roles.",
        "code": "CREATE TABLE IF NOT EXISTS user_credentials (\n  user_id INTEGER PRIMARY KEY,\n  username TEXT UNIQUE NOT NULL,\n  email TEXT UNIQUE NOT NULL,\n  role TEXT CHECK (role IN ('ADMIN', 'STAFF', 'MEMBER')),\n  is_active BOOLEAN DEFAULT 1\n);\n\nINSERT INTO user_credentials VALUES (1, 'superadmin', 'admin@platform.io', 'ADMIN', 1);\nSELECT * FROM user_credentials;",
        "timeComplexity": "O(1)",
        "spaceComplexity": "O(1)",
        "explanationPoints": [
            "`UNIQUE NOT NULL` guarantees both presence and non-duplication across all rows.",
            "`role IN (...)` implements an application enum directly in SQLite."
        ]
    }
)

add_slide(
    sec4, "Temporal Validation", "4.14", "Challenge",
    "Challenge: Validate temporal order scheduling ranges",
    [
        "**Task**: Create a `project_milestones` table requiring that:",
        "- `start_date`: TEXT NOT NULL",
        "- `due_date`: TEXT NOT NULL",
        "- **Constraint**: `due_date >= start_date` (a project cannot be due before it starts!)",
        "Test inserting a valid milestone and an invalid milestone."
    ],
    "Enforce table-level CHECK constraint comparing two date columns: due_date >= start_date.",
    "-- WRITE YOUR TABLE CREATION HERE:\nCREATE TABLE IF NOT EXISTS project_milestones (\n  id INTEGER PRIMARY KEY,\n  project_name TEXT NOT NULL,\n  start_date TEXT NOT NULL,\n  due_date TEXT NOT NULL,\n  CHECK (due_date >= start_date)\n);\n\nINSERT INTO project_milestones VALUES (1, 'App Redesign', '2024-05-01', '2024-06-15');\nSELECT * FROM project_milestones;",
    "Show how table-level CHECK constraints can compare multiple columns against each other.",
    {
        "type": "solution"
    },
    {
        "approach": "Place the CHECK constraint at the table level so it can access both start_date and due_date.",
        "code": "CREATE TABLE IF NOT EXISTS project_milestones (\n  id INTEGER PRIMARY KEY,\n  project_name TEXT NOT NULL,\n  start_date TEXT NOT NULL,\n  due_date TEXT NOT NULL,\n  CHECK (due_date >= start_date)\n);\n\nINSERT INTO project_milestones VALUES (1, 'App Redesign', '2024-05-01', '2024-06-15');\nSELECT * FROM project_milestones;",
        "timeComplexity": "O(1)",
        "spaceComplexity": "O(1)",
        "explanationPoints": [
            "Table-level CHECK constraints are evaluated after all column values are assembled.",
            "Because ISO-8601 strings sort chronologically, string comparison `>=` works reliably."
        ]
    }
)

add_slide(
    sec4, "Sales Data Analysis", "4.15", "Challenge",
    "Challenge: Schema design for an aggregated daily sales mart",
    [
        "**Task**: Create an analytical rollup table `daily_sales_mart`:",
        "- `sale_date`: TEXT PRIMARY KEY (e.g. '2024-04-10')",
        "- `order_count`: INTEGER NOT NULL DEFAULT 0",
        "- `gross_revenue`: REAL NOT NULL DEFAULT 0.00",
        "- `average_order_value`: REAL DEFAULT 0.00"
    ],
    "Design an analytical rollup mart table for precomputed daily metrics.",
    "-- WRITE YOUR TABLE CREATION HERE:\nCREATE TABLE IF NOT EXISTS daily_sales_mart (\n  sale_date TEXT PRIMARY KEY,\n  order_count INTEGER NOT NULL DEFAULT 0,\n  gross_revenue REAL NOT NULL DEFAULT 0.00,\n  average_order_value REAL DEFAULT 0.00\n);\n\nINSERT INTO daily_sales_mart VALUES ('2024-04-10', 42, 3450.50, 82.15);\nSELECT * FROM daily_sales_mart;",
    "Explain how data engineers use daily rollup marts to avoid recalculating millions of rows every second.",
    {
        "type": "solution"
    },
    {
        "approach": "Use sale_date as a natural PRIMARY KEY with pre-calculated aggregate fields.",
        "code": "CREATE TABLE IF NOT EXISTS daily_sales_mart (\n  sale_date TEXT PRIMARY KEY,\n  order_count INTEGER NOT NULL DEFAULT 0,\n  gross_revenue REAL NOT NULL DEFAULT 0.00,\n  average_order_value REAL DEFAULT 0.00\n);\n\nINSERT INTO daily_sales_mart VALUES ('2024-04-10', 42, 3450.50, 82.15);\nSELECT * FROM daily_sales_mart;",
        "timeComplexity": "O(1)",
        "spaceComplexity": "O(1)",
        "explanationPoints": [
            "`sale_date TEXT PRIMARY KEY` ensures only 1 summary row per calendar day.",
            "Precomputed metrics provide instant dashboards for business executives."
        ]
    }
)

add_slide(
    sec4, "Modifying Tables", "4.16", "Challenge",
    "Challenge: Schema migration to add loyalty tier and reward points",
    [
        "**Task**: In `customers`, add a new column `loyalty_points` of type `INTEGER` with a default of `100`.",
        "Check that existing customers receive the default `100` points.",
        "Query the modified table."
    ],
    "Execute ALTER TABLE customers ADD COLUMN loyalty_points INTEGER DEFAULT 100.",
    "-- WRITE YOUR ALTER STATEMENT HERE:\nALTER TABLE customers ADD COLUMN loyalty_points INTEGER DEFAULT 100;\n\nSELECT id, name, country, loyalty_points FROM customers LIMIT 4;",
    "Demonstrate how SQLite retroactively exposes default values on existing rows without rewriting the entire table on disk.",
    {
        "type": "solution"
    },
    {
        "approach": "Execute ALTER TABLE customers ADD COLUMN loyalty_points INTEGER DEFAULT 100.",
        "code": "ALTER TABLE customers ADD COLUMN loyalty_points INTEGER DEFAULT 100;\n\nSELECT id, name, country, loyalty_points FROM customers LIMIT 4;",
        "timeComplexity": "O(1) in SQLite metadata engine",
        "spaceComplexity": "O(1)",
        "explanationPoints": [
            "`ADD COLUMN ... DEFAULT 100` adds the column metadata instantaneously.",
            "All previously inserted customer rows now automatically return 100."
        ]
    }
)

add_slide(
    sec4, "Removing Table Data", "4.17", "Challenge",
    "Challenge: Purge staging data and drop transient schemas",
    [
        "**Task**: Create a staging table `etl_import_buffer` with an `id` and `raw_json` column.",
        "Insert 2 test records.",
        "Delete all rows using `DELETE FROM etl_import_buffer;`.",
        "Finally, drop the table using `DROP TABLE IF EXISTS etl_import_buffer;`."
    ],
    "Execute a complete staging lifecycle: create, populate, empty, and drop.",
    "-- WRITE YOUR STATEMENTS HERE:\nCREATE TABLE IF NOT EXISTS etl_import_buffer (id INTEGER PRIMARY KEY, raw_json TEXT);\nINSERT INTO etl_import_buffer VALUES (1, '{\"event\": \"click\"}'), (2, '{\"event\": \"checkout\"}');\n\nDELETE FROM etl_import_buffer;\nDROP TABLE IF EXISTS etl_import_buffer;\n\nSELECT 'Lifecycle complete!' AS status;",
    "Review best practices for cleaning up transient tables in ETL data pipelines.",
    {
        "type": "solution"
    },
    {
        "approach": "Execute CREATE TABLE, INSERT batch rows, DELETE rows, and tear down with DROP TABLE IF EXISTS.",
        "code": "CREATE TABLE IF NOT EXISTS etl_import_buffer (id INTEGER PRIMARY KEY, raw_json TEXT);\nINSERT INTO etl_import_buffer VALUES (1, '{\"event\": \"click\"}'), (2, '{\"event\": \"checkout\"}');\n\nDELETE FROM etl_import_buffer;\nDROP TABLE IF EXISTS etl_import_buffer;\n\nSELECT 'Lifecycle complete!' AS status;",
        "timeComplexity": "O(1)",
        "spaceComplexity": "O(1)",
        "explanationPoints": [
            "`DELETE FROM table` wipes rows while keeping schema.",
            "`DROP TABLE IF EXISTS` safely purges the schema from the catalog without throwing errors if already absent."
        ]
    }
)

print(f"Generated Section 4 (Current total slides: {len(slides)})")

# ==========================================
# SECTION 5: Multi-Table Queries (18 slides)
# ==========================================
sec5 = "5. Multi-Table Queries"

add_slide(
    sec5, "More on Relational Data", "5.1", "Lesson",
    "How does relational data modeling eliminate redundancy through Normalization (1NF, 2NF, 3NF)?",
    [
        "**Relational Modeling** splits information across separate logical tables to eliminate anomalies and redundancy.",
        "**1NF (First Normal Form)**: Each cell contains a single atomic value; no repeating groups or comma-separated lists.",
        "**2NF (Second Normal Form)**: Table is in 1NF and all non-key columns depend on the entire candidate key.",
        "**3NF (Third Normal Form)**: Table is in 2NF and has no transitive dependencies (no non-key column depends on another non-key column).",
        "Instead of duplicating author names inside every book row, we link `books.author_id` to `authors.id`."
    ],
    "Normalization separates entities into distinct tables, eliminating data redundancy and update anomalies.",
    "-- Inspect relational separation between books and authors\nSELECT \n  b.id AS book_id,\n  b.title,\n  b.author_id,\n  a.name AS author_name,\n  a.country\nFROM books b\nJOIN authors a ON b.author_id = a.id\nLIMIT 5;",
    "Show what happens when an author changes their name: in normalized design, you update exactly 1 row in authors.",
    {
        "type": "sql-join",
        "data": {
            "leftTable": {
                "name": "books",
                "rows": [
                    [1, "Clean Code (author_id = 1)"],
                    [2, "DDIA (author_id = 2)"],
                    [7, "Clean Architecture (author_id = 1)"]
                ]
            },
            "rightTable": {
                "name": "authors",
                "rows": [
                    [1, "Robert C. Martin", "USA"],
                    [2, "Martin Kleppmann", "UK"]
                ]
            },
            "joinKey": "books.author_id = authors.id"
        }
    }
)

add_slide(
    sec5, "Relationships and Types", "5.2", "Lesson",
    "How are 1-to-1, 1-to-Many, and Many-to-Many relationships modeled in relational databases?",
    [
        "**1-to-1 (1:1)**: E.g., User and UserProfile. Primary key of child is also foreign key to parent.",
        "**1-to-Many (1:N)**: E.g., One Customer has many Orders. Foreign key `customer_id` lives on the `orders` table.",
        "**Many-to-Many (N:M)**: E.g., Orders and Books. Modeled using an intermediate **Junction Table** (`order_items`).",
        "The junction table holds foreign keys to both parent tables plus line-item specific data (e.g., `quantity`, `unit_price`)."
    ],
    "Model Many-to-Many relationships with a junction table linking two One-to-Many relationships.",
    "-- Inspect the junction table order_items linking orders to books\nSELECT \n  oi.order_id,\n  c.name AS customer_name,\n  b.title AS purchased_book,\n  oi.quantity,\n  oi.unit_price\nFROM order_items oi\nJOIN orders o ON oi.order_id = o.id\nJOIN customers c ON o.customer_id = c.id\nJOIN books b ON oi.book_id = b.id\nLIMIT 5;",
    "Have learners trace how an order can have multiple books, and a book can appear in multiple orders via order_items.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "Junction Table Query (order_items)",
            "columns": [
                {"name": "order_id", "type": "INTEGER"},
                {"name": "customer_name", "type": "TEXT"},
                {"name": "purchased_book", "type": "TEXT"},
                {"name": "quantity", "type": "INTEGER"},
                {"name": "unit_price", "type": "REAL"}
            ],
            "rows": [
                [1, "Alice Smith", "Clean Code", 1, 32.50],
                [1, "Alice Smith", "Designing Data-Intensive Applications", 1, 45.00],
                [2, "Bob Johnson", "Designing Data-Intensive Applications", 1, 45.00]
            ],
            "note": "Resolves N:M relationship between Orders and Books"
        }
    }
)

add_slide(
    sec5, "JOINs in Queries", "5.3", "Lesson",
    "How do INNER, LEFT, RIGHT, and FULL OUTER JOINs match records across tables?",
    [
        "**`INNER JOIN`**: Returns only rows where there is a match in **BOTH** tables.",
        "**`LEFT JOIN` (or LEFT OUTER JOIN)**: Returns **ALL** rows from the left table, with matching right table rows or `NULL` if no match exists.",
        "**`RIGHT JOIN`**: Returns **ALL** rows from the right table, matching left or `NULL`.",
        "**`FULL OUTER JOIN`**: Returns all rows when there is a match in either table (combines LEFT and RIGHT).",
        "Use table aliases (`FROM books b JOIN authors a`) to keep queries concise."
    ],
    "INNER JOIN keeps only matches; LEFT JOIN keeps all left rows and fills unmatched rights with NULL.",
    "-- Compare INNER JOIN vs LEFT JOIN\n-- 1. INNER JOIN: Only customers with orders\nSELECT c.name, o.id AS order_id, o.total_amount\nFROM customers c\nINNER JOIN orders o ON c.id = o.customer_id;\n\n-- 2. LEFT JOIN: All customers including those who never purchased\nSELECT c.name, o.id AS order_id, o.total_amount\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id;",
    "Show the visual Venn diagram in the left panel to clearly see row preservation.",
    {
        "type": "sql-join",
        "data": {
            "leftTable": {
                "name": "customers",
                "rows": [
                    [1, "Alice Smith"],
                    [2, "Bob Johnson"],
                    [6, "Fiona Gallagher (no orders)"]
                ]
            },
            "rightTable": {
                "name": "orders",
                "rows": [
                    [1, 1, "$77.50"],
                    [2, 2, "$45.00"]
                ]
            },
            "joinKey": "customers.id = orders.customer_id"
        }
    }
)

add_slide(
    sec5, "Self Joins and Usecases", "5.4", "Lesson",
    "How does a SELF JOIN query hierarchical data within the same table?",
    [
        "A **`SELF JOIN`** joins a table to itself by using two distinct table aliases (e.g. `FROM employees e JOIN employees m`).",
        "Standard use case: **Hierarchies & Org Charts** where a row's `manager_id` points back to another row's `id` in the same table.",
        "Another use case: Finding pairs or duplicates (e.g., books with the exact same price).",
        "Always use `LEFT JOIN` for self-joins on hierarchies so the top-level CEO/root (whose `manager_id IS NULL`) is not filtered out."
    ],
    "Join a table to itself using two distinct aliases to navigate hierarchies and manager relationships.",
    "-- Self-Join: List employees alongside their managers\nSELECT \n  e.name AS employee_name,\n  e.department,\n  COALESCE(m.name, 'Top Executive / CEO') AS manager_name\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.id\nORDER BY e.department, e.name;",
    "Demonstrate why LEFT JOIN is necessary: without it, Sarah Connor (the CEO) disappears from the output.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "Self-Join Output (Employees & Managers)",
            "columns": [
                {"name": "employee_name", "type": "TEXT"},
                {"name": "department", "type": "TEXT"},
                {"name": "manager_name", "type": "TEXT"}
            ],
            "rows": [
                ["Sarah Connor", "Engineering", "Top Executive / CEO"],
                ["John Doe", "Engineering", "Sarah Connor"],
                ["Jane Roe", "Engineering", "Sarah Connor"],
                ["Michael Scott", "Sales", "Top Executive / CEO"],
                ["Dwight Schrute", "Sales", "Michael Scott"],
                ["Jim Halpert", "Sales", "Michael Scott"]
            ],
            "note": "Hierarchy resolved using e.manager_id = m.id"
        }
    }
)

add_slide(
    sec5, "Multi-Table Queries Quiz", "5.5", "Quiz",
    "Module 5 Quiz: Test your grasp of relational JOINs and normalization",
    [
        "Verify your ability to select the correct JOIN type for real business requirements.",
        "Test your understanding of NULL handling in unmatched LEFT JOIN records.",
        "Answer the 4 questions in the interactive quiz card."
    ],
    "Score 4/4 to demonstrate complete mastery of relational JOIN logic.",
    "-- Interactive quiz slide.\n-- Answer questions in the visual panel on the left.\nSELECT 'Test your JOIN knowledge.' AS status;",
    "Review Cartesian products (CROSS JOIN) caused by omitted ON clauses.",
    {
        "type": "sql-quiz",
        "data": {
            "quizTitle": "Module 5: Multi-Table Queries & JOINs Quiz",
            "questions": [
                {
                    "question": "Which JOIN returns all records from the left table even if there is no match in the right table?",
                    "options": [
                        "INNER JOIN",
                        "LEFT JOIN (LEFT OUTER JOIN)",
                        "CROSS JOIN",
                        "NATURAL JOIN"
                    ],
                    "answer": 1,
                    "explanation": "LEFT JOIN guarantees that all rows from the left table are returned, filling unmatched columns with NULL."
                },
                {
                    "question": "What happens if you omit the 'ON' clause in a JOIN statement?",
                    "options": [
                        "The database throws a syntax error or performs a CROSS JOIN (Cartesian product)",
                        "It automatically matches columns with the same name",
                        "It only joins the first row",
                        "It creates a new table automatically"
                    ],
                    "answer": 0,
                    "explanation": "Omitting the join condition produces a Cartesian product where every left row pairs with every right row (N x M rows)."
                },
                {
                    "question": "In an organization hierarchy where employees have a manager_id, what type of query connects them?",
                    "options": [
                        "Cross-Database Replication",
                        "Self JOIN (joining the employees table to itself)",
                        "Full Cartesian Mesh",
                        "UNION ALL"
                    ],
                    "answer": 1,
                    "explanation": "A self-join with two aliases (e.g. 'employees e' and 'employees m') navigates parent-child relationships within one table."
                },
                {
                    "question": "Which set operator combines results from two queries and removes duplicate rows?",
                    "options": ["UNION ALL", "UNION", "MERGE", "APPEND"],
                    "answer": 1,
                    "explanation": "UNION combines result sets and performs deduplication. UNION ALL keeps all duplicate rows and is faster."
                }
            ]
        }
    }
)

add_slide(
    sec5, "Foreign Key Constraint", "5.6", "Lesson",
    "How do FOREIGN KEY constraints preserve Referential Integrity across tables?",
    [
        "A **`FOREIGN KEY`** matches the `PRIMARY KEY` of another table, ensuring a child record cannot reference a non-existent parent.",
        "Referential actions on delete/update:",
        "- **`ON DELETE CASCADE`**: Deleting the parent automatically deletes all its children.",
        "- **`ON DELETE SET NULL`**: Sets the child foreign key column to NULL when the parent is deleted.",
        "- **`ON DELETE RESTRICT` (Default)**: Rejects parent deletion if child rows still reference it.",
        "In SQLite, execute `PRAGMA foreign_keys = ON;` to enforce foreign key checking."
    ],
    "Foreign keys prevent orphan records and maintain strict referential integrity across related tables.",
    "-- Enable and inspect foreign key support in SQLite\nPRAGMA foreign_keys = ON;\n\n-- Inspect foreign keys on books table\nPRAGMA foreign_key_list(books);",
    "Point out how ON DELETE CASCADE is great for line items in orders, but dangerous for users with financial records.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "PRAGMA foreign_key_list(books)",
            "columns": [
                {"name": "id", "type": "INTEGER"},
                {"name": "seq", "type": "INTEGER"},
                {"name": "table", "type": "TEXT"},
                {"name": "from", "type": "TEXT"},
                {"name": "to", "type": "TEXT"},
                {"name": "on_delete", "type": "TEXT"}
            ],
            "rows": [
                [0, 0, "authors", "author_id", "id", "NO ACTION"]
            ],
            "note": "books.author_id points strictly to authors.id"
        }
    }
)

add_slide(
    sec5, "Set Operator Queries", "5.7", "Lesson",
    "How do UNION, UNION ALL, INTERSECT, and EXCEPT combine multiple query result sets?",
    [
        "Set operators combine the outputs of two or more independent `SELECT` statements.",
        "**Requirements**: Both queries must return the **same number of columns** with compatible data types.",
        "**`UNION`**: Combines datasets and **removes duplicates** (requires a sort/hash step).",
        "**`UNION ALL`**: Combines datasets and **keeps all duplicates** (very fast, zero sorting overhead).",
        "**`INTERSECT`**: Returns only rows present in **BOTH** queries.",
        "**`EXCEPT` (or MINUS)**: Returns rows present in the first query but **NOT** in the second."
    ],
    "Use UNION ALL when duplicate removal is unnecessary for significantly faster query performance.",
    "-- 1. UNION: Unique list of all countries across authors and customers\nSELECT country FROM authors\nUNION\nSELECT country FROM customers;\n\n-- 2. INTERSECT: Countries that have BOTH authors AND customers\nSELECT country FROM authors\nINTERSECT\nSELECT country FROM customers;",
    "Demonstrate how UNION ALL runs in O(N+M) while UNION requires an O((N+M) log (N+M)) deduplication sort.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "INTERSECT Result",
            "columns": [
                {"name": "country", "type": "TEXT"}
            ],
            "rows": [
                ["UK"],
                ["USA"]
            ],
            "note": "Countries appearing in both authors and customers"
        }
    }
)

add_slide(
    sec5, "Views and Virtual Tables", "5.8", "Lesson",
    "How do SQL Views encapsulate complex multi-table joins as reusable virtual tables?",
    [
        "A **`VIEW`** is a stored, named query definition that behaves like a virtual table: `CREATE VIEW view_name AS SELECT ...;`.",
        "Views do **not** store physical data on disk (unless materialized); they re-execute the underlying query when queried.",
        "Benefits: Encapsulates complex joins, simplifies frontend reporting, and restricts access to sensitive columns (e.g. hiding employee salaries).",
        "Querying a view is as simple as `SELECT * FROM view_name WHERE ...`."
    ],
    "Views encapsulate multi-table join complexity behind a simple virtual table interface.",
    "-- Create a reusable view for order fulfillment\nCREATE VIEW IF NOT EXISTS v_order_summary AS\nSELECT \n  o.id AS order_id,\n  c.name AS customer_name,\n  c.email,\n  o.order_date,\n  o.total_amount,\n  o.status\nFROM orders o\nJOIN customers c ON o.customer_id = c.id;\n\n-- Query the virtual view\nSELECT * FROM v_order_summary WHERE status = 'COMPLETED';",
    "Explain the security advantage: you can grant analysts access to a view without exposing underlying tables.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "v_order_summary (View Output)",
            "columns": [
                {"name": "order_id", "type": "INTEGER", "isPk": True},
                {"name": "customer_name", "type": "TEXT"},
                {"name": "email", "type": "TEXT"},
                {"name": "order_date", "type": "TEXT"},
                {"name": "total_amount", "type": "REAL"},
                {"name": "status", "type": "TEXT"}
            ],
            "rows": [
                [1, "Alice Smith", "alice@tech.io", "2024-01-10", 77.50, "COMPLETED"],
                [2, "Bob Johnson", "bob@developer.org", "2024-01-14", 45.00, "COMPLETED"],
                [3, "Alice Smith", "alice@tech.io", "2024-02-01", 119.98, "COMPLETED"]
            ],
            "note": "Virtual table dynamically computed upon execution"
        }
    }
)

# Challenges in Section 5
add_slide(
    sec5, "Inactive Customers", "5.9", "Challenge",
    "Challenge: Identify churned or inactive customers who have never made a purchase",
    [
        "**Task**: Find all registered customers who have **NEVER** placed an order.",
        "**Approach**: Use a `LEFT JOIN` between `customers` and `orders`, and filter where `orders.id IS NULL`.",
        "Return `customers.id`, `name`, `email`, and `country`."
    ],
    "Execute LEFT JOIN orders ON c.id = o.customer_id WHERE o.id IS NULL to find non-purchasers.",
    "-- WRITE YOUR QUERY HERE:\nSELECT c.id, c.name, c.email, c.country\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nWHERE o.id IS NULL\nORDER BY c.name ASC;",
    "This 'anti-join' pattern with LEFT JOIN ... WHERE right.id IS NULL is an essential SQL interview classic.",
    {
        "type": "solution"
    },
    {
        "approach": "Perform a LEFT JOIN from customers to orders. Unmatched customers will receive NULL for all order columns. Filter with WHERE o.id IS NULL.",
        "code": "SELECT c.id, c.name, c.email, c.country\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nWHERE o.id IS NULL\nORDER BY c.name ASC;",
        "timeComplexity": "O(N) with hash join",
        "spaceComplexity": "O(N)",
        "explanationPoints": [
            "LEFT JOIN retains every customer regardless of whether orders exist.",
            "Customers with zero orders have `NULL` in the order fields.",
            "`WHERE o.id IS NULL` isolates these non-purchasing customers."
        ]
    }
)

add_slide(
    sec5, "Recent 3 Orders", "5.10", "Challenge",
    "Challenge: Fetch customer names for the 3 most recent transactions",
    [
        "**Task**: Retrieve the 3 most recent orders in the system.",
        "**Details**: Return `orders.id AS order_id`, `customers.name AS customer_name`, `orders.order_date`, and `orders.total_amount`.",
        "**Ordering**: Sort by `orders.order_date` DESC, `orders.id` DESC.",
        "**Limit**: Return exactly 3 rows."
    ],
    "Join orders with customers, sort by order_date DESC, and limit to 3 records.",
    "-- WRITE YOUR QUERY HERE:\nSELECT \n  o.id AS order_id,\n  c.name AS customer_name,\n  o.order_date,\n  o.total_amount\nFROM orders o\nJOIN customers c ON o.customer_id = c.id\nORDER BY o.order_date DESC, o.id DESC\nLIMIT 3;",
    "Demonstrate how an index on (order_date DESC) allows this query to return instantly without scanning the whole orders table.",
    {
        "type": "solution"
    },
    {
        "approach": "INNER JOIN orders and customers on customer_id = id, sort by order_date DESC, and cap with LIMIT 3.",
        "code": "SELECT \n  o.id AS order_id,\n  c.name AS customer_name,\n  o.order_date,\n  o.total_amount\nFROM orders o\nJOIN customers c ON o.customer_id = c.id\nORDER BY o.order_date DESC, o.id DESC\nLIMIT 3;",
        "timeComplexity": "O(N log K) with top-K index",
        "spaceComplexity": "O(1) 3 rows",
        "explanationPoints": [
            "INNER JOIN connects order transactions to their corresponding customer accounts.",
            "`ORDER BY o.order_date DESC, o.id DESC` sorts newest orders first with an ID tiebreaker.",
            "`LIMIT 3` ensures only the top 3 recent orders are delivered."
        ]
    }
)

add_slide(
    sec5, "High Value Orders", "5.11", "Challenge",
    "Challenge: Filter high-ticket purchases exceeding $50.00",
    [
        "**Task**: Find all orders where `total_amount >= 50.00`.",
        "Return `order_id`, `customer_name`, `email`, and `total_amount`.",
        "Sort by `total_amount` DESC."
    ],
    "INNER JOIN customers with orders filtering WHERE total_amount >= 50.00.",
    "-- WRITE YOUR QUERY HERE:\nSELECT \n  o.id AS order_id,\n  c.name AS customer_name,\n  c.email,\n  o.total_amount\nFROM orders o\nJOIN customers c ON o.customer_id = c.id\nWHERE o.total_amount >= 50.00\nORDER BY o.total_amount DESC;",
    "Show students how sales teams use this exact query to trigger VIP concierge thank-you emails.",
    {
        "type": "solution"
    },
    {
        "approach": "Join orders and customers, filter with WHERE total_amount >= 50.00, and sort DESC.",
        "code": "SELECT \n  o.id AS order_id,\n  c.name AS customer_name,\n  c.email,\n  o.total_amount\nFROM orders o\nJOIN customers c ON o.customer_id = c.id\nWHERE o.total_amount >= 50.00\nORDER BY o.total_amount DESC;",
        "timeComplexity": "O(N log N)",
        "spaceComplexity": "O(N)",
        "explanationPoints": [
            "The WHERE condition filters out smaller retail orders.",
            "Joining on `customer_id` extracts customer email contact info."
        ]
    }
)

add_slide(
    sec5, "Specific Book Customers", "5.12", "Challenge",
    "Challenge: Identify all buyers of 'Clean Code'",
    [
        "**Task**: Find the names and emails of all customers who purchased the book titled `'Clean Code'`.",
        "**Tables needed**: `customers`, `orders`, `order_items`, and `books` (a 4-table join!).",
        "Use `DISTINCT` on customer name to avoid listing the same customer twice if they bought it multiple times."
    ],
    "Perform a 4-table relational join from customers to books via orders and order_items.",
    "-- WRITE YOUR 4-TABLE JOIN HERE:\nSELECT DISTINCT \n  c.name AS customer_name,\n  c.email\nFROM customers c\nJOIN orders o ON c.id = o.customer_id\nJOIN order_items oi ON o.id = oi.order_id\nJOIN books b ON oi.book_id = b.id\nWHERE b.title = 'Clean Code'\nORDER BY c.name ASC;",
    "This challenge demonstrates the power of relational algebra: traversing from User -> Order -> Item -> Product.",
    {
        "type": "solution"
    },
    {
        "approach": "Traverse the relationship path: customers -> orders -> order_items -> books with WHERE b.title = 'Clean Code'.",
        "code": "SELECT DISTINCT \n  c.name AS customer_name,\n  c.email\nFROM customers c\nJOIN orders o ON c.id = o.customer_id\nJOIN order_items oi ON o.id = oi.order_id\nJOIN books b ON oi.book_id = b.id\nWHERE b.title = 'Clean Code'\nORDER BY c.name ASC;",
        "timeComplexity": "O(N) across relational chain",
        "spaceComplexity": "O(N)",
        "explanationPoints": [
            "We chain 3 JOINs together following primary/foreign key connections.",
            "`WHERE b.title = 'Clean Code'` filters the line item graph.",
            "`DISTINCT` prevents multiple rows if a customer bought Clean Code across multiple orders."
        ]
    }
)

add_slide(
    sec5, "Referred Customers", "5.13", "Challenge",
    "Challenge: Build a referral marketing report using a Self-Join",
    [
        "**Task**: Write a `SELF JOIN` on the `customers` table to display who referred whom.",
        "Return:",
        "- `referred_customer`: The new customer's name (`c.name`)",
        "- `referrer_name`: The referring customer's name (`r.name`)",
        "- `country`: The referred customer's country",
        "Only include customers who were referred (`WHERE c.referrer_id IS NOT NULL`)."
    ],
    "Join customers c with customers r ON c.referrer_id = r.id to pair new users with referrers.",
    "-- WRITE YOUR SELF JOIN HERE:\nSELECT \n  c.name AS referred_customer,\n  r.name AS referrer_name,\n  c.country\nFROM customers c\nJOIN customers r ON c.referrer_id = r.id\nORDER BY referrer_name, referred_customer;",
    "Demonstrate how referral networks and invite rewards depend on self-referential foreign keys.",
    {
        "type": "solution"
    },
    {
        "approach": "Self-join customers as 'c' (the referee) and customers as 'r' (the referrer) on c.referrer_id = r.id.",
        "code": "SELECT \n  c.name AS referred_customer,\n  r.name AS referrer_name,\n  c.country\nFROM customers c\nJOIN customers r ON c.referrer_id = r.id\nORDER BY referrer_name, referred_customer;",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "explanationPoints": [
            "`customers c` represents the person who was referred.",
            "`customers r` represents the existing member who shared their referral link.",
            "`c.referrer_id = r.id` matches the relationship correctly."
        ]
    }
)

add_slide(
    sec5, "Readers Like You", "5.14", "Challenge",
    "Challenge: Co-purchase book recommendation engine",
    [
        "**Task**: Find pairs of distinct books that were purchased together in the **same order**.",
        "Join `order_items oi1` with `order_items oi2` ON `oi1.order_id = oi2.order_id` AND `oi1.book_id < oi2.book_id`.",
        "Join with `books` to get the titles.",
        "Return `b1.title AS book_1` and `b2.title AS book_2`."
    ],
    "Self-join order_items with oi1.book_id < oi2.book_id to find items bought in the same order.",
    "-- WRITE YOUR CO-PURCHASE QUERY HERE:\nSELECT DISTINCT \n  b1.title AS book_1,\n  b2.title AS book_2\nFROM order_items oi1\nJOIN order_items oi2 ON oi1.order_id = oi2.order_id AND oi1.book_id < oi2.book_id\nJOIN books b1 ON oi1.book_id = b1.id\nJOIN books b2 ON oi2.book_id = b2.id\nORDER BY book_1, book_2;",
    "Explain why the '<' comparison is crucial: it prevents pairing a book with itself and avoids mirror duplicates (A, B and B, A).",
    {
        "type": "solution"
    },
    {
        "approach": "Join order_items to itself matching on order_id with book_id inequality, then join book titles.",
        "code": "SELECT DISTINCT \n  b1.title AS book_1,\n  b2.title AS book_2\nFROM order_items oi1\nJOIN order_items oi2 ON oi1.order_id = oi2.order_id AND oi1.book_id < oi2.book_id\nJOIN books b1 ON oi1.book_id = b1.id\nJOIN books b2 ON oi2.book_id = b2.id\nORDER BY book_1, book_2;",
        "timeComplexity": "O(N^2) within orders",
        "spaceComplexity": "O(N)",
        "explanationPoints": [
            "`oi1.order_id = oi2.order_id` ensures both items were purchased in the same shopping cart.",
            "`oi1.book_id < oi2.book_id` strictly prevents a book matching itself and eliminates reverse duplicate pairs.",
            "This is the foundational SQL pattern behind 'Customers who bought this also bought' recommendations."
        ]
    }
)

add_slide(
    sec5, "Same Price Books", "5.15", "Challenge",
    "Challenge: Find pairs of distinct books that share the exact same price",
    [
        "**Task**: Use a self-join on `books` to find distinct pairs of books that have identical prices (`price`).",
        "Use `b1.id < b2.id` to avoid self-matches and reverse duplicates.",
        "Return `b1.title AS book_1`, `b2.title AS book_2`, and `b1.price AS shared_price`.",
        "Order by `shared_price` DESC."
    ],
    "Join books b1 with books b2 ON b1.price = b2.price AND b1.id < b2.id.",
    "-- WRITE YOUR QUERY HERE:\nSELECT \n  b1.title AS book_1,\n  b2.title AS book_2,\n  b1.price AS shared_price\nFROM books b1\nJOIN books b2 ON b1.price = b2.price AND b1.id < b2.id\nORDER BY shared_price DESC;",
    "Point out how id < id is the universal SQL trick for pairwise non-duplicate combinations.",
    {
        "type": "solution"
    },
    {
        "approach": "Join books b1 with books b2 on price equality and id inequality.",
        "code": "SELECT \n  b1.title AS book_1,\n  b2.title AS book_2,\n  b1.price AS shared_price\nFROM books b1\nJOIN books b2 ON b1.price = b2.price AND b1.id < b2.id\nORDER BY shared_price DESC;",
        "timeComplexity": "O(N log N) with price index",
        "spaceComplexity": "O(N)",
        "explanationPoints": [
            "`b1.price = b2.price` matches books with identical price tags.",
            "`b1.id < b2.id` ensures each pair is generated exactly once."
        ]
    }
)

add_slide(
    sec5, "Multi-Section Authors", "5.16", "Challenge",
    "Challenge: Find authors whose catalog spans multiple technical categories",
    [
        "**Task**: Find authors who have written books in at least two distinct categories.",
        "Self-join `books b1` and `books b2` on `b1.author_id = b2.author_id AND b1.category != b2.category`.",
        "Join with `authors` to retrieve the author's name.",
        "Use `DISTINCT` to return unique author names."
    ],
    "Join books b1 with books b2 on author_id with distinct categories to find versatile writers.",
    "-- WRITE YOUR QUERY HERE:\nSELECT DISTINCT \n  a.name AS author_name\nFROM books b1\nJOIN books b2 ON b1.author_id = b2.author_id AND b1.category != b2.category\nJOIN authors a ON b1.author_id = a.id\nORDER BY author_name ASC;",
    "This pattern queries domain diversity across relational entities without requiring GROUP BY.",
    {
        "type": "solution"
    },
    {
        "approach": "Self-join books on author_id where category != category, then resolve author names via authors table.",
        "code": "SELECT DISTINCT \n  a.name AS author_name\nFROM books b1\nJOIN books b2 ON b1.author_id = b2.author_id AND b1.category != b2.category\nJOIN authors a ON b1.author_id = a.id\nORDER BY author_name ASC;",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "explanationPoints": [
            "`b1.category != b2.category` checks that an author has at least two different category classifications.",
            "Joining on `authors` surfaces human-readable author names."
        ]
    }
)

add_slide(
    sec5, "Expensive Books", "5.17", "Challenge",
    "Challenge: Join books with author tiers and publisher revenue",
    [
        "**Task**: List all books with `price >= 40.00` along with their author's name and country.",
        "Return `b.title`, `b.price`, `a.name AS author_name`, and `a.country`.",
        "Sort by `b.price` DESC."
    ],
    "Perform an INNER JOIN between books and authors filtering on price >= 40.00.",
    "-- WRITE YOUR QUERY HERE:\nSELECT \n  b.title,\n  b.price,\n  a.name AS author_name,\n  a.country\nFROM books b\nJOIN authors a ON b.author_id = a.id\nWHERE b.price >= 40.00\nORDER BY b.price DESC;",
    "Show how standard 2-table joins power product detail pages in production.",
    {
        "type": "solution"
    },
    {
        "approach": "Join books with authors on author_id = id and filter on price >= 40.00.",
        "code": "SELECT \n  b.title,\n  b.price,\n  a.name AS author_name,\n  a.country\nFROM books b\nJOIN authors a ON b.author_id = a.id\nWHERE b.price >= 40.00\nORDER BY b.price DESC;",
        "timeComplexity": "O(N log N)",
        "spaceComplexity": "O(N)",
        "explanationPoints": [
            "Matches book rows to their author biography details.",
            "Filters the result set to premium technical literature."
        ]
    }
)

add_slide(
    sec5, "Trending Tech Books", "5.18", "Challenge",
    "Challenge: Identify books that have appeared in multiple order line items",
    [
        "**Task**: Find the titles of all books that have been ordered in at least one transaction.",
        "Join `books` with `order_items` on `books.id = order_items.book_id`.",
        "Use `DISTINCT` on `books.title`.",
        "Sort alphabetically."
    ],
    "Join books with order_items using DISTINCT to list all actively ordered inventory items.",
    "-- WRITE YOUR QUERY HERE:\nSELECT DISTINCT \n  b.id AS book_id,\n  b.title,\n  b.price\nFROM books b\nJOIN order_items oi ON b.id = oi.book_id\nORDER BY b.title ASC;",
    "Contrast this with the inactive customer query to demonstrate operational catalog metrics.",
    {
        "type": "solution"
    },
    {
        "approach": "INNER JOIN books and order_items on book_id = id and project distinct book records.",
        "code": "SELECT DISTINCT \n  b.id AS book_id,\n  b.title,\n  b.price\nFROM books b\nJOIN order_items oi ON b.id = oi.book_id\nORDER BY b.title ASC;",
        "timeComplexity": "O(N log N)",
        "spaceComplexity": "O(N)",
        "explanationPoints": [
            "INNER JOIN naturally filters out any book that has never been ordered.",
            "`DISTINCT` ensures each book is listed only once regardless of total sales volume."
        ]
    }
)

print(f"Generated Section 5 (Current total slides: {len(slides)})")

# ==========================================
# SECTION 6: Aggregate Functions (15 slides)
# ==========================================
sec6 = "6. Aggregate Functions"

add_slide(
    sec6, "What is Aggregation?", "6.1", "Lesson",
    "How do aggregate functions summarize multiple rows into a single scalar value?",
    [
        "**Aggregate functions** compute a single summary result across a set of rows.",
        "The 5 standard ANSI SQL aggregate functions:",
        "- **`COUNT(column / *)`**: Returns the count of rows (COUNT(col) ignores NULLs; COUNT(*) counts all rows).",
        "- **`SUM(column)`**: Computes the arithmetic sum of numeric values.",
        "- **`AVG(column)`**: Computes the arithmetic mean (ignores NULLs).",
        "- **`MIN(column)`** & **`MAX(column)`**: Finds the minimum and maximum value (works on numbers, dates, and strings).",
        "Without `GROUP BY`, aggregate functions collapse the **entire table** into exactly one output row."
    ],
    "Aggregate functions summarize multiple records into a single metric; COUNT(*) includes NULL rows while COUNT(col) ignores them.",
    "-- Storewide catalog aggregate metrics\nSELECT \n  COUNT(*) AS total_book_count,\n  ROUND(AVG(price), 2) AS average_price,\n  MIN(price) AS cheapest_book_price,\n  MAX(price) AS most_expensive_price,\n  SUM(stock) AS total_units_in_warehouse\nFROM books;",
    "Ask students what happens when AVG() encounters NULLs: emphasize that NULL rows are excluded from the denominator.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "Catalog Rollup Summary",
            "columns": [
                {"name": "total_book_count", "type": "INTEGER"},
                {"name": "average_price", "type": "REAL"},
                {"name": "cheapest_book_price", "type": "REAL"},
                {"name": "most_expensive_price", "type": "REAL"},
                {"name": "total_units_in_warehouse", "type": "INTEGER"}
            ],
            "rows": [
                [8, 37.75, 29.99, 45.00, 520]
            ],
            "note": "Single row generated summarizing all 8 books in inventory"
        }
    }
)

add_slide(
    sec6, "Basic Aggregation", "6.2", "Lesson",
    "How does COUNT(DISTINCT) count unique entities in an aggregate query?",
    [
        "Combining **`COUNT(DISTINCT column)`** calculates the count of unique values, ignoring duplicate occurrences.",
        "Example: `COUNT(customer_id)` counts total orders, while `COUNT(DISTINCT customer_id)` counts unique paying customers.",
        "You can combine multiple standard aggregates alongside distinct aggregates in the same SELECT statement.",
        "Be cautious: `COUNT(DISTINCT)` cannot utilize simple pre-computed table counters and requires sorting or hashing values."
    ],
    "Use COUNT(DISTINCT col) to calculate unique active entities rather than total transaction events.",
    "-- Unique entities vs total transaction counts\nSELECT \n  COUNT(*) AS total_orders_placed,\n  COUNT(DISTINCT customer_id) AS unique_purchasing_customers,\n  SUM(total_amount) AS total_gross_revenue,\n  ROUND(AVG(total_amount), 2) AS average_order_value\nFROM orders;",
    "Demonstrate how 6 total orders came from only 5 unique customers because Alice ordered twice.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "Order Metrics with COUNT(DISTINCT)",
            "columns": [
                {"name": "total_orders_placed", "type": "INTEGER"},
                {"name": "unique_purchasing_customers", "type": "INTEGER"},
                {"name": "total_gross_revenue", "type": "REAL"},
                {"name": "average_order_value", "type": "REAL"}
            ],
            "rows": [
                [6, 5, 393.96, 65.66]
            ],
            "note": "6 orders placed by 5 distinct customers"
        }
    }
)

add_slide(
    sec6, "Aggregation Quiz", "6.3", "Quiz",
    "Module 6 Quiz: Test your grasp of aggregate functions and GROUP BY mechanics",
    [
        "Verify your knowledge of COUNT(*), NULL handling in AVG(), and GROUP BY rules.",
        "Test your understanding of the difference between WHERE and HAVING.",
        "Answer the 4 questions in the interactive quiz card."
    ],
    "Test your aggregate analysis and grouping knowledge.",
    "-- Interactive quiz slide.\n-- Answer questions in the visual panel on the left.\nSELECT 'Test your Aggregations knowledge.' AS status;",
    "Emphasize the Golden Rule: Any non-aggregated column in SELECT must be included in the GROUP BY clause.",
    {
        "type": "sql-quiz",
        "data": {
            "quizTitle": "Module 6: Aggregations & GROUP BY Quiz",
            "questions": [
                {
                    "question": "What is the difference between COUNT(*) and COUNT(column_name)?",
                    "options": [
                        "COUNT(*) is slower in all databases",
                        "COUNT(*) counts all rows including NULLs; COUNT(column_name) ignores NULL values",
                        "COUNT(column_name) returns distinct values only",
                        "There is no difference"
                    ],
                    "answer": 1,
                    "explanation": "COUNT(*) counts total row tuples regardless of content. COUNT(col) counts only rows where col IS NOT NULL."
                },
                {
                    "question": "When does the HAVING clause filter data compared to the WHERE clause?",
                    "options": [
                        "WHERE filters before grouping; HAVING filters after grouping on aggregated results",
                        "HAVING filters before grouping; WHERE filters after grouping",
                        "They are identical and can be used interchangeably anywhere",
                        "HAVING only works on primary keys"
                    ],
                    "answer": 0,
                    "explanation": "WHERE filters raw individual rows before GROUP BY occurs; HAVING filters aggregated bucket metrics after grouping."
                },
                {
                    "question": "If you write 'SELECT category, AVG(price) FROM books;', what is missing in standard SQL?",
                    "options": [
                        "A WHERE clause",
                        "GROUP BY category",
                        "An ORDER BY clause",
                        "A LIMIT clause"
                    ],
                    "answer": 1,
                    "explanation": "Because 'category' is a non-aggregate column, standard SQL requires 'GROUP BY category' to determine group buckets."
                },
                {
                    "question": "How does the AVG() function treat NULL values?",
                    "options": [
                        "It treats NULL as zero (0)",
                        "It completely ignores NULL values from both the sum and the row count",
                        "It returns NULL if any value in the column is NULL",
                        "It throws a runtime error"
                    ],
                    "answer": 1,
                    "explanation": "Aggregate functions (except COUNT(*)) silently skip NULL values in their calculations."
                }
            ]
        }
    }
)

add_slide(
    sec6, "Grouping Data", "6.4", "Lesson",
    "How does GROUP BY bucket table rows into categorical summary partitions?",
    [
        "**`GROUP BY column1, column2`** partitions rows sharing the same values into summary buckets.",
        "Aggregate functions like `COUNT()`, `SUM()`, and `AVG()` then compute results **per group** instead of table-wide.",
        "**The Golden Rule of SQL Grouping**: Every column in the `SELECT` list must either be inside an aggregate function OR listed in the `GROUP BY` clause.",
        "You can group by multiple columns (e.g. `GROUP BY department, job_title`)."
    ],
    "GROUP BY partitions records into buckets; any unaggregated column in SELECT must appear in GROUP BY.",
    "-- Calculate catalog metrics grouped by category\nSELECT \n  category,\n  COUNT(*) AS book_count,\n  ROUND(AVG(price), 2) AS avg_price,\n  SUM(stock) AS total_category_stock\nFROM books\nGROUP BY category\nORDER BY book_count DESC;",
    "Demonstrate how each distinct category forms its own discrete summary row.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "Books Grouped by Category",
            "columns": [
                {"name": "category", "type": "TEXT", "isPk": True},
                {"name": "book_count", "type": "INTEGER"},
                {"name": "avg_price", "type": "REAL"},
                {"name": "total_category_stock", "type": "INTEGER"}
            ],
            "rows": [
                ["Software Engineering", 3, 35.83, 135],
                ["System Design", 2, 41.00, 215],
                ["AI & Data", 2, 34.25, 90],
                ["Distributed Systems", 1, 45.00, 80]
            ],
            "note": "4 categorical summary groups generated"
        }
    }
)

add_slide(
    sec6, "Grouping and Filtering", "6.5", "Lesson",
    "How does the HAVING clause filter aggregated groups after GROUP BY evaluation?",
    [
        "**`WHERE`** filters individual rows **BEFORE** aggregation takes place.",
        "**`HAVING`** filters summary groups **AFTER** aggregation is computed.",
        "You cannot use aggregate functions inside a `WHERE` clause (`WHERE AVG(price) > 30` is illegal SQL!).",
        "Instead, use `HAVING AVG(price) > 30` to filter aggregated category buckets.",
        "Full query clause order: `FROM` -> `WHERE` -> `GROUP BY` -> `HAVING` -> `SELECT` -> `ORDER BY` -> `LIMIT`."
    ],
    "WHERE filters rows before grouping; HAVING filters aggregated group metrics after GROUP BY.",
    "-- Filter categories having more than 1 book and an average price >= $35.00\nSELECT \n  category,\n  COUNT(*) AS book_count,\n  ROUND(AVG(price), 2) AS avg_price\nFROM books\nWHERE stock > 0                       -- 1. Filter individual rows first\nGROUP BY category                     -- 2. Group into buckets\nHAVING COUNT(*) > 1 AND AVG(price) >= 35.00 -- 3. Filter group metrics\nORDER BY avg_price DESC;              -- 4. Sort results",
    "Drill the standard logical processing order so students never try using aggregate expressions in WHERE.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "HAVING Filtered Categories",
            "columns": [
                {"name": "category", "type": "TEXT"},
                {"name": "book_count", "type": "INTEGER"},
                {"name": "avg_price", "type": "REAL"}
            ],
            "rows": [
                ["System Design", 2, 41.00],
                ["Software Engineering", 3, 35.83]
            ],
            "note": "AI & Data and Distributed Systems excluded by HAVING filters"
        }
    }
)

# Challenges in Section 6
add_slide(
    sec6, "Book Sales Summary", "6.6", "Challenge",
    "Challenge: Calculate total quantity sold and revenue generated per book",
    [
        "**Task**: Join `books b` and `order_items oi` to calculate sales performance per title.",
        "Return:",
        "- `b.title`",
        "- `SUM(oi.quantity) AS total_units_sold`",
        "- `ROUND(SUM(oi.quantity * oi.unit_price), 2) AS gross_revenue`",
        "Group by `b.id`, `b.title` and sort by `gross_revenue` DESC."
    ],
    "Join books with order_items, group by book title, and sum quantity and revenue.",
    "-- WRITE YOUR AGGREGATE JOIN QUERY HERE:\nSELECT \n  b.title,\n  SUM(oi.quantity) AS total_units_sold,\n  ROUND(SUM(oi.quantity * oi.unit_price), 2) AS gross_revenue\nFROM books b\nJOIN order_items oi ON b.id = oi.book_id\nGROUP BY b.id, b.title\nORDER BY gross_revenue DESC;",
    "Point out that grouping by both b.id and b.title preserves ANSI SQL compliance while preventing title collisions.",
    {
        "type": "solution"
    },
    {
        "approach": "Join books with order_items, group by book id and title, and calculate aggregate sums of units and revenue.",
        "code": "SELECT \n  b.title,\n  SUM(oi.quantity) AS total_units_sold,\n  ROUND(SUM(oi.quantity * oi.unit_price), 2) AS gross_revenue\nFROM books b\nJOIN order_items oi ON b.id = oi.book_id\nGROUP BY b.id, b.title\nORDER BY gross_revenue DESC;",
        "timeComplexity": "O(N log G) where G is unique books",
        "spaceComplexity": "O(G)",
        "explanationPoints": [
            "INNER JOIN pairs each order line item with its book title.",
            "`SUM(oi.quantity * oi.unit_price)` computes total sales revenue.",
            "`GROUP BY b.id, b.title` produces 1 row per distinct book."
        ]
    }
)

add_slide(
    sec6, "Category Insights", "6.7", "Challenge",
    "Challenge: High-level category performance audit",
    [
        "**Task**: In the `books` table, group by `category` and compute:",
        "- `COUNT(*) AS total_titles`",
        "- `ROUND(AVG(price), 2) AS average_price`",
        "- `MIN(price) AS min_price`",
        "- `MAX(price) AS max_price`",
        "Order by `total_titles` DESC, `category` ASC."
    ],
    "Group by category and calculate count, avg, min, and max price per genre.",
    "-- WRITE YOUR CATEGORY INSIGHTS QUERY HERE:\nSELECT \n  category,\n  COUNT(*) AS total_titles,\n  ROUND(AVG(price), 2) AS average_price,\n  MIN(price) AS min_price,\n  MAX(price) AS max_price\nFROM books\nGROUP BY category\nORDER BY total_titles DESC, category ASC;",
    "Demonstrate how multiple aggregates on a single column provide a complete statistical summary.",
    {
        "type": "solution"
    },
    {
        "approach": "Group by category and apply COUNT, AVG, MIN, and MAX functions.",
        "code": "SELECT \n  category,\n  COUNT(*) AS total_titles,\n  ROUND(AVG(price), 2) AS average_price,\n  MIN(price) AS min_price,\n  MAX(price) AS max_price\nFROM books\nGROUP BY category\nORDER BY total_titles DESC, category ASC;",
        "timeComplexity": "O(N log C) where C is categories",
        "spaceComplexity": "O(C)",
        "explanationPoints": [
            "`ROUND(AVG(price), 2)` trims floating point averages to standard cents.",
            "MIN and MAX reveal price dispersion within each technical niche."
        ]
    }
)

add_slide(
    sec6, "Author Tier Analysis", "6.8", "Challenge",
    "Challenge: Analyze book pricing by author prestige tier",
    [
        "**Task**: Join `authors a` and `books b` on `a.id = b.author_id`.",
        "Group by `a.tier` (e.g. 'Tier 1', 'Tier 2') and calculate:",
        "- `COUNT(DISTINCT a.id) AS author_count`",
        "- `COUNT(b.id) AS book_count`",
        "- `ROUND(AVG(b.price), 2) AS average_book_price`",
        "Order by `a.tier` ASC."
    ],
    "Join authors and books, group by tier, and compute author count, book count, and avg price.",
    "-- WRITE YOUR QUERY HERE:\nSELECT \n  a.tier,\n  COUNT(DISTINCT a.id) AS author_count,\n  COUNT(b.id) AS book_count,\n  ROUND(AVG(b.price), 2) AS average_book_price\nFROM authors a\nJOIN books b ON a.id = b.author_id\nGROUP BY a.tier\nORDER BY a.tier ASC;",
    "Contrast COUNT(DISTINCT a.id) with COUNT(b.id) to highlight counting authors versus counting books.",
    {
        "type": "solution"
    },
    {
        "approach": "Join authors to books, group by tier, and count distinct authors alongside total books and average price.",
        "code": "SELECT \n  a.tier,\n  COUNT(DISTINCT a.id) AS author_count,\n  COUNT(b.id) AS book_count,\n  ROUND(AVG(b.price), 2) AS average_book_price\nFROM authors a\nJOIN books b ON a.id = b.author_id\nGROUP BY a.tier\nORDER BY a.tier ASC;",
        "timeComplexity": "O(N log T) where T is tiers",
        "spaceComplexity": "O(T)",
        "explanationPoints": [
            "`COUNT(DISTINCT a.id)` ensures an author with 3 books is only counted as 1 author in the tier.",
            "`AVG(b.price)` compares pricing power between Tier 1 and Tier 2 authors."
        ]
    }
)

add_slide(
    sec6, "Author Book Stats", "6.9", "Challenge",
    "Challenge: Aggregate catalog statistics per author",
    [
        "**Task**: For each author in `authors`, find their total catalog size and highest rated book score.",
        "Join `authors a` with `books b`.",
        "Return `a.name AS author_name`, `COUNT(b.id) AS titles_count`, and `MAX(b.rating) AS highest_rating`.",
        "Group by `a.id`, `a.name` and order by `titles_count` DESC."
    ],
    "Join authors and books, group by author name, and compute titles_count and max rating.",
    "-- WRITE YOUR QUERY HERE:\nSELECT \n  a.name AS author_name,\n  COUNT(b.id) AS titles_count,\n  MAX(b.rating) AS highest_rating\nFROM authors a\nJOIN books b ON a.id = b.author_id\nGROUP BY a.id, a.name\nORDER BY titles_count DESC, highest_rating DESC;",
    "Show how authors with prolific catalogs surface at the top of the leaderboard.",
    {
        "type": "solution"
    },
    {
        "approach": "Join authors to books on author_id, group by author ID and name, and compute COUNT and MAX.",
        "code": "SELECT \n  a.name AS author_name,\n  COUNT(b.id) AS titles_count,\n  MAX(b.rating) AS highest_rating\nFROM authors a\nJOIN books b ON a.id = b.author_id\nGROUP BY a.id, a.name\nORDER BY titles_count DESC, highest_rating DESC;",
        "timeComplexity": "O(N log A)",
        "spaceComplexity": "O(A)",
        "explanationPoints": [
            "`COUNT(b.id)` counts the number of published volumes per writer.",
            "`MAX(b.rating)` finds their peak critical acclaim."
        ]
    }
)

add_slide(
    sec6, "Daily Sales Report", "6.10", "Challenge",
    "Challenge: Group customer orders into daily revenue batches",
    [
        "**Task**: Group all records in `orders` by `order_date`.",
        "Calculate:",
        "- `COUNT(*) AS orders_count`",
        "- `ROUND(SUM(total_amount), 2) AS daily_revenue`",
        "- `ROUND(AVG(total_amount), 2) AS avg_order_value`",
        "Order chronologically by `order_date` ASC."
    ],
    "Group orders by order_date and compute orders_count, daily_revenue, and avg_order_value.",
    "-- WRITE YOUR DAILY SALES QUERY HERE:\nSELECT \n  order_date,\n  COUNT(*) AS orders_count,\n  ROUND(SUM(total_amount), 2) AS daily_revenue,\n  ROUND(AVG(total_amount), 2) AS avg_order_value\nFROM orders\nGROUP BY order_date\nORDER BY order_date ASC;",
    "Demonstrate how financial dashboards aggregate timestamps into daily, weekly, or monthly bars.",
    {
        "type": "solution"
    },
    {
        "approach": "Group by order_date and aggregate count, sum, and average of order totals.",
        "code": "SELECT \n  order_date,\n  COUNT(*) AS orders_count,\n  ROUND(SUM(total_amount), 2) AS daily_revenue,\n  ROUND(AVG(total_amount), 2) AS avg_order_value\nFROM orders\nGROUP BY order_date\nORDER BY order_date ASC;",
        "timeComplexity": "O(N log D)",
        "spaceComplexity": "O(D)",
        "explanationPoints": [
            "`GROUP BY order_date` collapses individual transactions into calendar days.",
            "`SUM(total_amount)` computes the day's gross cash intake."
        ]
    }
)

add_slide(
    sec6, "Publisher Stats", "6.11", "Challenge",
    "Challenge: Summarize publishing house revenue and company locations",
    [
        "**Task**: In the `publishers` table, calculate the total revenue generated across all publishers.",
        "Return:",
        "- `COUNT(*) AS total_publishers`",
        "- `ROUND(SUM(revenue) / 1000000.0, 2) AS total_revenue_millions`",
        "- `ROUND(AVG(revenue) / 1000000.0, 2) AS average_revenue_millions`"
    ],
    "Summarize corporate revenue metrics in millions across the publishing industry.",
    "-- WRITE YOUR PUBLISHER STATS QUERY HERE:\nSELECT \n  COUNT(*) AS total_publishers,\n  ROUND(SUM(revenue) / 1000000.0, 2) AS total_revenue_millions,\n  ROUND(AVG(revenue) / 1000000.0, 2) AS average_revenue_millions\nFROM publishers;",
    "Show how dividing by 1,000,000.0 scales unwieldy currency figures into executive-ready metrics.",
    {
        "type": "solution"
    },
    {
        "approach": "Run table-wide aggregates on publishers converting currency to millions.",
        "code": "SELECT \n  COUNT(*) AS total_publishers,\n  ROUND(SUM(revenue) / 1000000.0, 2) AS total_revenue_millions,\n  ROUND(AVG(revenue) / 1000000.0, 2) AS average_revenue_millions\nFROM publishers;",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "explanationPoints": [
            "Table-wide aggregates without GROUP BY output a single consolidated row.",
            "Dividing by `1000000.0` uses floating point division to format as millions."
        ]
    }
)

add_slide(
    sec6, "High Value Publishers", "6.12", "Challenge",
    "Challenge: Filter large-market publishers using HAVING",
    [
        "**Task**: Filter `publishers` to only those with `revenue >= 20000000` ($20 Million).",
        "Group by `city` and calculate `COUNT(*) AS publisher_count` and `SUM(revenue) AS city_revenue`.",
        "Include a `HAVING` clause requiring `SUM(revenue) > 25000000`."
    ],
    "Group publishers by city, filter with WHERE and HAVING, and aggregate revenue.",
    "-- WRITE YOUR QUERY HERE:\nSELECT \n  city,\n  COUNT(*) AS publisher_count,\n  SUM(revenue) AS city_revenue\nFROM publishers\nWHERE revenue >= 20000000\nGROUP BY city\nHAVING SUM(revenue) > 25000000\nORDER BY city_revenue DESC;",
    "Review how WHERE filters individual publishers before city groups are summed in HAVING.",
    {
        "type": "solution"
    },
    {
        "approach": "Combine WHERE revenue >= 20M with GROUP BY city and HAVING SUM(revenue) > 25M.",
        "code": "SELECT \n  city,\n  COUNT(*) AS publisher_count,\n  SUM(revenue) AS city_revenue\nFROM publishers\nWHERE revenue >= 20000000\nGROUP BY city\nHAVING SUM(revenue) > 25000000\nORDER BY city_revenue DESC;",
        "timeComplexity": "O(N log C)",
        "spaceComplexity": "O(C)",
        "explanationPoints": [
            "`WHERE revenue >= 20000000` drops small boutique presses before grouping.",
            "`HAVING SUM(revenue) > 25000000` filters out cities whose collective publishing volume falls below $25M."
        ]
    }
)

add_slide(
    sec6, "Premium Authors", "6.13", "Challenge",
    "Challenge: Identify elite authors with stellar average catalog ratings",
    [
        "**Task**: Join `authors a` with `books b`.",
        "Group by `a.id`, `a.name`.",
        "Use a `HAVING` clause to filter for authors whose **average book rating** is at least `4.8` (`AVG(b.rating) >= 4.8`).",
        "Return `a.name AS author_name`, `COUNT(b.id) AS catalog_size`, and `ROUND(AVG(b.rating), 2) AS avg_rating`."
    ],
    "Join authors and books, group by author, and filter HAVING AVG(b.rating) >= 4.8.",
    "-- WRITE YOUR QUERY HERE:\nSELECT \n  a.name AS author_name,\n  COUNT(b.id) AS catalog_size,\n  ROUND(AVG(b.rating), 2) AS avg_rating\nFROM authors a\nJOIN books b ON a.id = b.author_id\nGROUP BY a.id, a.name\nHAVING AVG(b.rating) >= 4.8\nORDER BY avg_rating DESC, catalog_size DESC;",
    "Demonstrate using HAVING on an aggregate expression (AVG) that does not physically exist as a column in authors.",
    {
        "type": "solution"
    },
    {
        "approach": "Join authors to books, group by author ID and name, and filter with HAVING AVG(b.rating) >= 4.8.",
        "code": "SELECT \n  a.name AS author_name,\n  COUNT(b.id) AS catalog_size,\n  ROUND(AVG(b.rating), 2) AS avg_rating\nFROM authors a\nJOIN books b ON a.id = b.author_id\nGROUP BY a.id, a.name\nHAVING AVG(b.rating) >= 4.8\nORDER BY avg_rating DESC, catalog_size DESC;",
        "timeComplexity": "O(N log A)",
        "spaceComplexity": "O(A)",
        "explanationPoints": [
            "`HAVING AVG(b.rating) >= 4.8` isolates authors whose average critical score meets the premium threshold.",
            "Sorting surfaces the highest-rated creators first."
        ]
    }
)

add_slide(
    sec6, "Sales Analysis", "6.14", "Challenge",
    "Challenge: International sales breakdown by customer country",
    [
        "**Task**: Join `customers c` and `orders o`.",
        "Group by `c.country` and compute:",
        "- `COUNT(DISTINCT c.id) AS active_customers`",
        "- `COUNT(o.id) AS total_orders`",
        "- `ROUND(SUM(o.total_amount), 2) AS gross_country_sales`",
        "Order by `gross_country_sales` DESC."
    ],
    "Join customers and orders, group by country, and calculate regional sales volume.",
    "-- WRITE YOUR REGIONAL SALES QUERY HERE:\nSELECT \n  c.country,\n  COUNT(DISTINCT c.id) AS active_customers,\n  COUNT(o.id) AS total_orders,\n  ROUND(SUM(o.total_amount), 2) AS gross_country_sales\nFROM customers c\nJOIN orders o ON c.id = o.customer_id\nGROUP BY c.country\nORDER BY gross_country_sales DESC;",
    "Show how regional market share reports guide international currency expansion.",
    {
        "type": "solution"
    },
    {
        "approach": "Join customers to orders, group by c.country, and aggregate active customers, order count, and gross sum.",
        "code": "SELECT \n  c.country,\n  COUNT(DISTINCT c.id) AS active_customers,\n  COUNT(o.id) AS total_orders,\n  ROUND(SUM(o.total_amount), 2) AS gross_country_sales\nFROM customers c\nJOIN orders o ON c.id = o.customer_id\nGROUP BY c.country\nORDER BY gross_country_sales DESC;",
        "timeComplexity": "O(N log C)",
        "spaceComplexity": "O(C)",
        "explanationPoints": [
            "`COUNT(DISTINCT c.id)` prevents counting the same buyer multiple times in the active customer tally.",
            "`SUM(o.total_amount)` totals the country's economic volume."
        ]
    }
)

add_slide(
    sec6, "Employee Performance", "6.15", "Challenge",
    "Challenge: Compute department payroll statistics and headcount",
    [
        "**Task**: In the `employees` table, group by `department` and compute:",
        "- `COUNT(*) AS headcount`",
        "- `ROUND(AVG(salary), 2) AS avg_salary`",
        "- `MIN(salary) AS min_salary`",
        "- `MAX(salary) AS max_salary`",
        "- `SUM(salary) AS total_department_payroll`",
        "Order by `total_department_payroll` DESC."
    ],
    "Group employees by department and calculate headcount, avg salary, and total payroll.",
    "-- WRITE YOUR DEPARTMENT PAYROLL QUERY HERE:\nSELECT \n  department,\n  COUNT(*) AS headcount,\n  ROUND(AVG(salary), 2) AS avg_salary,\n  MIN(salary) AS min_salary,\n  MAX(salary) AS max_salary,\n  SUM(salary) AS total_department_payroll\nFROM employees\nGROUP BY department\nORDER BY total_department_payroll DESC;",
    "Demonstrate how HR and corporate budgeting systems use payroll aggregates for headcount planning.",
    {
        "type": "solution"
    },
    {
        "approach": "Group by department and compute comprehensive salary aggregates.",
        "code": "SELECT \n  department,\n  COUNT(*) AS headcount,\n  ROUND(AVG(salary), 2) AS avg_salary,\n  MIN(salary) AS min_salary,\n  MAX(salary) AS max_salary,\n  SUM(salary) AS total_department_payroll\nFROM employees\nGROUP BY department\nORDER BY total_department_payroll DESC;",
        "timeComplexity": "O(N log D)",
        "spaceComplexity": "O(D)",
        "explanationPoints": [
            "Computes department headcount and payroll budget.",
            "Comparing MIN and MAX salary reveals internal pay dispersion."
        ]
    }
)

print(f"Generated Section 6 (Current total slides: {len(slides)})")

# ==========================================
# SECTION 7: Scalar Functions (12 slides)
# ==========================================
sec7 = "7. Scalar Functions"

add_slide(
    sec7, "What are they?", "7.1", "Lesson",
    "How do scalar functions transform individual column values row-by-row?",
    [
        "Unlike aggregate functions that collapse multiple rows into one, **scalar functions** operate on a single input row and return a single output value.",
        "They execute row-by-row during query evaluation.",
        "Categories of scalar functions:",
        "- **String transformations**: `UPPER()`, `LOWER()`, `LENGTH()`, `SUBSTR()`, `TRIM()`.",
        "- **Mathematical transformations**: `ROUND()`, `ABS()`, `RANDOM()`.",
        "- **Date/Time transformations**: `DATE()`, `STRFTIME()`, `JULIANDAY()`.",
        "- **Conditional logic**: `CASE WHEN ... THEN ... ELSE ... END`, `COALESCE()`."
    ],
    "Scalar functions execute on each individual row, preserving the row count while transforming data values.",
    "-- Transforming customer data using scalar functions\nSELECT \n  name,\n  UPPER(name) AS uppercase_name,\n  LENGTH(name) AS character_count,\n  LOWER(email) AS standardized_email,\n  SUBSTR(name, 1, 1) AS initial\nFROM customers\nLIMIT 4;",
    "Emphasize that scalar functions can be nested: e.g. UPPER(SUBSTR(name, 1, 3)).",
    {
        "type": "sql-table",
        "data": {
            "tableName": "Scalar Function Output",
            "columns": [
                {"name": "name", "type": "TEXT"},
                {"name": "uppercase_name", "type": "TEXT"},
                {"name": "character_count", "type": "INTEGER"},
                {"name": "standardized_email", "type": "TEXT"},
                {"name": "initial", "type": "TEXT"}
            ],
            "rows": [
                ["Alice Smith", "ALICE SMITH", 11, "alice@tech.io", "A"],
                ["Bob Johnson", "BOB JOHNSON", 11, "bob@developer.org", "B"],
                ["Charlie Brown", "CHARLIE BROWN", 13, "charlie@ai.com", "C"]
            ],
            "note": "Row count unchanged; values transformed row-by-row"
        }
    }
)

add_slide(
    sec7, "String Functions", "7.2", "Lesson",
    "How do string manipulation functions sanitize, slice, and concatenate text?",
    [
        "**`UPPER(str)` / `LOWER(str)`**: Normalizes text case for case-insensitive matching.",
        "**`SUBSTR(str, start, length)`**: Extracts a substring starting at 1-based index `start`.",
        "**`TRIM(str)`**: Strips leading and trailing whitespace characters.",
        "**`REPLACE(str, search, replacement)`**: Replaces occurrences of a substring.",
        "**Concatenation (`||`)**: Merges multiple text expressions into a single string."
    ],
    "Use || for string concatenation and SUBSTR(str, start, len) to extract slices.",
    "-- String manipulation demonstration\nSELECT \n  title,\n  SUBSTR(title, 1, 15) || '...' AS truncated_title,\n  UPPER(category) AS upper_category,\n  REPLACE(category, ' ', '_') AS slug_category\nFROM books\nLIMIT 4;",
    "Remind students that SQL string indexes start at 1, NOT 0 like in Python or JavaScript.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "String Transformations",
            "columns": [
                {"name": "title", "type": "TEXT"},
                {"name": "truncated_title", "type": "TEXT"},
                {"name": "upper_category", "type": "TEXT"},
                {"name": "slug_category", "type": "TEXT"}
            ],
            "rows": [
                ["Clean Code", "Clean Code...", "SOFTWARE ENGINEERING", "Software_Engineering"],
                ["Designing Data-Intensive Applications", "Designing Data-...", "DISTRIBUTED SYSTEMS", "Distributed_Systems"]
            ],
            "note": "Concatenation and replacement evaluated"
        }
    }
)

add_slide(
    sec7, "Numeric Functions", "7.3", "Lesson",
    "How do mathematical scalar functions round, compute absolute values, and generate randoms?",
    [
        "**`ROUND(num, decimals)`**: Rounds a floating point number to `decimals` decimal places.",
        "**`ABS(num)`**: Computes the absolute positive value (e.g., `ABS(-15.4) -> 15.4`).",
        "**`RANDOM()`**: Generates a pseudo-random signed 64-bit integer.",
        "SQLite idiom for random sample rows: `ORDER BY RANDOM() LIMIT 1` picks a random record from a table."
    ],
    "Use ROUND(num, 2) for financial formatting and ORDER BY RANDOM() LIMIT n for random sampling.",
    "-- Mathematical functions on prices and random sampling\nSELECT \n  title,\n  price,\n  ROUND(price * 0.925, 2) AS price_with_tax,\n  ABS(price - 40.00) AS variance_from_40_usd\nFROM books\nORDER BY RANDOM()\nLIMIT 3;",
    "Warn learners that ORDER BY RANDOM() requires a full table scan, so avoid it on billion-row tables in production.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "Numeric Transformations",
            "columns": [
                {"name": "title", "type": "TEXT"},
                {"name": "price", "type": "REAL"},
                {"name": "price_with_tax", "type": "REAL"},
                {"name": "variance_from_40_usd", "type": "REAL"}
            ],
            "rows": [
                ["Clean Code", 32.50, 30.06, 7.50],
                ["Designing Data-Intensive Applications", 45.00, 41.63, 5.00]
            ],
            "note": "Tax and variance computed using ROUND and ABS"
        }
    }
)

add_slide(
    sec7, "Scalar Functions Quiz", "7.4", "Quiz",
    "Module 7 Quiz: Test your grasp of string, numeric, date, and CASE scalar expressions",
    [
        "Verify your mastery of row-level scalar transformations.",
        "Test 1-based indexing in SUBSTR and conditional CASE evaluation.",
        "Answer the 4 questions in the interactive quiz card."
    ],
    "Test your scalar function and data transformation knowledge.",
    "-- Interactive quiz slide.\n-- Answer questions in the visual panel on the left.\nSELECT 'Test your Scalar Functions knowledge.' AS status;",
    "Review how CASE WHEN evaluates in top-to-bottom short-circuit order.",
    {
        "type": "sql-quiz",
        "data": {
            "quizTitle": "Module 7: Scalar Functions Quiz",
            "questions": [
                {
                    "question": "In standard SQL, what does SUBSTR('Database', 1, 4) return?",
                    "options": ["Data", "atab", "base", "Data (0-indexed)"],
                    "answer": 0,
                    "explanation": "SQL strings are 1-based: index 1 starts at 'D', taking 4 characters yields 'Data'."
                },
                {
                    "question": "What is the standard SQL string concatenation operator in SQLite and PostgreSQL?",
                    "options": ["+", "&", "||", "CONCAT_SYM"],
                    "answer": 2,
                    "explanation": "The double pipe '||' is the ANSI standard string concatenation operator."
                },
                {
                    "question": "What does CASE WHEN ... THEN ... ELSE ... END do in SQL?",
                    "options": [
                        "It creates a loop that executes multiple times",
                        "It provides if-then-else conditional logic within query expressions",
                        "It pauses execution like a switch statement",
                        "It defines a database trigger"
                    ],
                    "answer": 1,
                    "explanation": "CASE expressions evaluate conditions sequentially and return the matching THEN value, or the ELSE fallback."
                },
                {
                    "question": "What does STRFTIME('%Y-%m', '2024-03-15') produce?",
                    "options": ["2024", "03", "'2024-03'", "15-03-2024"],
                    "answer": 2,
                    "explanation": "STRFTIME formats date strings according to format specifiers; '%Y-%m' yields Year and Month."
                }
            ]
        }
    }
)

add_slide(
    sec7, "Date Functions", "7.5", "Lesson",
    "How does STRFTIME extract years, months, days, and quarters from ISO timestamps?",
    [
        "**`STRFTIME(format, timestring)`** formats and extracts date components.",
        "Key format specifiers:",
        "- `'%Y'`: 4-digit Year (`2024`)",
        "- `'%m'`: 2-digit Month (`01` through `12`)",
        "- `'%d'`: 2-digit Day of the month (`01` through `31`)",
        "- `'%w'`: Day of the week (`0` = Sunday, `6` = Saturday)",
        "- `'%Y-%m'`: Standard Year-Month cohort bucket.",
        "Essential for grouping time-series analytics by month or quarter."
    ],
    "Use STRFTIME('%Y-%m', date) to roll up time-series transactions into monthly cohort buckets.",
    "-- Extracting temporal dimensions from orders\nSELECT \n  id AS order_id,\n  order_date,\n  STRFTIME('%Y', order_date) AS order_year,\n  STRFTIME('%m', order_date) AS order_month,\n  STRFTIME('%Y-%m', order_date) AS year_month_cohort,\n  STRFTIME('%w', order_date) AS day_of_week_num\nFROM orders;",
    "Demonstrate grouping by STRFTIME('%Y-%m', order_date) to create monthly revenue bar charts.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "STRFTIME Date Decomposition",
            "columns": [
                {"name": "order_id", "type": "INTEGER", "isPk": True},
                {"name": "order_date", "type": "TEXT"},
                {"name": "order_year", "type": "TEXT"},
                {"name": "order_month", "type": "TEXT"},
                {"name": "year_month_cohort", "type": "TEXT"},
                {"name": "day_of_week_num", "type": "TEXT"}
            ],
            "rows": [
                [1, "2024-01-10", "2024", "01", "2024-01", "3"],
                [2, "2024-01-14", "2024", "01", "2024-01", "0"],
                [3, "2024-02-01", "2024", "02", "2024-02", "4"]
            ],
            "note": "Date components parsed for time-series aggregation"
        }
    }
)

add_slide(
    sec7, "Conversion Functions", "7.6", "Lesson",
    "How does the CAST statement safely convert data types in query expressions?",
    [
        "**`CAST(expression AS target_type)`** explicitly converts data types.",
        "Common conversions:",
        "- `CAST('42.50' AS REAL)`: Converts string text to floating-point number.",
        "- `CAST(price AS INTEGER)`: Truncates decimal values to whole integers.",
        "- `CAST(id AS TEXT)`: Converts numeric identifiers to strings for concatenation.",
        "Crucial for ensuring numeric sorting when numbers are stored in text columns."
    ],
    "Use CAST(col AS type) to convert strings to numbers and prevent lexicographical sorting bugs.",
    "-- Type casting demonstration\nSELECT \n  title,\n  price,\n  CAST(price AS INTEGER) AS whole_dollars,\n  CAST(price AS TEXT) AS price_string,\n  'Book #' || CAST(id AS TEXT) AS book_code\nFROM books\nLIMIT 4;",
    "Warn students what happens if you sort text numbers without casting: '10' sorts before '2'!",
    {
        "type": "sql-table",
        "data": {
            "tableName": "CAST() Conversions",
            "columns": [
                {"name": "title", "type": "TEXT"},
                {"name": "price", "type": "REAL"},
                {"name": "whole_dollars", "type": "INTEGER"},
                {"name": "price_string", "type": "TEXT"},
                {"name": "book_code", "type": "TEXT"}
            ],
            "rows": [
                ["Clean Code", 32.50, 32, "32.5", "Book #1"],
                ["Designing Data-Intensive Applications", 45.00, 45, "45.0", "Book #2"]
            ],
            "note": "Types converted across REAL, INTEGER, and TEXT"
        }
    }
)

add_slide(
    sec7, "Logical Functions", "7.7", "Lesson",
    "How do CASE expressions and IIF implement conditional branching in SQL?",
    [
        "The **`CASE`** expression brings if/then/else logic directly into queries:",
        "```sql\nCASE\n  WHEN condition1 THEN result1\n  WHEN condition2 THEN result2\n  ELSE default_result\nEND\n```",
        "It evaluates conditions sequentially and returns the first matching branch.",
        "SQLite 3.32+ also supports the shorthand **`IIF(condition, true_val, false_val)`**.",
        "Use CASE to bucket continuous metrics into business tiers (e.g. Bronze, Silver, Gold)."
    ],
    "The CASE WHEN expression provides row-level if-then-else branching for labeling and categorization.",
    "-- Classify books into price tiers using CASE\nSELECT \n  title,\n  price,\n  CASE \n    WHEN price >= 42.00 THEN 'Premium Tier'\n    WHEN price >= 35.00 THEN 'Standard Tier'\n    ELSE 'Budget Friendly'\n  END AS pricing_tier,\n  IIF(stock > 50, 'High Stock', 'Reorder Soon') AS inventory_flag\nFROM books;",
    "Demonstrate how CASE expressions can also be placed inside aggregate functions like SUM(CASE WHEN ...).",
    {
        "type": "sql-table",
        "data": {
            "tableName": "CASE and IIF Classification",
            "columns": [
                {"name": "title", "type": "TEXT"},
                {"name": "price", "type": "REAL"},
                {"name": "pricing_tier", "type": "TEXT"},
                {"name": "inventory_flag", "type": "TEXT"}
            ],
            "rows": [
                ["Designing Data-Intensive Applications", 45.00, "Premium Tier", "High Stock"],
                ["System Design Interview Vol 2", 42.00, "Premium Tier", "High Stock"],
                ["System Design Interview Vol 1", 39.99, "Standard Tier", "High Stock"],
                ["Clean Code", 32.50, "Budget Friendly", "Reorder Soon"]
            ],
            "note": "Categorical labels assigned via conditional evaluation"
        }
    }
)

# Challenges in Section 7
add_slide(
    sec7, "Customer Contact List", "7.8", "Challenge",
    "Challenge: Clean and format standardized international contact labels",
    [
        "**Task**: Create a formatted customer directory from `customers`.",
        "Return a single column aliased as `formatted_contact` containing:",
        "`'ALICE SMITH (USA) <alice@tech.io>'`",
        "Use `UPPER(name)`, `UPPER(country)`, and string concatenation (`||`).",
        "Order alphabetically by `formatted_contact` ASC."
    ],
    "Use UPPER() and || concatenation to format customer contact cards.",
    "-- WRITE YOUR FORMATTING QUERY HERE:\nSELECT \n  UPPER(name) || ' (' || UPPER(country) || ') <' || LOWER(email) || '>' AS formatted_contact\nFROM customers\nORDER BY formatted_contact ASC;",
    "Show how frontend exports and mailing list pipelines rely on SQL string formatting.",
    {
        "type": "solution"
    },
    {
        "approach": "Combine UPPER(name), UPPER(country), and LOWER(email) using the || operator.",
        "code": "SELECT \n  UPPER(name) || ' (' || UPPER(country) || ') <' || LOWER(email) || '>' AS formatted_contact\nFROM customers\nORDER BY formatted_contact ASC;",
        "timeComplexity": "O(N log N)",
        "spaceComplexity": "O(N)",
        "explanationPoints": [
            "`UPPER()` capitalizes customer names and countries.",
            "`LOWER()` normalizes email strings.",
            "`||` stitches literals and column values into standard email address format."
        ]
    }
)

add_slide(
    sec7, "Membership Duration", "7.9", "Challenge",
    "Challenge: Calculate member account tenure in days and years",
    [
        "**Task**: In `customers`, calculate how many days each user has been a member relative to `'2024-06-01'`.",
        "Use `ROUND(JULIANDAY('2024-06-01') - JULIANDAY(joined_date)) AS tenure_days`.",
        "Return `name`, `joined_date`, and `tenure_days`.",
        "Order by `tenure_days` DESC."
    ],
    "Calculate day differences using JULIANDAY('2024-06-01') - JULIANDAY(joined_date).",
    "-- WRITE YOUR TENURE QUERY HERE:\nSELECT \n  name,\n  joined_date,\n  CAST(ROUND(JULIANDAY('2024-06-01') - JULIANDAY(joined_date)) AS INTEGER) AS tenure_days\nFROM customers\nORDER BY tenure_days DESC;",
    "Demonstrate using JULIANDAY() for precise date delta calculations in SQLite.",
    {
        "type": "solution"
    },
    {
        "approach": "Subtract JULIANDAY(joined_date) from target date to obtain total elapsed days.",
        "code": "SELECT \n  name,\n  joined_date,\n  CAST(ROUND(JULIANDAY('2024-06-01') - JULIANDAY(joined_date)) AS INTEGER) AS tenure_days\nFROM customers\nORDER BY tenure_days DESC;",
        "timeComplexity": "O(N log N)",
        "spaceComplexity": "O(N)",
        "explanationPoints": [
            "`JULIANDAY()` converts calendar strings into continuous floating-point day numbers.",
            "Subtraction yields exact elapsed day deltas.",
            "`CAST(... AS INTEGER)` returns clean integer days."
        ]
    }
)

add_slide(
    sec7, "Book Performance", "7.10", "Challenge",
    "Challenge: Classify technical literature into critical tiers with CASE",
    [
        "**Task**: Classify every book in `books` based on its `rating`:",
        "- `rating >= 4.9`: `'Masterpiece'`",
        "- `rating >= 4.7`: `'Bestseller'`",
        "- `ELSE`: `'Standard Quality'`",
        "Return `title`, `rating`, `price`, and the tier aliased as `quality_label`.",
        "Order by `rating` DESC."
    ],
    "Use CASE WHEN rating >= 4.9 THEN ... to assign qualitative labels.",
    "-- WRITE YOUR CASE CLASSIFICATION QUERY HERE:\nSELECT \n  title,\n  rating,\n  price,\n  CASE \n    WHEN rating >= 4.9 THEN 'Masterpiece'\n    WHEN rating >= 4.7 THEN 'Bestseller'\n    ELSE 'Standard Quality'\n  END AS quality_label\nFROM books\nORDER BY rating DESC, price DESC;",
    "Show how CASE expressions provide domain categorization for marketing badges.",
    {
        "type": "solution"
    },
    {
        "approach": "Evaluate rating thresholds using a standard CASE expression with ELSE fallback.",
        "code": "SELECT \n  title,\n  rating,\n  price,\n  CASE \n    WHEN rating >= 4.9 THEN 'Masterpiece'\n    WHEN rating >= 4.7 THEN 'Bestseller'\n    ELSE 'Standard Quality'\n  END AS quality_label\nFROM books\nORDER BY rating DESC, price DESC;",
        "timeComplexity": "O(N log N)",
        "spaceComplexity": "O(N)",
        "explanationPoints": [
            "CASE expressions short-circuit: a 4.9 rating matches the first branch and skips subsequent WHENs.",
            "The `ELSE` clause guarantees no row is labeled NULL."
        ]
    }
)

add_slide(
    sec7, "Book Categories", "7.11", "Challenge",
    "Challenge: Clean and generate URL slugs for books",
    [
        "**Task**: Generate URL routing slugs for all books in `books`.",
        "Slug format: Lowercase title with spaces replaced by hyphens (`-`).",
        "E.g.: `'Clean Code'` -> `'clean-code'`.",
        "Return `id`, `title`, and `LOWER(REPLACE(title, ' ', '-')) AS url_slug`."
    ],
    "Nest LOWER() and REPLACE() to generate web-ready SEO URL slugs.",
    "-- WRITE YOUR URL SLUG QUERY HERE:\nSELECT \n  id,\n  title,\n  LOWER(REPLACE(title, ' ', '-')) AS url_slug\nFROM books\nORDER BY id ASC;",
    "Demonstrate function composition: the output of REPLACE() feeds directly into LOWER().",
    {
        "type": "solution"
    },
    {
        "approach": "Use REPLACE(title, ' ', '-') to swap spaces for hyphens, and wrap in LOWER() for SEO slug generation.",
        "code": "SELECT \n  id,\n  title,\n  LOWER(REPLACE(title, ' ', '-')) AS url_slug\nFROM books\nORDER BY id ASC;",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "explanationPoints": [
            "`REPLACE(title, ' ', '-')` replaces whitespace with dashes.",
            "`LOWER()` ensures all characters are lowercase for web standards."
        ]
    }
)

add_slide(
    sec7, "Monthly Sales Analysis", "7.12", "Challenge",
    "Challenge: Group sales transactions into Year-Month cohort buckets",
    [
        "**Task**: In the `orders` table, group orders by year and month using `STRFTIME('%Y-%m', order_date)`.",
        "Calculate:",
        "- `STRFTIME('%Y-%m', order_date) AS month_cohort`",
        "- `COUNT(*) AS monthly_orders`",
        "- `ROUND(SUM(total_amount), 2) AS monthly_revenue`",
        "Order chronologically by `month_cohort` ASC."
    ],
    "Group by STRFTIME('%Y-%m', order_date) to compute monthly sales metrics.",
    "-- WRITE YOUR MONTHLY ANALYSIS QUERY HERE:\nSELECT \n  STRFTIME('%Y-%m', order_date) AS month_cohort,\n  COUNT(*) AS monthly_orders,\n  ROUND(SUM(total_amount), 2) AS monthly_revenue\nFROM orders\nGROUP BY month_cohort\nORDER BY month_cohort ASC;",
    "Show how STRFTIME enables monthly cohort reporting without needing separate year and month columns in the schema.",
    {
        "type": "solution"
    },
    {
        "approach": "Group by the scalar expression STRFTIME('%Y-%m', order_date) and sum total revenues.",
        "code": "SELECT \n  STRFTIME('%Y-%m', order_date) AS month_cohort,\n  COUNT(*) AS monthly_orders,\n  ROUND(SUM(total_amount), 2) AS monthly_revenue\nFROM orders\nGROUP BY month_cohort\nORDER BY month_cohort ASC;",
        "timeComplexity": "O(N log M) where M is months",
        "spaceComplexity": "O(M)",
        "explanationPoints": [
            "`STRFTIME('%Y-%m', ...)` formats dates into '2024-01', '2024-02', etc.",
            "`GROUP BY month_cohort` aggregates orders occurring within each calendar month.",
            "`ORDER BY month_cohort ASC` ensures chronological output."
        ]
    }
)

print(f"Generated Section 7 (Current total slides: {len(slides)})")

# ==========================================
# SECTION 8: Subqueries and CTEs (11 slides)
# ==========================================
sec8 = "8. Subqueries and CTEs"

add_slide(
    sec8, "What are Subqueries?", "8.1", "Lesson",
    "How do scalar, column, and table subqueries embed queries within queries?",
    [
        "A **subquery** (nested query) is a `SELECT` statement enclosed in parentheses `(...)` inside another SQL statement.",
        "Types of subqueries:",
        "- **Scalar Subquery**: Returns exactly 1 row and 1 column. Can be used anywhere a literal value is expected (e.g., `WHERE price > (SELECT AVG(price) FROM books)`).",
        "- **Column Subquery**: Returns 1 column with multiple rows. Evaluated with `IN`, `NOT IN`, `ANY`, `ALL`.",
        "- **Table Subquery (Derived Table)**: Returns multiple columns and rows. Used in the `FROM` clause with an alias.",
        "Uncorrelated subqueries execute **once**, and their result is reused by the outer query."
    ],
    "Subqueries nest SELECT queries inside expressions, WHERE clauses, and FROM derived tables.",
    "-- 1. Scalar Subquery: Books priced above the storewide average\nSELECT title, price, (SELECT ROUND(AVG(price), 2) FROM books) AS store_avg\nFROM books\nWHERE price > (SELECT AVG(price) FROM books)\nORDER BY price DESC;\n\n-- 2. Column Subquery with IN: Customers who placed at least one order\nSELECT id, name, email FROM customers WHERE id IN (SELECT customer_id FROM orders);",
    "Contrast scalar subqueries (returns 1 cell) with column subqueries used with IN (returns a list).",
    {
        "type": "sql-table",
        "data": {
            "tableName": "Books Above Store Average",
            "columns": [
                {"name": "title", "type": "TEXT"},
                {"name": "price", "type": "REAL"},
                {"name": "store_avg", "type": "REAL"}
            ],
            "rows": [
                ["Designing Data-Intensive Applications", 45.00, 37.75],
                ["System Design Interview Vol 2", 42.00, 37.75],
                ["The Pragmatic Programmer", 39.99, 37.75],
                ["System Design Interview Vol 1", 39.99, 37.75],
                ["Designing Machine Learning Systems", 38.50, 37.75]
            ],
            "note": "Filtered dynamically against storewide average (37.75)"
        }
    }
)

add_slide(
    sec8, "Correlated Subqueries", "8.2", "Lesson",
    "How do correlated subqueries evaluate dynamically per outer row?",
    [
        "Unlike independent subqueries that run once, a **correlated subquery** references columns from the outer query.",
        "The database re-evaluates the correlated subquery for **each individual row** considered by the outer query.",
        "Classic example: Finding books that are priced above the average of **their own specific category**.",
        "Also used with `EXISTS` and `NOT EXISTS` to verify relational presence without retrieving whole rows."
    ],
    "Correlated subqueries reference outer row columns and execute once per candidate row.",
    "-- Correlated Subquery: Books priced higher than their own category average\nSELECT \n  b1.id,\n  b1.title,\n  b1.category,\n  b1.price,\n  (SELECT ROUND(AVG(b2.price), 2) FROM books b2 WHERE b2.category = b1.category) AS category_avg\nFROM books b1\nWHERE b1.price > (SELECT AVG(b2.price) FROM books b2 WHERE b2.category = b1.category)\nORDER BY b1.category, b1.price DESC;",
    "Show how b1.category in the inner subquery connects back to the outer row b1.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "Category Outliers",
            "columns": [
                {"name": "id", "type": "INTEGER", "isPk": True},
                {"name": "title", "type": "TEXT"},
                {"name": "category", "type": "TEXT"},
                {"name": "price", "type": "REAL"},
                {"name": "category_avg", "type": "REAL"}
            ],
            "rows": [
                [6, "Designing Machine Learning Systems", "AI & Data", 38.50, 34.25],
                [8, "The Pragmatic Programmer", "Software Engineering", 39.99, 35.83],
                [5, "System Design Interview Vol 2", "System Design", 42.00, 41.00]
            ],
            "note": "Books exceeding their specific category's mean price"
        }
    }
)

add_slide(
    sec8, "Subqueries and CTEs Quiz", "8.3", "Quiz",
    "Module 8 Quiz: Test your grasp of nested subqueries and Common Table Expressions",
    [
        "Verify your knowledge of scalar subqueries, correlated execution, and CTE syntax.",
        "Test your understanding of the WITH clause readability benefits.",
        "Answer the 4 questions in the interactive quiz card."
    ],
    "Test your subquery optimization and CTE architecture knowledge.",
    "-- Interactive quiz slide.\n-- Answer questions in the visual panel on the left.\nSELECT 'Test your Subqueries and CTEs knowledge.' AS status;",
    "Review how CTEs eliminate deeply nested 'subquery hell' in complex queries.",
    {
        "type": "sql-quiz",
        "data": {
            "quizTitle": "Module 8: Subqueries and CTEs Quiz",
            "questions": [
                {
                    "question": "What is the key characteristic of a Correlated Subquery?",
                    "options": [
                        "It runs only once before the main query starts",
                        "It references columns from the outer query and re-evaluates for each outer row",
                        "It only returns character strings",
                        "It can only be used in DDL statements"
                    ],
                    "answer": 1,
                    "explanation": "Correlated subqueries depend on values in the outer query row, causing the engine to re-run or memoize the subquery per row."
                },
                {
                    "question": "Which SQL keyword initiates a Common Table Expression (CTE)?",
                    "options": ["WITH", "LET", "DEFINE", "DECLARE"],
                    "answer": 0,
                    "explanation": "CTEs are defined using the 'WITH' keyword: 'WITH cte_name AS (SELECT ...) SELECT * FROM cte_name;'."
                },
                {
                    "question": "What is a major advantage of using CTEs over nested derived tables?",
                    "options": [
                        "CTEs automatically delete source table rows",
                        "CTEs make queries modular, linear, and significantly more readable and maintainable",
                        "CTEs bypass all database security rules",
                        "CTEs prevent any indexing"
                    ],
                    "answer": 1,
                    "explanation": "CTEs allow developers to structure queries top-to-bottom like functions, avoiding deep indentation and repeated subquery code."
                },
                {
                    "question": "What does WITH RECURSIVE enable in SQL?",
                    "options": [
                        "Infinite loops that crash the database",
                        "Traversing recursive hierarchical data structures like employee org charts and graphs",
                        "Recursive table creation",
                        "Automatic index rebuilding"
                    ],
                    "answer": 1,
                    "explanation": "WITH RECURSIVE allows queries to reference their own output to traverse trees, hierarchies, and graphs."
                }
            ]
        }
    }
)

add_slide(
    sec8, "Common Table Expressions", "8.4", "Lesson",
    "How does the WITH clause (CTE) structure clean, modular, and readable pipelines?",
    [
        "A **Common Table Expression (CTE)** defines a temporary named result set valid only within the execution scope of a single query.",
        "Syntax: `WITH cte_name AS (SELECT ...) SELECT * FROM cte_name;`.",
        "**Advantages over nested subqueries**:",
        "- Eliminates inverted 'inside-out' readability.",
        "- Multiple CTEs can be chained together sequentially separated by commas.",
        "- Can be referenced multiple times within the outer query without duplicating code.",
        "Modern query planners optimize CTEs inline just as effectively as subqueries."
    ],
    "Use WITH cte_name AS (...) to transform deeply nested subqueries into clean top-to-bottom pipelines.",
    "-- Chained CTE pipeline: Find high-spending customers and their favorite books\nWITH customer_spend AS (\n  SELECT customer_id, SUM(total_amount) AS total_spent\n  FROM orders\n  GROUP BY customer_id\n  HAVING SUM(total_amount) > 50.00\n),\nvip_customers AS (\n  SELECT c.id, c.name, cs.total_spent\n  FROM customers c\n  JOIN customer_spend cs ON c.id = cs.customer_id\n)\nSELECT id, name, total_spent FROM vip_customers ORDER BY total_spent DESC;",
    "Demonstrate how chaining CTEs reads like an intuitive assembly line.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "CTE Pipeline Output (vip_customers)",
            "columns": [
                {"name": "id", "type": "INTEGER", "isPk": True},
                {"name": "name", "type": "TEXT"},
                {"name": "total_spent", "type": "REAL"}
            ],
            "rows": [
                [1, "Alice Smith", 197.48],
                [4, "Diana Prince", 81.99]
            ],
            "note": "Clean multi-step analytical rollup via chained CTEs"
        }
    }
)

add_slide(
    sec8, "Recursive CTEs", "8.5", "Lesson",
    "How does WITH RECURSIVE traverse hierarchical organization charts and graphs?",
    [
        "A **Recursive CTE** references itself to repeatedly expand a result set until a termination condition is reached.",
        "Structure consists of two parts joined by `UNION ALL`:",
        "1. **Anchor Member**: Initial base query that returns the root rows (e.g. CEO where `manager_id IS NULL`).",
        "2. **Recursive Member**: Joins the CTE with the underlying table to find child rows (`manager_id = parent.id`).",
        "Common use cases: Management hierarchies, category trees, parts explosion (BOM), and graph path traversal."
    ],
    "WITH RECURSIVE uses an Anchor query and a Recursive Member joined by UNION ALL to traverse hierarchies.",
    "-- Recursive CTE: Walk employee organization chart from CEO down with depth levels\nWITH RECURSIVE org_chart AS (\n  -- Anchor member: CEO (no manager)\n  SELECT id, name, department, manager_id, 0 AS hierarchy_level, name AS reporting_path\n  FROM employees\n  WHERE manager_id IS NULL\n  \n  UNION ALL\n  \n  -- Recursive member: Direct reports\n  SELECT e.id, e.name, e.department, e.manager_id, oc.hierarchy_level + 1, oc.reporting_path || ' -> ' || e.name\n  FROM employees e\n  JOIN org_chart oc ON e.manager_id = oc.id\n)\nSELECT id, name, department, hierarchy_level, reporting_path\nFROM org_chart\nORDER BY hierarchy_level, department, name;",
    "Have students observe how hierarchy_level increments by 1 at each recursive depth.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "Recursive Org Chart Hierarchy",
            "columns": [
                {"name": "id", "type": "INTEGER", "isPk": True},
                {"name": "name", "type": "TEXT"},
                {"name": "department", "type": "TEXT"},
                {"name": "hierarchy_level", "type": "INTEGER"},
                {"name": "reporting_path", "type": "TEXT"}
            ],
            "rows": [
                [1, "Sarah Connor", "Engineering", 0, "Sarah Connor"],
                [4, "Michael Scott", "Sales", 0, "Michael Scott"],
                [7, "Pam Beesly", "Marketing", 0, "Pam Beesly"],
                [2, "John Doe", "Engineering", 1, "Sarah Connor -> John Doe"],
                [3, "Jane Roe", "Engineering", 1, "Sarah Connor -> Jane Roe"],
                [5, "Jim Halpert", "Sales", 1, "Michael Scott -> Jim Halpert"],
                [6, "Dwight Schrute", "Sales", 1, "Michael Scott -> Dwight Schrute"],
                [8, "Ryan Howard", "Marketing", 1, "Pam Beesly -> Ryan Howard"]
            ],
            "note": "Full organizational tree resolved via WITH RECURSIVE"
        }
    }
)

# Challenges in Section 8
add_slide(
    sec8, "Books Above Average", "8.6", "Challenge",
    "Challenge: Identify titles priced strictly above the global catalog average",
    [
        "**Task**: Use a scalar subquery to find all books in `books` whose `price` is strictly greater than the average price of all books.",
        "Return `title`, `price`, and `category`.",
        "Order by `price` DESC."
    ],
    "Filter WHERE price > (SELECT AVG(price) FROM books) using a scalar subquery.",
    "-- WRITE YOUR SCALAR SUBQUERY HERE:\nSELECT title, price, category\nFROM books\nWHERE price > (SELECT AVG(price) FROM books)\nORDER BY price DESC;",
    "Demonstrate how the inner query evaluates to 37.75 and passes this scalar to the outer WHERE clause.",
    {
        "type": "solution"
    },
    {
        "approach": "Use a scalar subquery in the WHERE clause: WHERE price > (SELECT AVG(price) FROM books).",
        "code": "SELECT title, price, category\nFROM books\nWHERE price > (SELECT AVG(price) FROM books)\nORDER BY price DESC;",
        "timeComplexity": "O(N) table scan + O(N log N) sort",
        "spaceComplexity": "O(N)",
        "explanationPoints": [
            "`(SELECT AVG(price) FROM books)` executes once, returning $37.75.",
            "The outer WHERE filter compares each book's price against this dynamically evaluated average.",
            "If new books are added in the future, the threshold adapts automatically without hardcoding numbers."
        ]
    }
)

add_slide(
    sec8, "Latest Category Books", "8.7", "Challenge",
    "Challenge: Find the most recently published title in each category with a Correlated Subquery",
    [
        "**Task**: Find books that have the highest `published_year` within their specific `category`.",
        "Write a correlated subquery in the WHERE clause matching on `category`.",
        "Return `title`, `category`, and `published_year`.",
        "Order by `published_year` DESC, `category` ASC."
    ],
    "Use WHERE published_year = (SELECT MAX(published_year) FROM books b2 WHERE b2.category = b1.category).",
    "-- WRITE YOUR CORRELATED SUBQUERY HERE:\nSELECT b1.title, b1.category, b1.published_year\nFROM books b1\nWHERE b1.published_year = (\n  SELECT MAX(b2.published_year) \n  FROM books b2 \n  WHERE b2.category = b1.category\n)\nORDER BY b1.published_year DESC, b1.category ASC;",
    "Demonstrate how the inner subquery references b1.category from the outer loop.",
    {
        "type": "solution"
    },
    {
        "approach": "Use a correlated subquery where published_year equals the MAX published_year for that category.",
        "code": "SELECT b1.title, b1.category, b1.published_year\nFROM books b1\nWHERE b1.published_year = (\n  SELECT MAX(b2.published_year) \n  FROM books b2 \n  WHERE b2.category = b1.category\n)\nORDER BY b1.published_year DESC, b1.category ASC;",
        "timeComplexity": "O(N^2) without category index; O(N log N) with index",
        "spaceComplexity": "O(N)",
        "explanationPoints": [
            "For each outer book `b1`, the subquery calculates the maximum publication year in `b1.category`.",
            "Only books that achieve this category maximum are returned in the final result."
        ]
    }
)

add_slide(
    sec8, "Low Stock by Category", "8.8", "Challenge",
    "Challenge: Find books with inventory below their category average stock",
    [
        "**Task**: Identify books that have lower `stock` than the average stock of their own `category`.",
        "Use a correlated subquery comparing `b1.stock < (SELECT AVG(b2.stock) ...)`.",
        "Return `b1.title`, `b1.category`, `b1.stock`, and `ROUND(b2_avg, 1) AS category_avg_stock`."
    ],
    "Identify books where stock is below the category-specific average using a correlated subquery.",
    "-- WRITE YOUR CORRELATED STOCK QUERY HERE:\nSELECT \n  b1.title,\n  b1.category,\n  b1.stock,\n  (SELECT ROUND(AVG(b2.stock), 1) FROM books b2 WHERE b2.category = b1.category) AS category_avg_stock\nFROM books b1\nWHERE b1.stock < (SELECT AVG(b2.stock) FROM books b2 WHERE b2.category = b1.category)\nORDER BY b1.category, b1.stock ASC;",
    "Show how warehouse inventory replenishment flags items that underperform peer benchmarks.",
    {
        "type": "solution"
    },
    {
        "approach": "Compare b1.stock against the inner AVG(b2.stock) filtered on b2.category = b1.category.",
        "code": "SELECT \n  b1.title,\n  b1.category,\n  b1.stock,\n  (SELECT ROUND(AVG(b2.stock), 1) FROM books b2 WHERE b2.category = b1.category) AS category_avg_stock\nFROM books b1\nWHERE b1.stock < (SELECT AVG(b2.stock) FROM books b2 WHERE b2.category = b1.category)\nORDER BY b1.category, b1.stock ASC;",
        "timeComplexity": "O(N^2) unindexed",
        "spaceComplexity": "O(N)",
        "explanationPoints": [
            "The correlated subquery dynamically benchmarks stock against category peers.",
            "Items below average are flagged for immediate supplier reordering."
        ]
    }
)

add_slide(
    sec8, "Bestseller Rankings", "8.9", "Challenge",
    "Challenge: Multi-step bestseller CTE pipeline",
    [
        "**Task**: Write a CTE named `book_sales` that aggregates `order_items` by `book_id`:",
        "- Compute `SUM(quantity) AS units_sold` and `SUM(quantity * unit_price) AS total_revenue`.",
        "In the outer query, join `books` with `book_sales`.",
        "Return `books.title`, `book_sales.units_sold`, and `book_sales.total_revenue`.",
        "Order by `units_sold` DESC, `total_revenue` DESC."
    ],
    "Define a CTE aggregating order line items and join with the books catalog in the outer query.",
    "-- WRITE YOUR BESTSELLER CTE PIPELINE HERE:\nWITH book_sales AS (\n  SELECT \n    book_id,\n    SUM(quantity) AS units_sold,\n    ROUND(SUM(quantity * unit_price), 2) AS total_revenue\n  FROM order_items\n  GROUP BY book_id\n)\nSELECT \n  b.title,\n  bs.units_sold,\n  bs.total_revenue\nFROM books b\nJOIN book_sales bs ON b.id = bs.book_id\nORDER BY bs.units_sold DESC, bs.total_revenue DESC;",
    "Show how CTEs keep aggregation logic separate from presentation joining logic.",
    {
        "type": "solution"
    },
    {
        "approach": "Aggregate order_items by book_id in a WITH clause, then join with books to project titles.",
        "code": "WITH book_sales AS (\n  SELECT \n    book_id,\n    SUM(quantity) AS units_sold,\n    ROUND(SUM(quantity * unit_price), 2) AS total_revenue\n  FROM order_items\n  GROUP BY book_id\n)\nSELECT \n  b.title,\n  bs.units_sold,\n  bs.total_revenue\nFROM books b\nJOIN book_sales bs ON b.id = bs.book_id\nORDER BY bs.units_sold DESC, bs.total_revenue DESC;",
        "timeComplexity": "O(N log B)",
        "spaceComplexity": "O(B)",
        "explanationPoints": [
            "The `book_sales` CTE aggregates line items without cluttering the main query.",
            "The main query performs a simple 2-table join to bring in titles."
        ]
    }
)

add_slide(
    sec8, "New Customer Analysis", "8.10", "Challenge",
    "Challenge: Analyze purchasing velocity of newly registered customers",
    [
        "**Task**: Create a CTE `q1_cohort` containing customers who joined in `'2023'` (`joined_date LIKE '2023%'`).",
        "Join `q1_cohort` with `orders` to find their order history.",
        "Calculate total orders placed and total spend per cohort member.",
        "Include customers with 0 orders using `LEFT JOIN`."
    ],
    "Build a cohort CTE and LEFT JOIN orders to evaluate customer lifetime value.",
    "-- WRITE YOUR COHORT ANALYSIS CTE HERE:\nWITH q1_cohort AS (\n  SELECT id, name, country, joined_date\n  FROM customers\n  WHERE joined_date LIKE '2023%'\n)\nSELECT \n  c.name,\n  c.country,\n  COUNT(o.id) AS total_orders,\n  COALESCE(ROUND(SUM(o.total_amount), 2), 0.00) AS total_spend\nFROM q1_cohort c\nLEFT JOIN orders o ON c.id = o.customer_id\nGROUP BY c.id, c.name, c.country\nORDER BY total_spend DESC;",
    "Demonstrate how LEFT JOIN with COALESCE ensures customers with zero spend display $0.00 instead of NULL.",
    {
        "type": "solution"
    },
    {
        "approach": "Isolate the 2023 cohort in a CTE, LEFT JOIN orders, and aggregate spend with COALESCE fallback.",
        "code": "WITH q1_cohort AS (\n  SELECT id, name, country, joined_date\n  FROM customers\n  WHERE joined_date LIKE '2023%'\n)\nSELECT \n  c.name,\n  c.country,\n  COUNT(o.id) AS total_orders,\n  COALESCE(ROUND(SUM(o.total_amount), 2), 0.00) AS total_spend\nFROM q1_cohort c\nLEFT JOIN orders o ON c.id = o.customer_id\nGROUP BY c.id, c.name, c.country\nORDER BY total_spend DESC;",
        "timeComplexity": "O(N log C)",
        "spaceComplexity": "O(C)",
        "explanationPoints": [
            "`WHERE joined_date LIKE '2023%'` filters the annual cohort.",
            "`LEFT JOIN` preserves cohort members who have not yet converted.",
            "`COALESCE(..., 0.00)` handles non-buyers gracefully."
        ]
    }
)

add_slide(
    sec8, "Daily Sales Report", "8.11", "Challenge",
    "Challenge: Multi-CTE daily financial audit pipeline",
    [
        "**Task**: Build a 2-CTE pipeline:",
        "1. `daily_orders`: Aggregate `orders` by `order_date`, counting orders and summing `total_amount AS daily_revenue`.",
        "2. `daily_metrics`: Query `daily_orders` and calculate the storewide average daily revenue as a benchmark.",
        "Return `order_date`, `daily_revenue`, and whether the day was `'Above Average'` or `'Below Average'`."
    ],
    "Chain multiple CTEs together to compute daily benchmarks against storewide averages.",
    "-- WRITE YOUR MULTI-CTE PIPELINE HERE:\nWITH daily_orders AS (\n  SELECT \n    order_date,\n    COUNT(*) AS order_count,\n    ROUND(SUM(total_amount), 2) AS daily_revenue\n  FROM orders\n  GROUP BY order_date\n),\nbenchmark AS (\n  SELECT AVG(daily_revenue) AS avg_daily_benchmark FROM daily_orders\n)\nSELECT \n  d.order_date,\n  d.daily_revenue,\n  CASE \n    WHEN d.daily_revenue >= b.avg_daily_benchmark THEN 'Above Average'\n    ELSE 'Below Average'\n  END AS performance_vs_benchmark\nFROM daily_orders d\nCROSS JOIN benchmark b\nORDER BY d.order_date ASC;",
    "Demonstrate using CROSS JOIN with a 1-row benchmark CTE to expose scalar constants to every row.",
    {
        "type": "solution"
    },
    {
        "approach": "Chain daily_orders and benchmark CTEs, cross-join the 1-row benchmark, and evaluate CASE performance.",
        "code": "WITH daily_orders AS (\n  SELECT \n    order_date,\n    COUNT(*) AS order_count,\n    ROUND(SUM(total_amount), 2) AS daily_revenue\n  FROM orders\n  GROUP BY order_date\n),\nbenchmark AS (\n  SELECT AVG(daily_revenue) AS avg_daily_benchmark FROM daily_orders\n)\nSELECT \n  d.order_date,\n  d.daily_revenue,\n  CASE \n    WHEN d.daily_revenue >= b.avg_daily_benchmark THEN 'Above Average'\n    ELSE 'Below Average'\n  END AS performance_vs_benchmark\nFROM daily_orders d\nCROSS JOIN benchmark b\nORDER BY d.order_date ASC;",
        "timeComplexity": "O(N log D)",
        "spaceComplexity": "O(D)",
        "explanationPoints": [
            "Chaining CTEs separated by commas builds modular stages.",
            "`CROSS JOIN benchmark b` brings the storewide average into every daily row.",
            "CASE labels commercial success relative to average baseline."
        ]
    }
)

print(f"Generated Section 8 (Current total slides: {len(slides)})")

# ==========================================
# SECTION 9: Window Functions (13 slides)
# ==========================================
sec9 = "9. Window Functions"

add_slide(
    sec9, "What are they?", "9.1", "Lesson",
    "How do Window Functions calculate metrics across row sets without collapsing rows?",
    [
        "Unlike `GROUP BY` which collapses multiple rows into a single summary row, **Window Functions** compute aggregate values across a related window of rows while **preserving every individual row** in the output.",
        "Syntax: `FUNCTION() OVER (PARTITION BY ... ORDER BY ...)`.",
        "Crucial distinction:",
        "- `GROUP BY`: 100 rows in -> 5 summary rows out.",
        "- `WINDOW FUNCTION`: 100 rows in -> 100 original rows out + 1 new column containing the window calculation.",
        "Window functions execute **after** WHERE, GROUP BY, and HAVING, just before final ORDER BY."
    ],
    "Window functions compute aggregate metrics across related row sets without collapsing individual records.",
    "-- Compare each book's price against the overall catalog average\nSELECT \n  id,\n  title,\n  price,\n  ROUND(AVG(price) OVER (), 2) AS catalog_avg_price,\n  ROUND(price - AVG(price) OVER (), 2) AS diff_from_catalog_avg\nFROM books\nORDER BY price DESC;",
    "Emphasize the 'OVER ()' clause: an empty OVER() considers the entire result set as the window.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "Window Function Output (No Group Collapse)",
            "columns": [
                {"name": "id", "type": "INTEGER", "isPk": True},
                {"name": "title", "type": "TEXT"},
                {"name": "price", "type": "REAL"},
                {"name": "catalog_avg_price", "type": "REAL"},
                {"name": "diff_from_catalog_avg", "type": "REAL"}
            ],
            "rows": [
                [2, "Designing Data-Intensive Applications", 45.00, 37.75, 7.25],
                [5, "System Design Interview Vol 2", 42.00, 37.75, 4.25],
                [4, "System Design Interview Vol 1", 39.99, 37.75, 2.24],
                [8, "The Pragmatic Programmer", 39.99, 37.75, 2.24],
                [6, "Designing Machine Learning Systems", 38.50, 37.75, 0.75]
            ],
            "note": "Every book record retained with window calculation appended"
        }
    }
)

add_slide(
    sec9, "OVER and PARTITION BY", "9.2", "Lesson",
    "How does PARTITION BY divide window calculations into isolated departmental groups?",
    [
        "The **`PARTITION BY column`** sub-clause divides the result set into distinct partitions (groups).",
        "The window function calculation restarts fresh at the boundary of each partition.",
        "Example: `AVG(price) OVER (PARTITION BY category)` calculates the average price for **that specific book's category**, stamped onto every row in that category.",
        "You can partition by multiple columns: `OVER (PARTITION BY country, city)`."
    ],
    "PARTITION BY resets the window calculation at the boundary of each categorical group.",
    "-- Calculate category averages alongside individual book details\nSELECT \n  title,\n  category,\n  price,\n  ROUND(AVG(price) OVER (PARTITION BY category), 2) AS category_avg_price,\n  ROUND(price - AVG(price) OVER (PARTITION BY category), 2) AS diff_from_category_avg\nFROM books\nORDER BY category, price DESC;",
    "Demonstrate how Software Engineering and System Design have their own distinct partition averages.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "PARTITION BY category Output",
            "columns": [
                {"name": "title", "type": "TEXT"},
                {"name": "category", "type": "TEXT"},
                {"name": "price", "type": "REAL"},
                {"name": "category_avg_price", "type": "REAL"},
                {"name": "diff_from_category_avg", "type": "REAL"}
            ],
            "rows": [
                ["Designing Machine Learning Systems", "AI & Data", 38.50, 34.25, 4.25],
                ["Machine Learning Yearning", "AI & Data", 29.99, 34.25, -4.26],
                ["Designing Data-Intensive Applications", "Distributed Systems", 45.00, 45.00, 0.00],
                ["The Pragmatic Programmer", "Software Engineering", 39.99, 35.83, 4.16],
                ["Clean Architecture", "Software Engineering", 35.00, 35.83, -0.83],
                ["Clean Code", "Software Engineering", 32.50, 35.83, -3.33]
            ],
            "note": "Calculation resets independently for each category"
        }
    }
)

add_slide(
    sec9, "Use of ORDER BY", "9.3", "Lesson",
    "How does ORDER BY inside OVER() compute cumulative running totals and moving balances?",
    [
        "Adding **`ORDER BY column`** inside the `OVER(...)` clause changes the evaluation frame from the whole partition to a **cumulative running total**.",
        "By default, `OVER (ORDER BY ...)` evaluates rows from the start of the partition up to the **current row**.",
        "Example: `SUM(total_amount) OVER (ORDER BY order_date)` computes the running cash intake of the company over time.",
        "Essential for bank balances, cumulative signup counters, and pacing trackers."
    ],
    "Adding ORDER BY inside OVER() turns aggregate functions into cumulative running totals.",
    "-- Calculate cumulative revenue over time across orders\nSELECT \n  id AS order_id,\n  order_date,\n  total_amount,\n  ROUND(SUM(total_amount) OVER (ORDER BY order_date, id), 2) AS running_cumulative_revenue,\n  COUNT(*) OVER (ORDER BY order_date, id) AS cumulative_order_count\nFROM orders\nORDER BY order_date, id;",
    "Trace row-by-row how running_cumulative_revenue accumulates each transaction amount.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "Cumulative Running Totals",
            "columns": [
                {"name": "order_id", "type": "INTEGER", "isPk": True},
                {"name": "order_date", "type": "TEXT"},
                {"name": "total_amount", "type": "REAL"},
                {"name": "running_cumulative_revenue", "type": "REAL"},
                {"name": "cumulative_order_count", "type": "INTEGER"}
            ],
            "rows": [
                [1, "2024-01-10", 77.50, 77.50, 1],
                [2, "2024-01-14", 45.00, 122.50, 2],
                [3, "2024-02-01", 119.98, 242.48, 3],
                [4, "2024-02-18", 29.99, 272.47, 4],
                [5, "2024-03-05", 81.99, 354.46, 5],
                [6, "2024-03-12", 38.50, 392.96, 6]
            ],
            "note": "Revenue steadily accumulates from 77.50 to 392.96"
        }
    }
)

add_slide(
    sec9, "Window Functions Quiz", "9.4", "Quiz",
    "Module 9 Quiz: Test your grasp of OVER, PARTITION BY, and Window Framing",
    [
        "Verify your understanding of window functions vs GROUP BY.",
        "Test running total evaluation and ranking behaviors.",
        "Answer the 4 questions in the interactive quiz card."
    ],
    "Test your advanced window function knowledge.",
    "-- Interactive quiz slide.\n-- Answer questions in the visual panel on the left.\nSELECT 'Test your Window Functions knowledge.' AS status;",
    "Review the difference between ROW_NUMBER, RANK, and DENSE_RANK when ties occur.",
    {
        "type": "sql-quiz",
        "data": {
            "quizTitle": "Module 9: Window Functions Quiz",
            "questions": [
                {
                    "question": "What is the primary difference between a Window Function and a GROUP BY aggregation?",
                    "options": [
                        "Window functions can only run on integers",
                        "GROUP BY collapses rows into summary rows; Window Functions preserve every original row in the output",
                        "Window functions cannot be used with ORDER BY",
                        "GROUP BY does not support SUM"
                    ],
                    "answer": 1,
                    "explanation": "Window functions retain the full granularity of input rows while stamping the window calculation alongside."
                },
                {
                    "question": "If two rows tie for 1st place, what will DENSE_RANK() assign to the next row?",
                    "options": ["2", "3", "NULL", "1.5"],
                    "answer": 0,
                    "explanation": "DENSE_RANK() does not skip rank numbers after ties (1, 1, 2). Regular RANK() skips numbers (1, 1, 3)."
                },
                {
                    "question": "Which sub-clause inside OVER() defines the grouping boundary where calculations reset?",
                    "options": ["GROUP BY", "PARTITION BY", "SPLIT BY", "DIVIDE BY"],
                    "answer": 1,
                    "explanation": "PARTITION BY resets the window calculation at the boundary of each partition."
                },
                {
                    "question": "What does LAG(price, 1) OVER (ORDER BY date) return?",
                    "options": [
                        "The price from the subsequent row (future)",
                        "The price from the immediately preceding row (past)",
                        "The lowest price in the table",
                        "The average price"
                    ],
                    "answer": 1,
                    "explanation": "LAG() accesses data from a previous row at a specified physical offset (past row)."
                }
            ]
        }
    }
)

add_slide(
    sec9, "Ranking Functions", "9.5", "Lesson",
    "How do ROW_NUMBER(), RANK(), DENSE_RANK(), and NTILE() score order and ties?",
    [
        "**`ROW_NUMBER()`**: Assigns a unique sequential integer (1, 2, 3, ...) with zero duplicate rank values, even during ties.",
        "**`RANK()`**: Assigns equal ranks to ties, but **skips** subsequent ranks (e.g. 1, 2, 2, 4).",
        "**`DENSE_RANK()`**: Assigns equal ranks to ties **without gaps** in ranking numbers (e.g. 1, 2, 2, 3).",
        "**`NTILE(n)`**: Divides rows into `n` equal quartiles/buckets (e.g. `NTILE(4)` for 25th, 50th, 75th percentiles)."
    ],
    "ROW_NUMBER has no duplicate ties; RANK skips numbers after ties; DENSE_RANK has no gaps.",
    "-- Compare ROW_NUMBER vs RANK vs DENSE_RANK on book ratings\nSELECT \n  title,\n  rating,\n  price,\n  ROW_NUMBER() OVER (ORDER BY rating DESC) AS row_num,\n  RANK() OVER (ORDER BY rating DESC) AS standard_rank,\n  DENSE_RANK() OVER (ORDER BY rating DESC) AS dense_rank,\n  NTILE(3) OVER (ORDER BY price DESC) AS price_tercile\nFROM books\nORDER BY rating DESC, title;",
    "Point out how DDIA, System Design Vol 2, and Pragmatic Programmer all tie at 4.9 rating.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "Ranking Comparison on Ties",
            "columns": [
                {"name": "title", "type": "TEXT"},
                {"name": "rating", "type": "REAL"},
                {"name": "row_num", "type": "INTEGER"},
                {"name": "standard_rank", "type": "INTEGER"},
                {"name": "dense_rank", "type": "INTEGER"}
            ],
            "rows": [
                ["Designing Data-Intensive Applications", 4.9, 1, 1, 1],
                ["System Design Interview Vol 2", 4.9, 2, 1, 1],
                ["The Pragmatic Programmer", 4.9, 3, 1, 1],
                ["Machine Learning Yearning", 4.8, 4, 4, 2],
                ["System Design Interview Vol 1", 4.8, 5, 4, 2],
                ["Clean Code", 4.7, 6, 6, 3]
            ],
            "note": "Ties at rank 1 produce rank 4 in RANK(), but rank 2 in DENSE_RANK()"
        }
    }
)

add_slide(
    sec9, "Window Frames", "9.6", "Lesson",
    "How does the ROWS BETWEEN clause define sliding windows for moving averages?",
    [
        "A **Window Frame** defines the precise subset of rows around the current row used for the calculation.",
        "Syntax: `ROWS BETWEEN lower_bound AND upper_bound`.",
        "Frame boundaries:",
        "- `UNBOUNDED PRECEDING`: From the beginning of the partition.",
        "- `n PRECEDING`: Exactly `n` rows before current.",
        "- `CURRENT ROW`: The row being processed.",
        "- `n FOLLOWING`: Exactly `n` rows after current.",
        "- `UNBOUNDED FOLLOWING`: To the very end of the partition.",
        "Standard 3-day moving average: `ROWS BETWEEN 2 PRECEDING AND CURRENT ROW`."
    ],
    "Use ROWS BETWEEN 2 PRECEDING AND CURRENT ROW to smooth financial volatility with a 3-point moving average.",
    "-- Calculate a 3-transaction moving average on orders\nSELECT \n  id AS order_id,\n  order_date,\n  total_amount,\n  ROUND(AVG(total_amount) OVER (\n    ORDER BY order_date, id\n    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\n  ), 2) AS moving_avg_last_3_orders\nFROM orders\nORDER BY order_date, id;",
    "Demonstrate how moving averages smooth out spikes and dips in financial charts.",
    {
        "type": "sql-table",
        "data": {
            "tableName": "3-Order Moving Average",
            "columns": [
                {"name": "order_id", "type": "INTEGER", "isPk": True},
                {"name": "order_date", "type": "TEXT"},
                {"name": "total_amount", "type": "REAL"},
                {"name": "moving_avg_last_3_orders", "type": "REAL"}
            ],
            "rows": [
                [1, "2024-01-10", 77.50, 77.50],
                [2, "2024-01-14", 45.00, 61.25],
                [3, "2024-02-01", 119.98, 80.83],
                [4, "2024-02-18", 29.99, 64.99],
                [5, "2024-03-05", 81.99, 77.32]
            ],
            "note": "Row 3 average is (77.50 + 45.00 + 119.98) / 3 = 80.83"
        }
    }
)

# Challenges in Section 9
add_slide(
    sec9, "Basic Sales Metrics", "9.7", "Challenge",
    "Challenge: Running total and percentage of total revenue",
    [
        "**Task**: In the `orders` table, calculate two window metrics simultaneously:",
        "1. `running_total`: Cumulative sum of `total_amount` ordered by `order_date`.",
        "2. `pct_of_total`: What percentage this individual order contributes to the storewide total revenue (`total_amount / SUM(total_amount) OVER () * 100`).",
        "Return `id AS order_id`, `order_date`, `total_amount`, `running_total`, and `ROUND(pct_of_total, 2)`."
    ],
    "Combine running SUM(total_amount) OVER (ORDER BY date) with global SUM(total_amount) OVER ().",
    "-- WRITE YOUR WINDOW QUERY HERE:\nSELECT \n  id AS order_id,\n  order_date,\n  total_amount,\n  ROUND(SUM(total_amount) OVER (ORDER BY order_date, id), 2) AS running_total,\n  ROUND((total_amount * 100.0) / SUM(total_amount) OVER (), 2) AS pct_of_total\nFROM orders\nORDER BY order_date, id;",
    "Show how mixing ordered window frames with unbounded window frames produces executive ratios.",
    {
        "type": "solution"
    },
    {
        "approach": "Use SUM(...) OVER (ORDER BY order_date, id) for the running total, and divide by SUM(...) OVER () for percentage of whole.",
        "code": "SELECT \n  id AS order_id,\n  order_date,\n  total_amount,\n  ROUND(SUM(total_amount) OVER (ORDER BY order_date, id), 2) AS running_total,\n  ROUND((total_amount * 100.0) / SUM(total_amount) OVER (), 2) AS pct_of_total\nFROM orders\nORDER BY order_date, id;",
        "timeComplexity": "O(N log N)",
        "spaceComplexity": "O(N)",
        "explanationPoints": [
            "`SUM(total_amount) OVER (ORDER BY ...)` builds the cumulative line graph.",
            "`SUM(total_amount) OVER ()` calculates the grand total denominator without needing a separate subquery.",
            "Multiplying by `100.0` ensures floating-point arithmetic."
        ]
    }
)

add_slide(
    sec9, "Bestseller Comparison", "9.8", "Challenge",
    "Challenge: Compare each book's price against its category average",
    [
        "**Task**: In `books`, calculate `ROUND(AVG(price) OVER (PARTITION BY category), 2) AS category_avg`.",
        "Compute the dollar variance: `ROUND(price - AVG(price) OVER (PARTITION BY category), 2) AS price_delta`.",
        "Return `title`, `category`, `price`, `category_avg`, and `price_delta`.",
        "Order by `category`, `price_delta` DESC."
    ],
    "Use PARTITION BY category to compute localized price variances.",
    "-- WRITE YOUR CATEGORY BENCHMARK QUERY HERE:\nSELECT \n  title,\n  category,\n  price,\n  ROUND(AVG(price) OVER (PARTITION BY category), 2) AS category_avg,\n  ROUND(price - AVG(price) OVER (PARTITION BY category), 2) AS price_delta\nFROM books\nORDER BY category, price_delta DESC;",
    "Demonstrate how PARTITION BY simplifies comparison queries that used to require complex self-joins.",
    {
        "type": "solution"
    },
    {
        "approach": "Partition by category and compute category average and row-level delta.",
        "code": "SELECT \n  title,\n  category,\n  price,\n  ROUND(AVG(price) OVER (PARTITION BY category), 2) AS category_avg,\n  ROUND(price - AVG(price) OVER (PARTITION BY category), 2) AS price_delta\nFROM books\nORDER BY category, price_delta DESC;",
        "timeComplexity": "O(N log N)",
        "spaceComplexity": "O(N)",
        "explanationPoints": [
            "`PARTITION BY category` guarantees each book is judged only against direct genre peers.",
            "`price - AVG(...) OVER (...)` instantly flags overpriced or bargain items."
        ]
    }
)

add_slide(
    sec9, "Author Category Sales", "9.9", "Challenge",
    "Challenge: Rank books within their specific genre by critical rating",
    [
        "**Task**: Use `DENSE_RANK()` to rank books **within each category** based on `rating` descending.",
        "Syntax hint: `DENSE_RANK() OVER (PARTITION BY category ORDER BY rating DESC)`.",
        "Return `category`, `DENSE_RANK() OVER (...) AS category_rank`, `title`, and `rating`.",
        "Order by `category` ASC, `category_rank` ASC."
    ],
    "Partition by category and order by rating DESC inside DENSE_RANK() for genre leaderboards.",
    "-- WRITE YOUR GENRE LEADERBOARD QUERY HERE:\nSELECT \n  category,\n  DENSE_RANK() OVER (PARTITION BY category ORDER BY rating DESC) AS category_rank,\n  title,\n  rating\nFROM books\nORDER BY category ASC, category_rank ASC;",
    "Show how frontend leaderboards for 'Top Books in System Design' are generated with this single window call.",
    {
        "type": "solution"
    },
    {
        "approach": "Use DENSE_RANK() with PARTITION BY category and ORDER BY rating DESC.",
        "code": "SELECT \n  category,\n  DENSE_RANK() OVER (PARTITION BY category ORDER BY rating DESC) AS category_rank,\n  title,\n  rating\nFROM books\nORDER BY category ASC, category_rank ASC;",
        "timeComplexity": "O(N log N)",
        "spaceComplexity": "O(N)",
        "explanationPoints": [
            "`PARTITION BY category` resets the rank number back to 1 for every new genre.",
            "`ORDER BY rating DESC` rewards the highest rated titles with rank 1."
        ]
    }
)

add_slide(
    sec9, "Top Authors", "9.10", "Challenge",
    "Challenge: Global author leaderboard by total order volume",
    [
        "**Task**: Build a CTE `author_sales` joining `authors`, `books`, and `order_items` to sum total revenue per author.",
        "In the outer query, use `DENSE_RANK() OVER (ORDER BY total_revenue DESC) AS sales_rank`.",
        "Return `sales_rank`, `author_name`, `country`, and `total_revenue`."
    ],
    "Aggregate author sales in a CTE, then rank authors using DENSE_RANK() OVER (ORDER BY revenue DESC).",
    "-- WRITE YOUR AUTHOR RANKING QUERY HERE:\nWITH author_sales AS (\n  SELECT \n    a.name AS author_name,\n    a.country,\n    ROUND(SUM(oi.quantity * oi.unit_price), 2) AS total_revenue\n  FROM authors a\n  JOIN books b ON a.id = b.author_id\n  JOIN order_items oi ON b.id = oi.book_id\n  GROUP BY a.id, a.name, a.country\n)\nSELECT \n  DENSE_RANK() OVER (ORDER BY total_revenue DESC) AS sales_rank,\n  author_name,\n  country,\n  total_revenue\nFROM author_sales\nORDER BY sales_rank ASC;",
    "Demonstrate how window ranking functions combine gracefully on top of aggregate CTEs.",
    {
        "type": "solution"
    },
    {
        "approach": "Aggregate revenue by author in a CTE, then apply DENSE_RANK() OVER (ORDER BY total_revenue DESC).",
        "code": "WITH author_sales AS (\n  SELECT \n    a.name AS author_name,\n    a.country,\n    ROUND(SUM(oi.quantity * oi.unit_price), 2) AS total_revenue\n  FROM authors a\n  JOIN books b ON a.id = b.author_id\n  JOIN order_items oi ON b.id = oi.book_id\n  GROUP BY a.id, a.name, a.country\n)\nSELECT \n  DENSE_RANK() OVER (ORDER BY total_revenue DESC) AS sales_rank,\n  author_name,\n  country,\n  total_revenue\nFROM author_sales\nORDER BY sales_rank ASC;",
        "timeComplexity": "O(N log A)",
        "spaceComplexity": "O(A)",
        "explanationPoints": [
            "The CTE summarizes sales revenue per creator.",
            "`DENSE_RANK()` assigns gold, silver, and bronze rankings without rank gaps."
        ]
    }
)

add_slide(
    sec9, "Price Tier Rankings", "9.11", "Challenge",
    "Challenge: Segment catalog prices into 4 economic quartiles with NTILE(4)",
    [
        "**Task**: In `books`, use `NTILE(4) OVER (ORDER BY price ASC) AS price_quartile` to divide titles into 4 price buckets.",
        "Bucket 1 = Budget; Bucket 4 = Premium.",
        "Return `id`, `title`, `price`, and `price_quartile`.",
        "Order by `price_quartile` ASC, `price` ASC."
    ],
    "Use NTILE(4) OVER (ORDER BY price ASC) to distribute items evenly across 4 statistical quartiles.",
    "-- WRITE YOUR QUARTILE SEGMENTATION QUERY HERE:\nSELECT \n  id,\n  title,\n  price,\n  NTILE(4) OVER (ORDER BY price ASC) AS price_quartile\nFROM books\nORDER BY price_quartile ASC, price ASC;",
    "Show how marketing analysts use NTILE(10) (deciles) or NTILE(100) (percentiles) for customer RFM segmentation.",
    {
        "type": "solution"
    },
    {
        "approach": "Apply NTILE(4) OVER (ORDER BY price ASC) to evenly divide catalog rows into 4 quartile buckets.",
        "code": "SELECT \n  id,\n  title,\n  price,\n  NTILE(4) OVER (ORDER BY price ASC) AS price_quartile\nFROM books\nORDER BY price_quartile ASC, price ASC;",
        "timeComplexity": "O(N log N)",
        "spaceComplexity": "O(N)",
        "explanationPoints": [
            "`NTILE(4)` partitions the 8 books into 4 groups of 2 books each.",
            "Group 1 contains the 2 cheapest books ($29.99, $32.50); Group 4 contains the 2 most expensive ($42.00, $45.00)."
        ]
    }
)

add_slide(
    sec9, "Month-over-Month Sales", "9.12", "Challenge",
    "Challenge: Calculate monthly revenue growth velocity with LAG()",
    [
        "**Task**: In a CTE, aggregate `orders` by month: `STRFTIME('%Y-%m', order_date) AS month` and `SUM(total_amount) AS revenue`.",
        "In the outer query, use `LAG(revenue, 1) OVER (ORDER BY month) AS prior_month_revenue`.",
        "Calculate the month-over-month growth delta: `ROUND(revenue - LAG(revenue, 1) OVER (ORDER BY month), 2) AS mom_growth`."
    ],
    "Use LAG(revenue, 1) OVER (ORDER BY month) to calculate month-over-month financial trends.",
    "-- WRITE YOUR MOM GROWTH QUERY HERE:\nWITH monthly_rev AS (\n  SELECT \n    STRFTIME('%Y-%m', order_date) AS month,\n    ROUND(SUM(total_amount), 2) AS revenue\n  FROM orders\n  GROUP BY month\n)\nSELECT \n  month,\n  revenue,\n  LAG(revenue, 1) OVER (ORDER BY month) AS prior_month_revenue,\n  ROUND(revenue - LAG(revenue, 1) OVER (ORDER BY month), 2) AS mom_growth\nFROM monthly_rev\nORDER BY month ASC;",
    "Show how LAG() allows financial queries to look back 1 period without requiring self-joins.",
    {
        "type": "solution"
    },
    {
        "approach": "Group by month in a CTE, then use LAG(revenue, 1) OVER (ORDER BY month) in the outer query.",
        "code": "WITH monthly_rev AS (\n  SELECT \n    STRFTIME('%Y-%m', order_date) AS month,\n    ROUND(SUM(total_amount), 2) AS revenue\n  FROM orders\n  GROUP BY month\n)\nSELECT \n  month,\n  revenue,\n  LAG(revenue, 1) OVER (ORDER BY month) AS prior_month_revenue,\n  ROUND(revenue - LAG(revenue, 1) OVER (ORDER BY month), 2) AS mom_growth\nFROM monthly_rev\nORDER BY month ASC;",
        "timeComplexity": "O(M log M) where M is months",
        "spaceComplexity": "O(M)",
        "explanationPoints": [
            "`LAG(revenue, 1)` fetches the preceding month's revenue figure into the current row.",
            "For the first month (January), prior_month_revenue is NULL because no previous history exists.",
            "Subtraction computes the raw financial growth delta."
        ]
    }
)

add_slide(
    sec9, "Price Range Analysis", "9.13", "Challenge",
    "Challenge: Analyze price step increments between catalog neighbors with LEAD()",
    [
        "**Task**: In `books`, sort books by `price` ascending.",
        "Use `LEAD(price, 1) OVER (ORDER BY price ASC) AS next_higher_price`.",
        "Compute the price step to the next book: `ROUND(LEAD(price, 1) OVER (ORDER BY price ASC) - price, 2) AS price_step`.",
        "Return `title`, `price`, `next_higher_price`, and `price_step`."
    ],
    "Use LEAD(price, 1) OVER (ORDER BY price ASC) to inspect upcoming catalog price increments.",
    "-- WRITE YOUR LEAD QUERY HERE:\nSELECT \n  title,\n  price,\n  LEAD(price, 1) OVER (ORDER BY price ASC) AS next_higher_price,\n  ROUND(LEAD(price, 1) OVER (ORDER BY price ASC) - price, 2) AS price_step\nFROM books\nORDER BY price ASC;",
    "Demonstrate how LEAD looks ahead into the future row while LAG looks back into the past row.",
    {
        "type": "solution"
    },
    {
        "approach": "Use LEAD(price, 1) OVER (ORDER BY price ASC) to peek at the subsequent higher priced item.",
        "code": "SELECT \n  title,\n  price,\n  LEAD(price, 1) OVER (ORDER BY price ASC) AS next_higher_price,\n  ROUND(LEAD(price, 1) OVER (ORDER BY price ASC) - price, 2) AS price_step\nFROM books\nORDER BY price ASC;",
        "timeComplexity": "O(N log N)",
        "spaceComplexity": "O(N)",
        "explanationPoints": [
            "`LEAD(price, 1)` pulls the next higher book price into the current row.",
            "Subtracting `price` reveals the pricing gap between consecutive tiers.",
            "The most expensive book ($45.00) receives NULL for next_higher_price as it is the ceiling."
        ]
    }
)

# Output final slides.json
output_path = os.path.join(target_dir, "slides.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump({"course": "sql-mastery", "slides": slides}, f, indent=2)

print(f"SUCCESS: Generated {len(slides)} total slides in {output_path}")
