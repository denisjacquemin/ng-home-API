/*global require */
/*jslint node: true */

var express = require("express");
var mongoose = require('mongoose');
var cors = require("cors");

var mongoUri = process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/simple';

mongoose.connect(mongoUri);

var propertySchema = mongoose.Schema({

    title: String,
    description: String,
    price: String,
    bedroomcount: String,
    address: String,
    urlid: String,
    latitude: String,
    longitude: String

});

var Property = mongoose.model('Property', propertySchema, 'properties');

var app = express().use(cors());

app.get('/API/v1/:city', function (req, res) {
    var addressFilter = new RegExp(req.params.city, "i");

    Property.find({ address: addressFilter },
        function (err, doc) {
            res.send(doc);
        });
});
var port = Number(process.env.PORT || 5000);
app.listen(port);