const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const app = express();

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(require("./controllers"));

app.listen(3000, () => console.log("listening on port 3000"));
