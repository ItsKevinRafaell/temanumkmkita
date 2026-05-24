CREATE TABLE IF NOT EXISTS content_pillars (
  id            VARCHAR(36)  PRIMARY KEY,
  niche         VARCHAR(255) NOT NULL,
  name          VARCHAR(500) NOT NULL,
  description   TEXT,
  focus_keyword VARCHAR(255),
  position_x    REAL DEFAULT 0,
  position_y    REAL DEFAULT 0,
  created_at    TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS content_topics (
  id            VARCHAR(36)  PRIMARY KEY,
  pillar_id     VARCHAR(36)  REFERENCES content_pillars(id) ON DELETE SET NULL,
  title         VARCHAR(500) NOT NULL,
  focus_keyword VARCHAR(255),
  search_volume INTEGER,
  difficulty    INTEGER,
  notes         TEXT,
  status        VARCHAR(50)  DEFAULT 'planned',
  position_x    REAL DEFAULT 0,
  position_y    REAL DEFAULT 0,
  created_at    TEXT NOT NULL
);

ALTER TABLE articles ADD COLUMN IF NOT EXISTS pillar_id VARCHAR(36);
