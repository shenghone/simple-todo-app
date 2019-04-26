const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let todos = ["do laundry", "exercise", "grocery shopping"];

app.use(express.static("dist"));
app.get("/todos", (req, res) => {
  return res.json(todos);
});

app.post("/todos", (req, res) => {
  todos.push(req.body.todo);
  return res.json(todos);
});

app.delete("/todos", (req, res) => {
  todos = todos.filter(t => t !== req.body.item);
  return res.json(todos);
});

app.put("/todos", (req, res) => {
  const index = todos.indexOf(req.body.originalTodo);
  todos[index] = req.body.modifiedTodo;

  return res.json(todos);
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Listening on port ${process.env.PORT || 8080}`);
});
