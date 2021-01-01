const fs = require('fs')
const {promisify} = require('util')

const config = require('../config/config')

const readFilePromise = promisify(fs.readFile)
const writeFilePromise = promisify(fs.writeFile)

const _ = require('underscore')


exports.readDB = async () => {
    const fileRaw = await readFilePromise(config.json_path)
    const file_json = JSON.parse(fileRaw)
    
    return file_json
}

exports.writeDB = async (fullData)=> {
    let cleanedData;
    if (fullData === null || fullData === undefined) {
        throw "[Service.writeDB] Input Data is null"
    }

    if (fullData.constructor === String) {
        // check for valid json
        try{
            trialJson = JSON.parse(fullData)
            cleanedData = fullData
        }
        catch(err) {
            throw "[Service.writeDB] Error while parsing json string: " + err.toString() 
        }
    }
    else if (fullData.constructor === Object) {
        cleanedData = JSON.stringify(fullData)

    }

    else {
        throw "[Service.writeDB] Received input neither Object nor String. Object type: " + fullData.constructor.toString()
    }

    const fileWrite = await writeFilePromise(config.json_path, cleanedData)

}

exports.initEmptyDBIfNotExist = async () => {
    
    if(!fs.existsSync(config.json_path)){
   
        console.log("DB does not exist. Creating new DB at " + config.json_path)
        await this.writeDB({})
    }
}


exports.newObject = async(category, obj) => {

    const release_mutex = await config.json_mutex.acquire()

    const allData = await this.readDB()

    if (allData[category] === undefined){
        // category does not exist. Create new
        allData[category] = []
        if (obj.id === undefined) {
            obj.id = 1
        }
    }

    let categoryData = allData[category]

    // sort all objs of category

    

    if (obj.id === undefined) {
        // generate new ID
        categoryData = _.sortBy(categoryData, 'id')
        const newID = parseInt(categoryData[categoryData.length - 1].id) + 1
        obj['id'] = newID
    }

    if (obj.id.constructor === String){
        throw "Only Integer IDs allowed"
    }

    if(_.find(categoryData, o => o.id === obj.id)) {
        throw "An object of this ID already exists"
    }

    categoryData.push(obj)
    categoryData = _.sortBy(categoryData, 'id')

    allData[category] = categoryData

    this.writeDB(allData)

    release_mutex()
    return obj
}

exports.filterByQueryParams = async (data, params) => {

    return _.where(data, params)
}

exports.getFullCategory = async(category, params = {}) => {
    const allData = await this.readDB()
    let retData = {};
    if (allData[category]){
        retData = allData[category]
    }

    retData = await this.filterByQueryParams(retData, params)
    return retData
}

exports.getObject = async (category, id) => {

    const allData = await this.readDB()
    if (allData[category] === undefined){
        // category does not exist. Create new
        
        return null
    }

    const reqObj = _.find(allData[category], o => o.id == id)

    return reqObj
}

exports.deleteObject = async (category, id) => {
    const release_mutex = await config.json_mutex.acquire()
    let allData = await this.readDB()
    console.log(allData)
    if (allData[category] === undefined){
        // category does not exist. Create new
        return null
    }

    const reqObj = _.find(allData[category], o => o.id == id)

    if (reqObj === null) {
        return null
    }

    allData[category] = _.filter(allData[category], o => o.id != id)

    this.writeDB(allData)

    release_mutex()
    return reqObj
}

exports.updateObject = async (category, id, obj) => {
    const release_mutex = await config.json_mutex.acquire()
    const allData = await this.readDB()

    if (obj.id === undefined){
        obj.id = parseInt(id)
    }
    
    if (obj.id != id){
        throw "Updating ID of object is not allowed"
    }

    if (allData[category] === undefined){
        // category does not exist. Create new
        
        throw "This object does not exist"
    }

    
    const existingObj = _.find(allData[category], o => o.id == id)

    if (existingObj === null){
        throw "This object does not exist"
    }

    const objIndex = _.indexOf(allData[category], existingObj)

    allData[category][objIndex] = obj

    this.writeDB(allData)

    release_mutex()
    return obj

}