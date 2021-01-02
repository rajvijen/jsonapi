var express = require("express");
var app = express();
const cors = require("cors");
const morgan = require("morgan");
const dbService = require("./dbutils/service");

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const dbRoutes = require("./dbutils/routes");

app.use("", dbRoutes);

const preStartActions = async () => {
  await dbService.initEmptyDBIfNotExist();
};

preStartActions().then(() => {
  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
});
