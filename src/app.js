const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(require("./routes/colaboradores"));
app.use(require("./routes/microempresarios"));
app.use(require("./routes/incentivos"));
app.use(require("./routes/zonas"));
app.use(require("./routes/referencias"));
app.use(require("./routes/rutas"));
app.use(require("./routes/administradores"));

module.exports = app;