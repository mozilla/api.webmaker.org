CREATE TABLE skittles
(
  id serial NOT NULL,
  color varchar(64) NOT NULL,
  user_id integer NOT NULL,
  CONSTRAINT id PRIMARY KEY (id)
);

CREATE INDEX  skittles_id_index ON skittles (id);
CREATE INDEX  skittles_id_user_index ON skittles (id, user_id);
