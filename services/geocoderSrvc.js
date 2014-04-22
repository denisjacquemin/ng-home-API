var geocoder = require('geocoder');

exports.geocodeByCity = function(city) {

    console.log('geocodeByCity for: ' + city);

    var lonlat = {};
    geocoder.geocode(city, function (err, data) {
        if (data !== undefined && data.status == 'OK') {
            console.log('status ok');
            lonlat = data.results[0].geometry.location;
            return lonlat;
        }
        else {
            console.log(err);
            return {err: err.message};
        }
    });
};