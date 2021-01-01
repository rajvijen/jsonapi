const dbService = require('./service')

exports.getFulldata = async (req, res) => {
    const path = req.params.path


    const fullPathData = dbService.getFullCategory(path)
    if (fullPathData === null || fullPathData === undefined){
        return res.status(400).send({"error":"This path does not exist"})
    }

    return res.status(200).send(fullPathData)

}

exports.getObject = async (req, res) => {
    const path = req.params.path
    const id = req.params.id
    
    const objectData = dbService.getObject(path, id)
    if (objectData === null || objectData === undefined){
        return res.status(400).send({"error":"This object does not exist"})
    }

    return res.status(200).send(objectData)

}

exports.deleteObject = async (req, res) => {
    const path = req.params.path
    const id = req.params.id
    
    const objectData = dbService.deleteObject(path, id)
    if (objectData === null || objectData === undefined){
        return res.status(400).send({"error":"This object does not exist"})
    }

    return res.status(200).send({"status":"Object deleted successfully", "object":objectData})

}