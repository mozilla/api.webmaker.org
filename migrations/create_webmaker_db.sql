CREATE TABLE IF NOT EXISTS "users"
(
  id serial NOT NULL,
  username varchar(20) NOT NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at timestamp DEFAULT NULL,
  language varchar(2) NOT NULL DEFAULT 'en',
  country varchar(2) NOT NULL DEFAULT 'US',
  moderator boolean NOT NULL DEFAULT FALSE,
  staff boolean NOT NULL DEFAULT FALSE,
  CONSTRAINT users_id_pk PRIMARY KEY (id),
  CONSTRAINT unique_username UNIQUE (username)
);
