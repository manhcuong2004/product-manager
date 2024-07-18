const express = require('express');
require("dotenv").config();

const database = require('./config/database');

const systemConfig = require('./config/system');

// khai baso route index
const route = require("./routes/client/index-router");
const routeAdmin = require("./routes/admin/index-router");

database.connect();

const app = express();
const port = process.env.PORT;

app.set('views', './views')
app.set('view engine', 'pug')
// khai báo biến locals dùng đc bất kì đâu
app.locals.prefixAdmin = systemConfig.prefixAdmin

// file tĩnh dùng để public
app.use(express.static("public"));

route(app);
routeAdmin(app);


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})