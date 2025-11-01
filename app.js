require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();


app.use(express.json()); // Parse JSON bodies
app.use(cors("*"));

let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
];

// GET All – Read
app.get('/todos', (req, res) => {
  res.status(200).json(todos); // Send array as JSON
});

app.get('/todo/:id', (req, res) => {
  if (req.params.id) {
    const todo = todos.find((t) => t.id === parseInt(req.params.id));
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    return res.status(200).json(todo); // Send single item as JSON
  }
  res.status(400).json({ message: 'ID parameter is required' });
});
// POST New – Create
app.post('/todos', (req, res) => {
  const newTodo = { id: todos.length + 1, ...req.body }; // Auto-ID
  if (!newTodo.task) return res.status(400).json({ message: 'Task is required' });
  todos.push(newTodo);
  res.status(201).json(newTodo); // Echo back
});

// Filter – Active Todos
app.get('/todos/active', (req, res) => {
  const active = todos.filter((t) => !t.completed);
  if (active.length === 0) {return res.status(404).json({ message: 'No active todos found' });}
  return res.status(200).json(active); 
});


// PATCH Update – Partial
app.patch('/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id)); // Array.find()
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  Object.assign(todo, req.body); // Merge: e.g., {completed: true}
  res.status(200).json(todo);
});

// DELETE Remove
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter((t) => t.id !== id); // Array.filter() – non-destructive
  if (todos.length === initialLength)
    return res.status(404).json({ error: 'Not found' });
  res.status(204).send(); // Silent success
});

app.get('/todos/completed', (req, res) => {
  const completed = todos.filter((t) => t.completed);
  if (completed.length === 0) { return res.status(404).json({ message: 'No completed todos found' });}
  res.json(completed); // Custom Read!
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Server error!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
