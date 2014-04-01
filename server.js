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

app.get('/API/v1/long', function (req, res) {

    var lon = 40;
    var lat = 5;

    Property.find({
        loc: {
            $near : {
                $geometry : {
                    type: "Point",
                    coordinates: [lon, lat]
                }
            },
            $maxdistance: 500
        }
    }, function (err, doc) {
        res.send(doc);
    });
});

app.get('/API/v1/:city', function (req, res) {

    // get the long and loc of city
    // make a geoSearch with the map box
    // and return the collection

    var addressFilter = new RegExp(req.params.city, "i");

    Property.find({ address: addressFilter },
        function (err, doc) {
            res.send(doc);
        });
});




var port = Number(process.env.PORT || 5000);
app.listen(port);