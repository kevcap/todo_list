const express = require('express');
const cors = require('cors');

const { v4: uuidv4, validate } = require('uuid');

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

function checksCreateTodosUserAvailability(req, res, next) {
  const { username } = req.headers;

  const user = users.find(user => user.username === username);
  
  if(!user.pro && user.todos.length >=10 ) {
    console.log("teste");
    return res.status(403).json({error: "Limit todos per basic account. Please upgrade to Pro."})
  }

  return next()

}

function checksTodoExists(req, res, next){

}

function findUserById() {

}

app.post('/users', (req, res) => {
  // Complete aqui
  const { username, name } = req.body;

  const userAlreadyExists = users.some(user => user.username === username);

  if (userAlreadyExists) {
    return res.status(400).json({ error: 'user already exists' })
  }

  const newUser = {
    name,
    username,
    id: uuidv4(),
    pro: false,
    todos: []
  }

  users.push(newUser);

  return res.status(201).json(newUser)
});

app.get('/todos', checksExistsUserAccount, (req, res) => {
  // Complete aqui
  const { user } = req;

  return res.json(user.todos)
});

app.post('/todos', checksExistsUserAccount, checksCreateTodosUserAvailability, (req, res) => {
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

  const todo = user.todos.find(todo => todo.id === id);

  if (!todo) {
    return res.status(404).json({ error: "Todo doesn't exist" });
  }

  todo.title = title;
  user.deadline = new Date(deadline);

  return res.json(todo)

});

app.patch('/todos/:id/done', checksExistsUserAccount, (req, res) => {
  // Complete aqui
  const { user } = req;
  const { id } = req.params;

  const todo = user.todos.find(todo => todo.id === id);

  if (!todo) {
    return res.status(404).json({ error: "Todo doesn't exist" });
  }

  todo.done = true;

  return res.json(todo)

});


app.delete('/todos/:id', checksExistsUserAccount, (req, res) => {
  // Complete aqui
  const { user } = req;
  const { id } = req.params;

  const todoIndex = user.todos.findIndex(todo => todo.id === id);

  if(todoIndex === -1 ) {
    return res.status(404).json({error: "Task not found"});
  }

  user.todos.splice(todoIndex, 1);

  res.status(204).json(user.todos)

});

module.exports = app;