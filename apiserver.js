/*global require */
/*jslint node: true */

var express = require("express");
var mongoose = require('mongoose');
var cors = require("cors");
var geoip = require('geoip');

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

app.get('/API/v1/geo', function (req, res) {

    var lon = req.param('lon');
    var lat = req.param('lat');
    var lonlat = {
        $geometry: {
            type: "Point",
            coordinates: [lon, lat]
        }
    };

    Property.find({
        loc: {
            $near : lonlat,
            $maxDistance: 5000
        }
    }, function (err, doc) {
        res.send(doc);
    });
});

app.get('/API/v1/curloc', function (req, res) {
    var ip = req.connection.remoteAddress;
    var edition = geoip.check('maxmind/GeoLiteCity.dat');
    console.log(edition);

    var City = geoip.City;
    var city = new City('maxmind/GeoLiteCity.dat');
    var city_obj = city.lookupSync(ip);
    console.log(city_obj);

    res.send(city_obj);
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