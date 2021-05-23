const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(req, res, next) {
  // Complete aqui
  const { username } = req.headers;

  const user = users.find(user => user.username === username);

  if (!user) {
    return res.status(400).json({ error: "user not found" })
  }

  req.user = user;

  return next()

}

app.post('/users', (req, res) => {
  // Complete aqui
  const { username, name, todos } = req.body;

  const userAlreadyExists = users.some(user => user.username === username);

  if (userAlreadyExists) {
    return res.status(400).json({ error: 'user already exists' })
  }

  const newUser = {
    username,
    name,
    id: uuidv4(),
    todos
  }

  users.push(newUser);

  return res.status(201).json(newUser)
});

app.get('/todos', checksExistsUserAccount, (req, res) => {
  // Complete aqui
  const { user } = req;

  return res.json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (req, res) => {
  // Complete aqui
  const { user } = req
  const { title, deadline } = req.body;
  const todo = {
    id: uuidv4(),
    title,
    deadline: new Date(deadline),
    done: false,
    created_at: new Date()
  }

  user.todos.push(todo)

  return res.status(201).json(todo)

});

app.put('/todos/:id', checksExistsUserAccount, (req, res) => {
  // Complete aqui
  const { user } = req;
  const { title, deadline } = req.body;
  const { id } = req.params;

  const todoIndex = user.todos.findIndex(todo => todo.id === id);
  
  if (todoIndex === -1) {
    return res.status(400).json({ error: "Todo doesn't exist" });
  }

  user.todos[todoIndex].title = title;
  user.todos[todoIndex].deadline = deadline;

  return res.status(201).json(user.todos)

});

app.patch('/todos/:id/done', checksExistsUserAccount, (req, res) => {
  // Complete aqui
  const { user } = req;
  const { id } = req.params;

  const todoIndex = user.todos.findIndex(todo => todo.id === id);

  if(todoIndex === -1 ) {
    return res.status(400).json({error: "Task not found"});
  }

  user.todos[todoIndex].done = true;

  return res.json(user.todos[todoIndex])

});

app.delete('/todos/:id', checksExistsUserAccount, (req, res) => {
  // Complete aqui
  const { user } = req;
  const { id } = req.params;

  const todoIndex = user.todos.findIndex(todo => todo.id === id);

  if(todoIndex === -1 ) {
    return res.status(400).json({error: "Task not found"});
  }

  user.todos.splice(todoIndex, 1);

  res.json(user.todos)

});

module.exports = app;