const express = require('express');
require("dotenv").config();
const methodOverride = require('method-override')
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const expresSession = require('express-session')

const systemConfig = require('./config/system');
const database = require('./config/database');
// khai baso route index
const route = require("./routes/client/index-router");
const routeAdmin = require("./routes/admin/index-router");
const bodyParser = require('body-parser');

database.connect();
const app = express();
const port = process.env.PORT;
app.use(methodOverride('_method'))

app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', `${__dirname}/views`)
app.set('view engine', 'pug')

//flash
app.use(cookieParser('keyboard cat'));
app.use(expresSession({ cookie: { maxAge: 60000 } }));
app.use(flash());

// khai báo biến locals dùng đc bất kì đâu
app.locals.prefixAdmin = systemConfig.prefixAdmin

// file tĩnh dùng để public
app.use(express.static(`${__dirname}/public`));


route(app);
routeAdmin(app);


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})