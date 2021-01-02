const dbControllers = require("./controllers");

const router = require("express").Router();

router.get("/*", dbControllers.getFulldata);
router.post("/*/", dbControllers.createObject);
router.put("/*", dbControllers.updateObject);
router.patch("/*", dbControllers.updateObject);
router.delete("/*", dbControllers.deleteObject);
module.exports = router;
