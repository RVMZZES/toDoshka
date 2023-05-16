const mongoose = require('mongoose');

const db = 'mongodb://localhost:27017/node-todo'

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(`${db}`);
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}