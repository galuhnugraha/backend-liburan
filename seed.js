var seeder = require('mongoose-seed');
var mongoose = require('mongoose');

// Connect to MongoDB via Mongoose
seeder.connect('mongodb+srv://liburan:28agustus@cluster0.yxa8o.mongodb.net/db-liburan?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true
}, function () {

    seeder.loadModels([
        './models/Category',
        './models/Image',
        './models/Item',
    ]);

    // Clear specified collections
    seeder.clearModels(['Category', 'Image', 'Item'], function () {

        // Callback to populate DB once collections have been cleared
        seeder.populateModels(data, function () {
            seeder.disconnect();
        });

    });
});


