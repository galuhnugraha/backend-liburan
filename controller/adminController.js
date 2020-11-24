const Category = require('../models/Category');
const Item = require('../models/Item');
const Image = require('../models/Image');
const Activity = require('../models/Activity');
const fs = require('fs-extra');
const path = require('path');
const Testimonial = require('../models/Testimonial');

module.exports = {
    viewDashboard: async (req, res) => {
        try {
            const category = await Category.find();
            const item = await Item.find();
            const activity = await Activity.find()
            res.render('admin/dashboard/view_dashboard', {
                title: 'Berita | Dashboard',
                category,
                item,
                activity
            });
            // console.log(member);
        } catch (error) {
            res.redirect('/admin/dashboard');
        }
    },
    viewCategory: async (req, res) => {
        try {
            const category = await Category.find();
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = { message: alertMessage, status: alertStatus }
            res.render('admin/category/view_category', {
                category,
                alert,
                title: "Berita | Category"
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/category/view_category');
        }

    },

    addCategory: async (req, res) => {
        try {
            const { name } = req.body;
            if (!req.file) {
                req.flash('alertMessage', 'Image not found');
                req.flash('alertStatus', 'danger');
                res.redirect('/admin/category');
            }
            await Category.create({
                name,
                imageUrl: `images/${req.file.filename}`
            });
            req.flash('alertMessage', 'Success add category');
            req.flash('alertStatus', 'success')
            res.redirect('/admin/category');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/category');
        }

    },

    // editCategory: async (req, res) => {
    //     const { id, name,imageUrl} = req.body;
    //     try {
    //         const category = await Category.findOne({ _id: id });
    //         if (req.file == undefined) {
    //             category.name = name;
    //             // category.imageUrl = `images/${req.file.filename}`;
    //             await category.save();
    //             req.flash('alertMessage', 'Success update Category');
    //             req.flash('alertStatus', 'success');
    //             res.redirect('/admin/category');
    //         } else {
    //             await fs.unlink(path.join(`public/${category.imageUrl}`));
    //             category.name = name;
    //             // category.imageUrl = imageUrl;
    //             category.imageUrl = `images/${req.file.filename}`;
    //             await category.save();
    //             req.flash('alertMessage', 'Success update activity');
    //             req.flash('alertStatus', 'success');
    //             res.redirect('/admin/category');
    //         }
    //     } catch(error) {
    //         req.flash('alertMessage', `${error.message}`);
    //         req.flash('alertStatus', 'danger');
    //         res.redirect('/admin/category');
    //     }
    // },

    editCategory: async (req, res) => {
        const { id, name } = req.body;
        try {
            const category = await Category.findOne({ _id: id });
            if (req.file == undefined) {
                category.name = name;
                await category.save();
                req.flash('alertMessage', 'Success update category');
                req.flash('alertStatus', 'success');
                res.redirect(`/admin/category`);
            } else {
                await fs.unlink(path.join(`public/${category.imageUrl}`));
                category.name = name;
                category.imageUrl = `images/${req.file.filename}`
                await category.save();
                req.flash('alertMessage', 'Success update category');
                req.flash('alertStatus', 'success');
                res.redirect(`/admin/category`);
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/category`);
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const { id } = req.params;
            const category = await Category.findOne({ _id: id });
            await fs.unlink(path.join(`public/${category.imageUrl}`));
            await category.remove()
            req.flash('alertMessage', 'Success delete category');
            req.flash('alertStatus', 'success')
            res.redirect('/admin/category');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/category');
        }
    },

    viewNews: async (req, res) => {
        try {
            const news = await Item.find()
                .populate({
                    path: 'imageId', select: 'id imageUrl'
                })
                .populate({ path: 'categoryId', select: 'id name' });
            const category = await Category.find()
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = { message: alertMessage, status: alertStatus }
            res.render('admin/news/view_news', {
                title: "Berita | News",
                category,
                alert,
                news,
                action: 'view'
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/news');
        }
    },

    addNews: async (req, res) => {
        try {
            const { categoryId, title, author, city, about, date } = req.body;
            if (req.files.length > 0) {
                const category = await Category.findOne({ _id: categoryId });
                const newItem = {
                    categoryId: category._id,
                    title,
                    description: about,
                    author,
                    city,
                    date
                }
                const item = await Item.create(newItem);
                category.itemId.push({ _id: item._id });
                await category.save();
                for (let i = 0; i < req.files.length; i++) {
                    const imageSave = await Image.create({ imageUrl: `images/${req.files[i].filename}` });
                    item.imageId.push({ _id: imageSave._id });
                    await item.save();
                }
                req.flash('alertMessage', 'Success Add News');
                req.flash('alertStatus', 'success')
                res.redirect('/admin/news');
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/news');
        }
    },


    showImageNews: async (req, res) => {
        try {
            const { id } = req.params;
            const news = await Item.findOne({ _id: id })
                .populate({ path: 'imageId', select: 'id imageUrl' });
            // console.log(news.imageId);
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus };
            res.render('admin/news/view_news', { title: 'Berita | Show Image News', alert, news, action: 'show image' });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/news');
        }
    },


    showEditNews: async (req, res) => {
        try {
            const { id } = req.params;
            const news = await Item.findOne({ _id: id })
                .populate({ path: 'imageId', select: 'id imageUrl' })
                .populate({ path: 'categoryId', select: 'id name' })
            console.log(news);
            const category = await Category.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus };
            res.render('admin/news/view_news', { title: 'Berita | Edit Item', alert, news, action: 'edit', category });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/news');
        }
    },

    editNews: async (req, res) => {
        try {
            const { id } = req.params;
            const { categoryId, title, author, city, about, date } = req.body;
            const news = await Item.findOne({ _id: id })
                .populate({ path: 'imageId', select: 'id imageUrl' })
                .populate({ path: 'categoryId', select: 'id name' })

            if (req.files.length > 0) {
                for (let i = 0; i < news.imageId.length; i++) {
                    const imageUpdate = await Image.findOne({ _id: news.imageId[i].id });
                    await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`));
                    imageUpdate.imageUrl = `images/${req.files[i].filename}`;
                    await imageUpdate.save();
                }
                news.title = title;
                news.author = author;
                news.city = city;
                news.description = about;
                news.date = date;
                news.categoryId = categoryId
                await news.save()
                req.flash('alertMessage', 'Success update Item');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/news');
            } else {
                news.title = title;
                news.price = price;
                news.city = city;
                news.description = about;
                news.categoryId = categoryId
                await news.save()
                req.flash('alertMessage', 'Success update Item');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/news');
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/news');
        }
    },


    deleteNews: async (req, res) => {
        try {
            const { id } = req.params;
            const item = await Item.findOne({ _id: id }).populate('imageId');
            for (let i = 0; i < item.imageId.length; i++) {
                Image.findOne({ _id: item.imageId[i]._id }).then((image) => {
                    fs.unlink(path.join(`public/${image.imageUrl}`));
                    image.remove();
                }).catch((err) => {
                    req.flash('alertMessage', `${error.message}`);
                    req.flash('alertStatus', 'danger');
                    res.redirect('/admin/news');
                })
            }
            await item.remove();
            req.flash('alertMessage', 'Success Delete News');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/news');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/news');
        }
    },


    viewDetailItems: async (req, res) => {
        try {
            const { itemId } = req.params;
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus };
            const activity = await Activity.find({ itemId: itemId });
            const testimonial = await Testimonial.find({ itemId: itemId });
            res.render('admin/news/detail_news/view_detail_news', {
                title: 'Berita | Detail Item',
                alert,
                itemId,
                activity,
                testimonial
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/news/show-detail-news/${itemId}`);
        }
    },

    addTestimonial: async (req, res) => {
        const { name, review, rate, itemId } = req.body;
        try {
            if (!req.file) {
                req.flash('alertMessage', 'Image not found');
                req.flash('alertStatus', 'danger');
                res.redirect(`/admin/news/show-detail-news/${itemId}`);
            }
            const testimonial = await Testimonial.create({
                name,
                review,
                rate,
                itemId,
                imageUrl: `images/${req.file.filename}`
            });
            const item = await Item.findOne({ _id: itemId });
            item.testimonialId.push({ _id: testimonial._id })
            await item.save();
            req.flash('alertMessage', 'Success Add Testimonial');
            req.flash('alertStatus', 'success');
            res.redirect(`/admin/news/show-detail-news/${itemId}`);
        } catch (error) {
            res.redirect(`/admin/news/show-detail-news/${itemId}`);
        }
    },

    addActivity: async (req, res) => {
        const { name, type, itemId } = req.body;
        try {
            if (!req.file) {
                req.flash('alertMessage', 'Image not found');
                req.flash('alertStatus', 'danger');
                res.redirect(`/admin/news/show-detail-news/${itemId}`);
            }
            const activity = await Activity.create({
                name,
                type,
                itemId,
                imageUrl: `images/${req.file.filename}`
            });
            const item = await Item.findOne({ _id: itemId });
            item.activityId.push({ _id: activity._id })
            await item.save();
            req.flash('alertMessage', 'Success Add Activity');
            req.flash('alertStatus', 'success');
            res.redirect(`/admin/news/show-detail-news/${itemId}`);
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/news/show-detail-news/${itemId}`);
        }
    },

    editActivity: async (req, res) => {
        const { id, name, type, itemId } = req.body;
        try {
            const activity = await Activity.findOne({ _id: id });
            if (req.file == undefined) {
                activity.name = name;
                activity.type = type;
                await activity.save();
                req.flash('alertMessage', 'Success update activity');
                req.flash('alertStatus', 'success');
                res.redirect(`/admin/news/show-detail-news/${itemId}`);
            } else {
                await fs.unlink(path.join(`public/${activity.imageUrl}`));
                activity.name = name;
                activity.type = type;
                activity.imageUrl = `images/${req.file.filename}`
                await activity.save();
                req.flash('alertMessage', 'Success update activity');
                req.flash('alertStatus', 'success');
                res.redirect(`/admin/news/show-detail-news/${itemId}`);
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/news/show-detail-news/${itemId}`);
        }
    },

    deleteActivity: async (req, res) => {
        try {
            const { id, itemId } = req.params;
            const activity = await Activity.findOne({ _id: id });
            const item = await Item.findOne({ _id: itemId }).populate('activityId');
            for (let i = 0; i < item.activityId.length; i++) {
                if (item.activityId[i]._id.toString() === activity._id.toString()) {
                    item.activityId.pull({ _id: activity._id });
                    await item.save()
                }
            }
            await fs.unlink(path.join(`public/${activity.imageUrl}`));
            await activity.remove();
            req.flash('alertMessage', 'Success Delete activity');
            req.flash('alertStatus', 'success');
            res.redirect(`/admin/news/show-detail-news/${itemId}`);
        } catch (error) {
            console.log(error);
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/news/show-detail-news/${itemId}`);
        }
    }
}