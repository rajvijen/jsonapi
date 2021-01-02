const path = require("path");
const { Mutex } = require("async-mutex");

const dbFileMutex = new Mutex();
module.exports = {
  json_path: path.join(__dirname, "..", "store.json"),
  json_mutex: dbFileMutex,
};
