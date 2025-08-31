CREATE TABLE Profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  education TEXT,
  github TEXT,
  linkedin TEXT,
  portfolio TEXT,
  createdAt DATETIME,
  updatedAt DATETIME
);
