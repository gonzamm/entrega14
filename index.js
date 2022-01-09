const express = require("express");
const session = require('express-session');
const passport = require("passport");
const parseArgs = require('minimist');
const compression = require("compression");
const logs = require("./src/logs/loggers");

const app = express();

//Logs
const loggerConsola = logs.getLogger("consola");
const loggerWarn = logs.getLogger("warning");
const loggerError = logs.getLogger("error");

//Minimist - Configuracion puerto
const optMinimist = {default: {PORT:8080}}
const args = parseArgs(process.argv.slice(2),optMinimist)
const PORT = args.PORT;

//Sesiones
app.use(session({
  cookie: { maxAge: 600000 },
  secret:"misecreto",
  resave:false,
  saveUninitialized:false,
  rolling:true
}))

//Midelware
app.use(express.static(__dirname + '/public'));
app.use(express.json()); // body-parser
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
//app.use(compression());

  //Guardado todas las peticiones
  app.use((req, res, next) => {
    loggerConsola.info(`ruta ${req.originalUrl} metodo ${req.method}`);
    next();
  });

/*   //Manejo error 404
  app.use((req, res, next) => {
    res.status(404);
    loggerWarn.warn(`ruta ${req.originalUrl} metodo ${req.method} no implementado`)
    res.redirect('http://localhost:8080');
    next();
  }); */

//Routes
const chatRoute = require("./src/routes/chat")
app.use("/api/chat", chatRoute);
const ptosTest = require("./src/routes/ptosTest")
app.use("/api/productos-test", ptosTest);
const login = require("./src/routes/login")
app.use("/api/login", login)
const logout = require("./src/routes/logout")
app.use("/api/logout", logout)
const register = require("./src/routes/register")
app.use("/api/register", register)
const infoRoute = require("./src/routes/info")
app.use("/info", infoRoute)
const randoms = require("./src/routes/randoms")
app.use("/api/randoms", randoms)

//Servidor HTTP
const http = require("http");
const server = http.createServer(app);

//Servidor de Socket
const { Server } = require("socket.io");
const { LongWithoutOverridesClass } = require("bson");
const io = new Server(server);

io.on("connection", (socket)=> {
  socket.emit("render", "")
  socket.on("actualizacion", ()=>{
    io.sockets.emit("render", "")
  })
})


//Comienzo Servidor
server.listen(PORT, () => {
  loggerConsola.info(`Server is run on port ${server.address().port}`)
})
server.on('error', error => loggerConsola.info(`Error en servidor ${error}`))