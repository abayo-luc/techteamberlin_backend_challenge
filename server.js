const express = require("express");
const bodyParser = require("body-parser");
//loading dotenv variables at the early stage as possible
require("dotenv").config();

//load all end points
const routers = require("./router");
//initialize the app
const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", routers);

// set the port depending on Dev Environment (production or development)
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`the app is listening to ${port}`));
