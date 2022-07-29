CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL default current_timestamp,
  verified_at TIMESTAMP default NULL
);

CREATE TABLE password_resets (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users (id),
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP default NULL
);


-- CREATE TABLE houses (
--   id SERIAL PRIMARY KEY,
--   name VARCHAR(50) UNIQUE NOT NULL,
--   user_id INT REFERENCES users (id),
--   ruler_id INT
-- );


-- CREATE TABLE characters (
--   id SERIAL PRIMARY KEY,
--   name VARCHAR(50) NOT NULL,
--   house_id INT REFERENCES houses (id)
-- );

-- ALTER TABLE houses
-- ADD CONSTRAINT fk_ruler_id FOREIGN KEY (ruler_id) REFERENCES characters (id);


-- CREATE TABLE character_relations (
--   id SERIAL PRIMARY KEY,
--   type VARCHAR(50) NOT NULL,
--   subject_id INT REFERENCES characters (id),
--   object_id INT REFERENCES characters (id)
-- );

-- CREATE TABLE stocks (
--   id SERIAL PRIMARY KEY,
--   type VARCHAR(50) NOT NULL
-- );

-- CREATE TABLE stock_items (
--   id SERIAL PRIMARY KEY,
--   type VARCHAR(50) NOT NULL,
--   amount INT,
--   stock_id INT REFERENCES stocks (id)
-- );

-- CREATE TABLE fiefs (
--   id SERIAL PRIMARY KEY,
--   name VARCHAR(50) NOT NULL,
--   house_id INT REFERENCES houses (id),
--   owner_id INT REFERENCES characters (id),
--   owner_stock_id INT REFERENCES stocks (id),
--   market_id INT REFERENCES stocks (id)
-- );

-- CREATE TABLE buildings (
--   id SERIAL PRIMARY KEY,
--   fief_id INT REFERENCES fiefs (id),
--   type VARCHAR(50) NOT NULL
-- );





