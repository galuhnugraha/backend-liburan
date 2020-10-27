const Category = require('../models/Category');
const Item = require('../models/Item');
const Image = require('../models/Image');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    viewDashboard: (req, res) => {
        res.render('admin/dashboard/view_dashboard', {
            title: "Berita | Dashboard"
        });
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
            await Category.create({ name });
            req.flash('alertMessage', 'Success add category');
            req.flash('alertStatus', 'success')
            res.redirect('/admin/category');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/category');
        }

    },

    editCategory: async (req, res) => {
        try {
            const { id, name } = req.body;
            const category = await Category.findOne({ _id: id });
            category.name = name;
            await category.save()
            req.flash('alertMessage', 'Success Update Category');
            req.flash('alertStatus', 'success')
            res.redirect('/admin/category');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/category');
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const { id } = req.params;
            const category = await Category.findOne({ _id: id });
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
            res.render('admin/news/view_news', { title: 'Berita | Show Image News', alert, news, action: 'show image'});
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

}