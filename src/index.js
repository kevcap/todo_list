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

  if(!user) {
    return res.status(400).json({error:"user not found"})
  }

  req.user = user;
  
  return next()

}

app.post('/users', (req, res) => {
  // Complete aqui
  const { username, name, todos} = req.body;
  
  const userAlreadyExists = users.some(user => user.username === username);

  if(userAlreadyExists) {
    return res.status(400).json({error: 'user already exists'})
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
});

app.post('/todos', checksExistsUserAccount, (req, res) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (req, res) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (req, res) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (req, res) => {
  // Complete aqui
});

module.exports = app;