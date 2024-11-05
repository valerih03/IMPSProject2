const express = require('express');
const path = require('path');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const dotenv = require('dotenv');
const flash = require('connect-flash');
const session = require('express-session');

// Inicializaciones
const app = express();
dotenv.config();

//nose xd
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars') // Esto debería cargar los helpers correctamente
}));

// Configuraciones
app.set('port', process.env.PORT || 4500);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(session({
    secret: 'secret', // Asegúrate de proporcionar un valor para la opción secret
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(morgan('dev')); // Configurando el middleware morgan para visualizar que está llegando al servidor
app.use(express.urlencoded({ extended: false })); // Sirve para poder aceptar datos desde formularios

// ==== VARIABLES GLOBALES =====
app.use((request, response, next) => {
    // Haciendo global el uso de flash
    app.locals.success = request.flash('success');
    app.locals.error = request.flash('error');
    next(); // permite continuar con la ejecución del código
});

// Configuración de rutas
app.use(require('./routes')); // Node automáticamente busca el index.js del módulo
app.use('/estudiantes', require('./routes/estudiantes')); // Configuración de ruta para estudiantes
//app.use('/carreras', require('./routes/carreras')); // Configuración de ruta para carreras
//app.use('/materias', require('./routes/materias')); // Configuración de ruta para materias
//app.use('/profesores', require('./routes/profesores')); // Configuración de ruta para profesores
//app.use('/grupos', require('./routes/grupos')); // Configuración de ruta para grupos

// Archivos públicos (acá se coloca todo el código al cual el navegador puede acceder)
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar el servidor
app.listen(app.get('port'), () => {
    console.log('Servidor iniciado en el puerto: ', app.get('port'));
});