//Es el archivo que arranca la aplicación
const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const passport = require('passport');

const {database} = require('./keys');

//Initializations
const app = express();
require('./lib/passport');

//Settings
app.set('port', process.env.PORT || 3000); //Usa el puerto de las variables del sistema o el 3000 en su defecto
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs', //se dice que extención son los archivos para no poner .handlebars
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

//Middlewares
app.use(session({
    secret: 'mysqlnodesession',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}))
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//Globar Variables
app.use((req, res, next) => {
    app.locals.Success = req.flash('Success')
    app.locals.Message = req.flash('Message')
    next();
});

//Routes
app.use(require('./routes')); //Entra y busca el archivo index.js por defecto, si tiene otro nombre se tiene que aclarar
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));

//Public
app.use(express.static(path.join(__dirname, 'public')));

//Starting the Server
app.listen(app.get('port'), () => {
    console.log('Server on port ',app.get('port'));
});