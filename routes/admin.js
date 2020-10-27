const router = require('express').Router();
const adminController = require('../controller/adminController');
const { upload,uploadMultiple } = require('../middlewares/multer');

router.get('/dashboard', adminController.viewDashboard);


router.get('/category', adminController.viewCategory);
router.post('/category', adminController.addCategory);
router.put('/category', adminController.editCategory);
router.delete('/category/:id', adminController.deleteCategory);


router.get('/news', adminController.viewNews);
router.post('/news', uploadMultiple,adminController.addNews);
router.get('/news/show-image/:id',adminController.showImageNews);
router.get('/news/:id',adminController.showEditNews);
router.put('/news/:id',uploadMultiple,adminController.editNews);
router.delete('/news/:id/delete',adminController.deleteNews);


//endpoint activity
router.get('/news/show-detail-news/:itemId',adminController.viewDetailItems);
router.post('/news/add/activity',upload,adminController.addActivity);
router.put('/news/update/activity',upload,adminController.editActivity);

module.exports = router;