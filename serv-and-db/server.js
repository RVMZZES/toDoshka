const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
const port = 3000;

const TodoModel = require('./DB'); // Подключение модели TodoModel

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use((req, res, next) => {
    res.header({"Access-Control-Allow-Origin": "*"});
    res.header({"Access-Control-Allow-Headers": "*"});
    res.header({"Access-Control-Allow-Methods": "*"});
    next();
});

// Create
app.post('/api/user', (req, res) => {
    const newTodo = new TodoModel({ // Создание новой задачи на основе данных из запроса
        text: req.body.text,
        checked: false
    });

    newTodo.save()
        .then((save) => {
            res.send(save);
            console.log('Task saved to database!');

    })
        .catch(error => {
        console.error(error);
        res.send('Error saving Task to database!');
    });

});

// Read
app.get('/api/data', (req, res) => {
    TodoModel.find({})
    .then((find) => {
            res.send(find);
            console.log('Tasks updated from database!');
        })
            .catch(error => {
                console.error(error);
                res.send('Error update tasks from database!');
            });
});

// Update status
app.put('/api/data/:id', (req, res) => {
    const id  = req.params.id;
    const isChecked = req.body.checked;
    const text = req.body.text;
    TodoModel.findById(id)
        .then((data) => {
            if (data.text !== text) {
                data.text = text;
            }
            data.checked = isChecked;
            data.save();
            console.log(`Task "${id}" successfully change status from data base!`);
            res.send({ message: `Task "${id}" change status successfully from data base!` });
        })
        .catch(error => {
            console.error(error);
            res.send(`Error change status "${id}" task from data base!`);
        });
});

// Delete one task
app.delete('/api/data/:id', (req, res) => {
    const id = req.params.id;
    TodoModel.findByIdAndDelete(id)
        .then(() => {
            console.log(`Task "${id}" successfully deleted from data base!`);
            res.send({ message: `Task "${id}" deleted successfully from data base!` });
        })
        .catch(error => {
            console.error(error);
            res.send(`Error deleted "${id}" task from data base!`);
        });
});

// Delete all task
app.delete('/api/data', (req, res) => {
    TodoModel.deleteMany()
        .then(() => {
            console.log(`All task successfully deleted from data base!`);
            res.send({ message: `All task deleted successfully from data base!` });
        })
        .catch(error => {
            console.error(error);
            res.send(`Error deleted all task from data base!`);
        });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
});