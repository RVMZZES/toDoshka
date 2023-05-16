const express = require('express');
const bodyParser = require('body-parser');



const app = express();
const port = 3000;
let counter = 0;



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header({"Access-Control-Allow-Origin": "*"});
    next();
});
app.use((req, res, next) => {
    res.header({"Access-Control-Allow-Headers": "*"});
    next();
});
app.use((req, res, next) => {
    res.header({"Access-Control-Allow-Methods": "*"});
    next();
});

let todoList = [];

// Create
app.post('/api/user', (req, res) => {
    const task  = req.body;
    task.userId = counter++;
    todoList.push(task);
    res.send({ message: 'Task added successfully!' });
    console.log(todoList);
});

// Read
app.get('/api/data', (req, res) => {
    res.send(todoList);
});

// Update
app.put('/main/:id', (req, res) => {
    const { id } = req.params;
    const { task } = req.body;
    todoList[id] = task;
    res.send({ message: 'Task updated successfully!' });
});

// Delete
app.delete('/api/data', (req, res) => {
    const id = req.query.userId;
    todoList.splice(id, 1);
    res.send({ message: 'Task deleted successfully!' });
    console.log(id);
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
});