module.exports = {
  findSkittleById: "SELECT id, color, user_id FROM skittles WHERE id = $1;",
  createSkittle: "INSERT INTO skittles (color, user_id) VALUES($1, $2);",
  updateSkittleById: "UPDATE skittles SET color = $1 WHERE id = $2",
  deleteSkittleById: "DELETE FROM skittles WHERE id = $1"
};
