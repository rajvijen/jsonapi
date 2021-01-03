const fs = require("fs");
const { promisify } = require("util");

const config = require("../config/config");

const readFilePromise = promisify(fs.readFile);
const writeFilePromise = promisify(fs.writeFile);

const _ = require("underscore");

exports.readDB = async () => {
  const fileRaw = await readFilePromise(config.json_path);
  const file_json = JSON.parse(fileRaw);

  return file_json;
};

exports.writeDB = async (fullData) => {
  let cleanedData;
  if (fullData === null || fullData === undefined) {
    throw "[Service.writeDB] Input Data is null";
  }

  if (fullData.constructor === String) {
    // check for valid json
    try {
      trialJson = JSON.parse(fullData);
      cleanedData = fullData;
    } catch (err) {
      throw (
        "[Service.writeDB] Error while parsing json string: " + err.toString()
      );
    }
  } else if (fullData.constructor === Object) {
    cleanedData = JSON.stringify(fullData);
  } else {
    throw (
      "[Service.writeDB] Received input neither Object nor String. Object type: " +
      fullData.constructor.toString()
    );
  }

  const fileWrite = await writeFilePromise(config.json_path, cleanedData);
};

exports.initEmptyDBIfNotExist = async () => {
  if (!fs.existsSync(config.json_path)) {
    console.log("DB does not exist. Creating new DB at " + config.json_path);
    await this.writeDB({});
  }
};

exports.getSubDocumentAtPath = async (topDocument, subpaths) => {
  let subref = topDocument;
  for (i of subpaths) {
    if (subref.constructor == Array) {
      subref = _.find(subref, (o) => o.id == i);
    } else {
      subref = subref[i];
    }
    if (!subref) return null;
  }

  return subref;
};

exports.updateSubDocumentAtPath = async (
  topDocument,
  subpaths,
  subdocument
) => {
  let subref = topDocument;
  let preSubRef = subref;
  let pix = 0;
  while (pix < subpaths.length - 1) {
    preSubRef = subref;
    if (subref.constructor == Array) {
      subref = _.find(subref, (o) => o.id == subpaths[pix]);
    } else {
      subref = subref[subpaths[pix]];
    }

    if (!subref) {
      if (preSubRef.constructor == Array) {
        throw "reached Array. Can not create subdocuments";
      }
      preSubRef[subpaths[pix]] = {};
      subref = preSubRef[subpaths[pix]];
    }
    pix++;
  }

  if (subref.constructor == Array) {
    tobeUpdated = _.find(subref, (o) => o.id == subpaths[subpaths.length - 1]);
    uix = _.indexOf(subref, tobeUpdated);
    subref[uix] = subdocument;
  } else {
    subref[subpaths[subpaths.length - 1]] = subdocument;
  }

  return topDocument;
};

exports.newObject = async (subpaths, obj) => {
  const release_mutex = await config.json_mutex.acquire();

  const allData = await this.readDB();

  existingEntries = await this.getSubDocumentAtPath(allData, subpaths);
  console.log("Existing Entries", existingEntries);
  if (existingEntries === undefined || existingEntries === null) {
    // category does not exist. Create new
    existingEntries = [];
    if (obj.id === undefined) {
      obj.id = 1;
    }
  }

  // sort all objs of category

  if (obj.id === undefined) {
    // generate new ID
    existingEntries = _.sortBy(existingEntries, "id");
    const newID = parseInt(existingEntries[existingEntries.length - 1].id) + 1;
    obj["id"] = newID;
  }

  if (obj.id.constructor === String) {
    release_mutex();
    throw "Only Integer IDs allowed";
  }

  if (_.find(existingEntries, (o) => o.id === obj.id)) {
    release_mutex();
    throw "An object of this ID already exists";
  }

  existingEntries.push(obj);
  existingEntries = _.sortBy(existingEntries, "id");

  try {
    const newAllData = await this.updateSubDocumentAtPath(
      allData,
      subpaths,
      existingEntries
    );
    this.writeDB(newAllData);
    release_mutex();
  } catch (err) {
    console.log(err);
    release_mutex();
    throw "Invalid Path";
  }

  release_mutex();
  return obj;
};

exports.filterByQueryParams = async (data, params) => {
  if (!data || data.constructor != Array) {
    return data;
  }
  return _.where(data, params);
};

exports.sortByQueryParams = async (data, sortby, orderby) => {
  if (!orderby){
    orderby = 'asc'
  }

  if (!data || data.constructor != Array || !sortby) {
   return data
  }

  data = _.sortBy(data, sortby)
  if (orderby== 'dsc' || orderby == 'desc') {
    data = data.reverse()
  }

  return data
}

// Sorting -> use _

exports.getFullCategory = async (subpaths, params = {}) => {
  const allData = await this.readDB();
  const subDocument = await this.getSubDocumentAtPath(allData, subpaths);

  sortby = params['_sort']
  orderby = params['_order']
  delete params['_sort']
  delete params['_order']

  retData = await this.filterByQueryParams(subDocument, params);
  // use params dict
  // console.log(retData)
  retData = await this.sortByQueryParams(retData, sortby, orderby)
  // call to sort method
  // console.log(retData)
  return retData;

};

exports.deleteObject = async (subpaths) => {
  const allData = await this.readDB();
  const release_mutex = await config.json_mutex.acquire();
  const last_key = subpaths.pop();
  let subDocument = await this.getSubDocumentAtPath(allData, subpaths);

  console.log(subDocument);
  if (subDocument === undefined) {
    // category does not exist. Create new
    release_mutex();
    return null;
  }

  let delObj;
  if (subDocument.constructor == Array) {
    delObj = _.find(subDocument, (o) => o.id == last_key);

    if (delObj === null) {
      release_mutex();
      return null;
    }

    subDocument = _.filter(subDocument, (o) => o.id != last_key);
  } else {
    delObj = subDocument[last_key];
    delete subDocument[last_key];
  }

  await this.updateSubDocumentAtPath(allData, subpaths, subDocument);
  this.writeDB(allData);

  release_mutex();
  return delObj;
};

exports.updateObject = async (subpaths, obj) => {
  const release_mutex = await config.json_mutex.acquire();
  const allData = await this.readDB();
  const olddata = await this.getSubDocumentAtPath(allData, subpaths);
  console.log(subpaths);
  console.log(olddata);

  if (obj.id === undefined) {
    obj.id = olddata.id;
  }

  if (obj.id != olddata.id) {
    release_mutex();
    throw "Updating ID of object is not allowed";
  }

  const updatedData = await this.updateSubDocumentAtPath(
    allData,
    subpaths,
    obj
  );

  this.writeDB(updatedData);

  release_mutex();
  return obj;
};
