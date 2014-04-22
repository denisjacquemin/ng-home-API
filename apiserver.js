/*global require */
/*jslint node: true */

var express = require("express");
var mongoose = require('mongoose');
var cors = require("cors");
var geoip = require('geoip');
//var geocoder = require('geocoder');
var geocoderSrvc = require('./services/geocoderSrvc');


var mongoUri = process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/home';

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
    console.log('/API/v1/geo' + ' lon: ' + req.param('lon') + ' lat: ' + req.param('lat'));

    var lon = req.param('lon');
    var lat = req.param('lat');

    // if lon lat not provided, get them from google service
    if (req.param('lon') === undefined || req.param('lat') === undefined) {
        lonlatByCity = geocoderSrvc.geocodeByCity(req.params.city);
        lon = lonlatByCity.lon;
        lat = lonlatByCity.lat;
    }

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

app.get('/API/v1/lonlat/:city', function (req, res) {

    res.json(geocoderSrvc.geocodeByCity(req.params.city));

});

app.get('/API/v1/curloc', function (req, res) {
    var ip = req.connection.remoteAddress;
    var edition = geoip.check('maxmind/GeoLiteCity.dat');
    console.log(edition);

    var City = geoip.City;
    var city = new City('maxmind/GeoLiteCity.dat');
    var city_obj = city.lookupSync('10.164.75.96');
    console.log('ip: ' + ip);
    console.log(city_obj);

    res.send(city_obj);
});


app.get('/API/v1/:city', function (req, res) {
    console.log('/API/v1/:city' + ' city: ' + req.params.city);
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