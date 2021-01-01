const dbService = require('./service')

exports.getFulldata = async (req, res) => {
    const path = req.params.path


    const fullPathData = await dbService.getFullCategory(path)
    if (fullPathData === null || fullPathData === undefined){
        return res.status(400).send({"error":"This path does not exist"})
    }

    return res.status(200).send(fullPathData)

}

exports.getObject = async (req, res) => {
    const path = req.params.path
    const id = req.params.id
    
    const objectData = await dbService.getObject(path, id)
    if (objectData === null || objectData === undefined){
        return res.status(400).send({"error":"This object does not exist"})
    }

    return res.status(200).send(objectData)

}

exports.deleteObject = async (req, res) => {
    const path = req.params.path
    const id = req.params.id
    
    const objectData = await dbService.deleteObject(path, id)
    if (objectData === null || objectData === undefined){
        return res.status(400).send({"error":"This object does not exist"})
    }

    return res.status(200).send({"status":"Object deleted successfully", "object":objectData})

}

exports.createObject = async (req, res) => {
    const path = req.params.path
    const obj = req.body

    if (Object.keys(obj).length === 0) {
        return res.status(400).send({"error":"Empty Input Object"})
    }

    try {
        const createdObject = await dbService.newObject(path, obj)
        return res.status(201).send({"status":"Object Created", object: createdObject})
    } catch( err ) {
        console.log(err)
        return res.status(400).send({"error": err.toString()})
    }

}