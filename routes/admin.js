const router = require('express').Router();
const adminController = require('../controller/adminController');
const { upload,uploadMultiple } = require('../middlewares/multer');

router.get('/dashboard', adminController.viewDashboard);


router.get('/category', adminController.viewCategory);
router.post('/category', upload, adminController.addCategory);
router.put('/category', upload, adminController.editCategory);
router.delete('/category/:id', upload, adminController.deleteCategory);


router.get('/news', adminController.viewNews);
router.post('/news', uploadMultiple,adminController.addNews);
router.get('/news/show-image/:id',adminController.showImageNews);
router.get('/news/:id',adminController.showEditNews);
router.put('/news/:id',uploadMultiple,adminController.editNews);
router.delete('/news/:id/delete',adminController.deleteNews);

//endpoint testimonial
router.get('/news/show-detail-news/:itemId',adminController.viewDetailItems);
router.post('/news/add/testimonial',upload,adminController.addTestimonial);

//endpoint activity
router.get('/news/show-detail-news/:itemId',adminController.viewDetailItems);
router.post('/news/add/activity',upload,adminController.addActivity);
router.put('/news/update/activity',upload,adminController.editActivity);
router.delete('/news/:itemId/activity/:id',upload,adminController.deleteActivity);

module.exports = router;