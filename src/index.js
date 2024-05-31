const express = require("express");
const expressConfig = require("./config/expressConfig");
const handlebarsConfig = require("./config/handlebarsConfig");
const dbConnect = require("./config/dbConfig");
const router = require("./router");
const app = express();
const { PORT } = require("./constants");

expressConfig(app);
handlebarsConfig(app);

dbConnect()
  .then(() => console.log("Successfully connected to the DB!"))
  .catch((err) => console.log(`Error while connecting in DB: ${err}`));

app.use(router);

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}...`));
