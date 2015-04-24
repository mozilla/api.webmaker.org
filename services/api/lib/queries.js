module.exports = {
  findSkittleById: "SELECT id, color FROM skittles WHERE id = $1;",
  createSkittle: "INSERT INTO skittles (color) VALUES($1);",
  updateSkittleById: "UPDATE skittles SET color = $1 WHERE id = $2;",
  deleteSkittleById: "DELETE FROM skittles WHERE id = $1"
};
