const Item = require('../models/Item');
const Category = require('../models/Category');
// const { path } = require('../app');



module.exports = {
    landingPage: async (req, res) => {
        try {
            const landingPage = await Item.find()
                .select('_id title country city author date imageId')
                .limit(5)
                .populate({ path: 'imageId', select: '_id imageUrl' })

            const category = await Category.find()
                .select('_id name')
                .limit(5)
                .populate({
                    path: 'itemId',
                    select: '_id title country city author date isPopular imageId',
                    perDocumentLimit: 4,
                    populate: {
                        path: 'imageId',
                        select: '_id imageUrl',
                        perDocumentLimit: 1
                    }
                })

            for (let i = 0; i < category.length; i++) {
                for (let x = 0; x < category[i].itemId.length; x++) {
                    const item = await Item.findOne({ _id: category[i].itemId[x]._id });
                    item.isPopular = false;
                    await item.save();
                    if (category[i].itemId[0] === category[i].itemId[x]) {
                        item.isPopular = true;
                        await item.save();
                    }
                }
            }

            res.status(200).json({
                landingPage,
                category,
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }
};