import initSqlJs, { Database } from 'sql.js'

let dbInstance: Database | null = null
let sqlPromise: Promise<any> | null = null

export const SEED_SQL = `
CREATE TABLE IF NOT EXISTS authors (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT,
  tier TEXT
);

CREATE TABLE IF NOT EXISTS publishers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT,
  revenue REAL
);

CREATE TABLE IF NOT EXISTS books (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  author_id INTEGER,
  category TEXT,
  price REAL,
  stock INTEGER,
  published_year INTEGER,
  rating REAL,
  FOREIGN KEY (author_id) REFERENCES authors(id)
);

CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  country TEXT,
  referrer_id INTEGER,
  joined_date TEXT
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  order_date TEXT,
  total_amount REAL,
  status TEXT,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY,
  order_id INTEGER,
  book_id INTEGER,
  quantity INTEGER,
  unit_price REAL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (book_id) REFERENCES books(id)
);

CREATE TABLE IF NOT EXISTS employees (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT,
  salary REAL,
  manager_id INTEGER,
  hire_date TEXT
);

-- Seed Initial Data
INSERT INTO authors VALUES (1, 'Robert C. Martin', 'USA', 'Tier 1');
INSERT INTO authors VALUES (2, 'Martin Kleppmann', 'UK', 'Tier 1');
INSERT INTO authors VALUES (3, 'Andrew Ng', 'USA', 'Tier 1');
INSERT INTO authors VALUES (4, 'Alex Xu', 'USA', 'Tier 2');
INSERT INTO authors VALUES (5, 'Chip Huyen', 'Vietnam', 'Tier 2');

INSERT INTO publishers VALUES (1, 'O Reilly Media', 'Sebastopol', 45000000);
INSERT INTO publishers VALUES (2, 'Prentice Hall', 'Boston', 32000000);
INSERT INTO publishers VALUES (3, 'ByteByteGo Press', 'San Francisco', 15000000);

INSERT INTO books VALUES (1, 'Clean Code', 1, 'Software Engineering', 32.50, 45, 2008, 4.7);
INSERT INTO books VALUES (2, 'Designing Data-Intensive Applications', 2, 'Distributed Systems', 45.00, 80, 2017, 4.9);
INSERT INTO books VALUES (3, 'Machine Learning Yearning', 3, 'AI & Data', 29.99, 30, 2018, 4.8);
INSERT INTO books VALUES (4, 'System Design Interview Vol 1', 4, 'System Design', 39.99, 120, 2020, 4.8);
INSERT INTO books VALUES (5, 'System Design Interview Vol 2', 4, 'System Design', 42.00, 95, 2022, 4.9);
INSERT INTO books VALUES (6, 'Designing Machine Learning Systems', 5, 'AI & Data', 38.50, 60, 2022, 4.7);
INSERT INTO books VALUES (7, 'Clean Architecture', 1, 'Software Engineering', 35.00, 50, 2017, 4.6);
INSERT INTO books VALUES (8, 'The Pragmatic Programmer', 1, 'Software Engineering', 39.99, 40, 2019, 4.9);

INSERT INTO customers VALUES (1, 'Alice Smith', 'alice@tech.io', 'USA', NULL, '2023-01-15');
INSERT INTO customers VALUES (2, 'Bob Johnson', 'bob@developer.org', 'Canada', 1, '2023-03-22');
INSERT INTO customers VALUES (3, 'Charlie Brown', 'charlie@ai.com', 'UK', 1, '2023-05-10');
INSERT INTO customers VALUES (4, 'Diana Prince', 'diana@code.net', 'Germany', 2, '2023-07-04');
INSERT INTO customers VALUES (5, 'Ethan Hunt', 'ethan@covert.org', 'USA', NULL, '2023-09-19');
INSERT INTO customers VALUES (6, 'Fiona Gallagher', 'fiona@southside.edu', 'Ireland', 3, '2023-11-01');

INSERT INTO orders VALUES (1, 1, '2024-01-10', 77.50, 'COMPLETED');
INSERT INTO orders VALUES (2, 2, '2024-01-14', 45.00, 'COMPLETED');
INSERT INTO orders VALUES (3, 1, '2024-02-01', 119.98, 'COMPLETED');
INSERT INTO orders VALUES (4, 3, '2024-02-18', 29.99, 'COMPLETED');
INSERT INTO orders VALUES (5, 4, '2024-03-05', 81.99, 'SHIPPED');
INSERT INTO orders VALUES (6, 5, '2024-03-12', 38.50, 'PROCESSING');

INSERT INTO order_items VALUES (1, 1, 1, 1, 32.50);
INSERT INTO order_items VALUES (2, 1, 2, 1, 45.00);
INSERT INTO order_items VALUES (3, 2, 2, 1, 45.00);
INSERT INTO order_items VALUES (4, 3, 4, 1, 39.99);
INSERT INTO order_items VALUES (5, 3, 5, 1, 42.00);
INSERT INTO order_items VALUES (6, 3, 6, 1, 38.50);
INSERT INTO order_items VALUES (7, 4, 3, 1, 29.99);
INSERT INTO order_items VALUES (8, 5, 4, 1, 39.99);
INSERT INTO order_items VALUES (9, 5, 5, 1, 42.00);
INSERT INTO order_items VALUES (10, 6, 6, 1, 38.50);

INSERT INTO employees VALUES (1, 'Sarah Connor', 'Engineering', 145000, NULL, '2020-01-10');
INSERT INTO employees VALUES (2, 'John Doe', 'Engineering', 115000, 1, '2021-04-15');
INSERT INTO employees VALUES (3, 'Jane Roe', 'Engineering', 105000, 1, '2022-06-01');
INSERT INTO employees VALUES (4, 'Michael Scott', 'Sales', 95000, NULL, '2019-03-12');
INSERT INTO employees VALUES (5, 'Jim Halpert', 'Sales', 78000, 4, '2020-08-20');
INSERT INTO employees VALUES (6, 'Dwight Schrute', 'Sales', 82000, 4, '2020-02-14');
INSERT INTO employees VALUES (7, 'Pam Beesly', 'Marketing', 65000, NULL, '2021-09-01');
INSERT INTO employees VALUES (8, 'Ryan Howard', 'Marketing', 62000, 7, '2023-01-10');

-- ====================================================
-- SQL Murder Mystery: The SQL City Detective Tables
-- ====================================================
CREATE TABLE IF NOT EXISTS crime_scene_reports (
  date TEXT,
  city TEXT,
  type TEXT,
  description TEXT
);

CREATE TABLE IF NOT EXISTS person (
  id INTEGER PRIMARY KEY,
  name TEXT,
  license_id INTEGER,
  address_number INTEGER,
  address_street_name TEXT,
  ssn TEXT
);

CREATE TABLE IF NOT EXISTS drivers_licenses (
  id INTEGER PRIMARY KEY,
  age INTEGER,
  height INTEGER,
  eye_color TEXT,
  hair_color TEXT,
  gender TEXT,
  plate_number TEXT,
  car_make TEXT,
  car_model TEXT
);

CREATE TABLE IF NOT EXISTS witness_interviews (
  person_id INTEGER,
  transcript TEXT
);

CREATE TABLE IF NOT EXISTS get_fit_now_members (
  id TEXT PRIMARY KEY,
  person_id INTEGER,
  name TEXT,
  membership_status TEXT
);

CREATE TABLE IF NOT EXISTS get_fit_now_checkins (
  membership_id TEXT,
  check_in_date TEXT,
  check_in_time INTEGER,
  check_out_time INTEGER
);

CREATE TABLE IF NOT EXISTS facebook_event_checkins (
  person_id INTEGER,
  event_id INTEGER,
  event_name TEXT,
  date TEXT
);

-- Seed SQL Murder Mystery Data
INSERT INTO crime_scene_reports VALUES (
  '2024-01-15',
  'SQL City',
  'murder',
  'Security footage reveals that there were 2 witnesses. The first witness lives at the last house on "Northwestern Dr". The second witness, named "Annabel", lives somewhere on "Franklin Ave".'
);

INSERT INTO person VALUES (14887, 'Morty Schapiro', 118009, 4919, 'Northwestern Dr', '111-22-3333');
INSERT INTO person VALUES (16371, 'Annabel Miller', 490173, 103, 'Franklin Ave', '318-77-5609');
INSERT INTO person VALUES (28819, 'Joe Germuska', 320199, 120, 'Pine St', '444-12-8899');
INSERT INTO person VALUES (67318, 'Jeremy Bowers', 423327, 530, 'Washington St', '871-38-9201');
INSERT INTO person VALUES (99716, 'Miranda Priestly', 202298, 1883, 'Golden Ave', '987-65-4321');

INSERT INTO witness_interviews VALUES (
  14887,
  'I heard a gunshot and then saw a man run out. He had a "Get Fit Now Gym" bag. The membership number on the bag started with "48Z". Only gold members have those bags. The man got into a car with a plate that included "H42W".'
);

INSERT INTO witness_interviews VALUES (
  16371,
  'I saw the murder happen, and I recognized the killer from my gym when I was working out on January 9th.'
);

INSERT INTO witness_interviews VALUES (
  67318,
  'I was hired by a woman with a lot of money. I do not know her name but she was around 5''5" (65") or 5''7" (67"). She had red hair and she drove a Tesla Model S. I know that she attended the SQL Symphony Concert 3 times in December 2023.'
);

INSERT INTO drivers_licenses VALUES (118009, 65, 70, 'brown', 'grey', 'male', 'XYZ991', 'Toyota', 'Camry');
INSERT INTO drivers_licenses VALUES (490173, 31, 64, 'blue', 'blonde', 'female', 'ANN992', 'Honda', 'Civic');
INSERT INTO drivers_licenses VALUES (320199, 39, 68, 'brown', 'brown', 'male', '99AB41', 'Ford', 'Focus');
INSERT INTO drivers_licenses VALUES (423327, 30, 70, 'brown', 'brown', 'male', '0H42W2', 'Chevrolet', 'Spark');
INSERT INTO drivers_licenses VALUES (202298, 48, 66, 'green', 'red', 'female', 'VIP888', 'Tesla', 'Model S');

INSERT INTO get_fit_now_members VALUES ('48Z7A', 28819, 'Joe Germuska', 'gold');
INSERT INTO get_fit_now_members VALUES ('48Z55', 67318, 'Jeremy Bowers', 'gold');
INSERT INTO get_fit_now_members VALUES ('90081', 16371, 'Annabel Miller', 'gold');

INSERT INTO get_fit_now_checkins VALUES ('48Z7A', '2024-01-09', 1600, 1730);
INSERT INTO get_fit_now_checkins VALUES ('48Z55', '2024-01-09', 1530, 1700);

INSERT INTO facebook_event_checkins VALUES (67318, 1143, 'SQL Symphony Concert', '2023-12-06');
INSERT INTO facebook_event_checkins VALUES (99716, 1143, 'SQL Symphony Concert', '2023-12-06');
INSERT INTO facebook_event_checkins VALUES (99716, 1143, 'SQL Symphony Concert', '2023-12-15');
INSERT INTO facebook_event_checkins VALUES (99716, 1143, 'SQL Symphony Concert', '2023-12-22');
`

export async function getSqlDb(): Promise<Database> {
  if (dbInstance) return dbInstance
  if (sqlPromise) return sqlPromise

  sqlPromise = (async () => {
    const SQL = await initSqlJs({
      locateFile: () => '/sql-wasm.wasm',
    })
    const db = new SQL.Database()
    db.run(SEED_SQL)
    dbInstance = db
    return db
  })()

  return sqlPromise
}

export function resetSqlDb(): void {
  if (dbInstance) {
    dbInstance.close()
    dbInstance = null
    sqlPromise = null
  }
}

export function formatAsciiTable(columns: string[], values: any[][]): string[] {
  if (!columns.length) return ['(0 columns)']
  if (!values.length) {
    const header = '| ' + columns.join(' | ') + ' |'
    const divider = '+-' + columns.map(c => '-'.repeat(c.length)).join('-+-') + '-+'
    return [divider, header, divider, '(0 rows returned)', divider]
  }

  // Calculate max width per column
  const colWidths = columns.map((col, idx) => {
    let max = col.length
    for (const row of values) {
      const cell = row[idx] === null ? 'NULL' : String(row[idx])
      if (cell.length > max) max = cell.length
    }
    return Math.min(max, 40) // cap max width
  })

  const border = '+' + colWidths.map(w => '-'.repeat(w + 2)).join('+') + '+'
  const header = '| ' + columns.map((c, i) => c.padEnd(colWidths[i])).join(' | ') + ' |'

  const lines: string[] = [border, header, border]

  for (const row of values) {
    const rowStr = '| ' + row.map((val, i) => {
      const s = val === null ? 'NULL' : String(val)
      return s.slice(0, colWidths[i]).padEnd(colWidths[i])
    }).join(' | ') + ' |'
    lines.push(rowStr)
  }

  lines.push(border)
  lines.push(`(${values.length} ${values.length === 1 ? 'row' : 'rows'} returned)`)
  return lines
}

export async function runSqlQuery(sqlQuery: string): Promise<{
  tables: Array<{ columns: string[]; values: any[][] }>
  outputLines: string[]
  error: string | null
}> {
  try {
    const db = await getSqlDb()
    const trimmed = sqlQuery.trim()
    if (!trimmed) {
      return { tables: [], outputLines: ['Empty query.'], error: null }
    }

    const results = db.exec(trimmed)
    const outputLines: string[] = []

    if (!results || results.length === 0) {
      outputLines.push('✓ Query executed successfully. (0 rows returned or DDL/DML completed)')
      return { tables: [], outputLines, error: null }
    }

    for (const res of results) {
      const tableLines = formatAsciiTable(res.columns, res.values)
      outputLines.push(...tableLines)
    }

    return {
      tables: results.map(r => ({ columns: r.columns, values: r.values })),
      outputLines,
      error: null,
    }
  } catch (err: any) {
    return {
      tables: [],
      outputLines: [],
      error: err.message || String(err),
    }
  }
}
