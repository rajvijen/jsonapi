const dbService = require("./service");

const getSubpaths = (path) => {
  const subpaths = path.split("/");
  if (subpaths[subpaths.length - 1] == "") {
    subpaths.pop();
  }

  return subpaths;
};

exports.getFulldata = async (req, res) => {
  // also supports filtering by query parameters
  const path = req.params["0"];
  const qparams = req.query;
  // console.log(qparams)

  const subpaths = getSubpaths(path);
  const fullPathData = await dbService.getFullCategory(subpaths, qparams);
  if (fullPathData === null || fullPathData === undefined) {
    return res.status(400).send({ error: "This path does not exist" });
  }

  return res.status(200).send(fullPathData);
};

exports.deleteObject = async (req, res) => {
  const path = req.params["0"];
  const id = req.params.id;

  const subpaths = getSubpaths(path);
  const objectData = await dbService.deleteObject(subpaths, id);
  if (objectData === null || objectData === undefined) {
    return res.status(400).send({ error: "This object does not exist" });
  }

  return res
    .status(200)
    .send({ status: "Object deleted successfully", object: objectData });
};

exports.createObject = async (req, res) => {
  const path = req.params["0"];
  const obj = req.body;

  if (Object.keys(obj).length === 0) {
    return res.status(400).send({ error: "Empty Input Object" });
  }

  const subpaths = getSubpaths(path);

  console.log(subpaths);
  try {
    const createdObject = await dbService.newObject(subpaths, obj);
    return res
      .status(201)
      .send({ status: "Object Created", object: createdObject });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: err.toString() });
  }
};

exports.updateObject = async (req, res) => {
  const path = req.params["0"];
  const obj = req.body;
  const subpaths = getSubpaths(path);

  if (Object.keys(obj).length === 0) {
    return res.status(400).send({ error: "Empty Input Object" });
  }

  try {
    const updatedObject = await dbService.updateObject(subpaths, obj);
    return res
      .status(201)
      .send({ status: "Object Created", object: updatedObject });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: err.toString() });
  }
};
