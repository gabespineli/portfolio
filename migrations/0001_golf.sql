CREATE TABLE golf_counts (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  attempts INTEGER NOT NULL DEFAULT 0,
  made INTEGER NOT NULL DEFAULT 0 CHECK (made >= 0 AND made <= attempts)
);
INSERT INTO golf_counts (id) VALUES (1);
CREATE TABLE golf_shots (
  id TEXT PRIMARY KEY,
  made INTEGER NOT NULL CHECK (made IN (0,1)),
  finished INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  ready_at INTEGER NOT NULL
);
CREATE INDEX golf_shots_created ON golf_shots(created_at);
CREATE TRIGGER golf_attempt AFTER INSERT ON golf_shots BEGIN
  UPDATE golf_counts SET attempts = attempts + 1 WHERE id = 1;
END;
CREATE TRIGGER golf_finish AFTER UPDATE OF finished ON golf_shots
WHEN OLD.finished = 0 AND NEW.finished = 1 BEGIN
  UPDATE golf_counts SET made = made + NEW.made WHERE id = 1;
END;
CREATE TABLE golf_rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL);
CREATE INDEX golf_rate_expiry ON golf_rate_limits(expires_at);
