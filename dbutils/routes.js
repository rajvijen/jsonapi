const dbControllers = require('./controllers')

const router = require('express').Router()


router.get('/:path/:id', dbControllers.getObject)
router.get('/:path', dbControllers.getFulldata)


router.post('/:path/', dbControllers.createObject)


router.delete('/:path/:id', dbControllers.deleteObject)

module.exports = router