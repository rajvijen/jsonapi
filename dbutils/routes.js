const dbControllers = require('./controllers')

const router = require('express').Router()


// router.get('/:path/:id', dbControllers.getObject)

// router.get('/:path', dbControllers.getFulldata)



// router.patch('/:path/:id',dbControllers.updateObject)
// router.post('/:path/', dbControllers.createObject)


router.get('/*', dbControllers.getFulldata)
router.post('/*/', dbControllers.createObject)
router.put('/*',dbControllers.updateObject)
router.patch('/*',dbControllers.updateObject)
router.delete('/*', dbControllers.deleteObject)
module.exports = router