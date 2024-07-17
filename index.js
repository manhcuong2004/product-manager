const express = require('express');
// const mongoose = require('mongoose');

require("dotenv").config();
const route = require("./routes/client/index-router");

// async function main() {
//     await mongoose.connect('mongodb://localhost:27017/product-management');

//     // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
// }
const app = express()
const port = process.env.PORT

app.set('views', './views')
app.set('view engine', 'pug')
// file tĩnh dùng để public
app.use(express.static("public"))
route(app)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})