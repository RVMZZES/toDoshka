const mongoose = require('mongoose');
const db = 'mongodb://127.0.0.1:27017/node-todo';
const Schema = mongoose.Schema;
mongoose.connect(db)
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch(err => console.log('Error connecting to database:', err));

const TodoSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    checked: {
        type: Boolean,
        default: false
    }
});

const TodoModel = mongoose.model('Todo', TodoSchema);

module.exports = TodoModel;