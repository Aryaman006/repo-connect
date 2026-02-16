const express = require('express');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser')
var fs = require('fs')
require("./DB_Config")
require("./crons/crons")
const indexRoute = require("./Router/index")
const path = require("path");

const cors = require('cors');
const corsOptions = {
	exposedHeaders: ["Authorization","isAdmin","user_id","designation","role","user_type"],
};
app.use(cors(corsOptions));
// app.use(cors());

app.use(morgan('dev'))
  app.use(morgan('common', {
      stream: fs.createWriteStream(path.join(__dirname, 'logs/access.log'), { flags: 'a' })
  }))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use("/api", indexRoute)
 


process.on("uncaughtException", (err)=>{
    console.log("Error uncaught", err);
})

module.exports = app;