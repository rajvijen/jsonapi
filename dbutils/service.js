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
    try {
        fs.existsSync(config.json_path)
    }
    catch (err){
        console.log("DB does not exist. Creating new DB at " + config.json_path)
        await this.writeDB({})
    }
}


exports.newObject = async(category, obj) => {
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

    categoryData.push(obj)
    categoryData = _.sortBy(categoryData, 'id')

    allData[category] = categoryData

    this.writeDB(allData)
}

exports.getFullCategory = async(category) => {
    const allData = await this.readDB()
    let retData = {};
    if (allData[category]){
        retData = allData[category]
    }

    return retData
}

exports.getObject = async (category, id) => {
    const allData = await this.readDB()
    if (allData[category] === undefined){
        // category does not exist. Create new
        return null
    }

    const reqObj = _.find(allData[category], o => o.id === id)

    return reqObj
}

exports.deleteObject = async (category, id) => {
    let allData = await this.readDB()
    if (allData[category] === undefined){
        // category does not exist. Create new
        return null
    }

    allData[category] = _.filter(allData[category], o => o.id != id)

    this.writeDB(allData)
}