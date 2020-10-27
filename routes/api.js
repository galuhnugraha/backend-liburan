const router = require('express').Router();
const {upload} = require('../middlewares/multer');
const apiController = require('../controller/apiController');

//router dashboard
router.get('/landing-page',apiController.landingPage);
// router.get('/detail-page/:id',apiController.detailPage);

module.exports = router;

