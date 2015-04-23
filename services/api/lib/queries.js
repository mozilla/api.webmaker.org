module.exports = {
  findSkittleById: "SELECT id, color FROM skittles WHERE id = $1;",
  createSkittle: "INSERT INTO skittles (color) VALUES($1);"
};
