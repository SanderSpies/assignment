'use strict';

// dependencies
var request = require('superagent');
var Promise = require('promise');

// constants
var NO_CONNECTION_ERROR = 'Something went wrong, are you still connected to the internet?';
var UNKNOWN_LOCATION = 'The entered location is unknown.';
var UNKNOWN_COORDS = 'This should not happen.';

// privates
var cache = {};

/**
 * The LocationService retrieves location information from Google services
 *
 * @type {{getLocationByCoordinates: Function, getCoordinatesByLocation: Function}}
 */
var LocationService = {

  /**
   * Get the location by coordinates
   *
   * @param coords
   * @returns {Promise}
   */
  getLocationByCoordinates: function (coords) {
    console.assert(coords && coords.latitude && coords.longitude,
      'A coordinates object is expected as parameter, with latitude and longitude fields');
    console.assert(typeof coords.latitude === 'number' && typeof coords.longitude === 'number',
      'Coordinates is expected to have the format: {latitude:number, longitude:number}');

    return new Promise(function (resolve, reject) {
      var latitude = coords.latitude;
      var longitude = coords.longitude;
      var latlng = latitude + ',' + longitude;

      // retrieve the location from Google
      request.
        get('//maps.googleapis.com/maps/api/geocode/json?latlng=' + latlng + '&sensor=true').
        end(function (error, res) {
          if (error) {
            reject(NO_CONNECTION_ERROR);
            return;
          }

          var results = res.body.results;
          // check if there are locations available
          if (results.length) {
            var formattedAddress = results[0].formatted_address;
            resolve(formattedAddress);
          }
          else {
            reject(UNKNOWN_COORDS);
          }
        });
    });
  },

  /**
   * Get coordinates by location
   *
   * @param location {string}
   * @returns {Promise}
   */
  getCoordinatesByLocation: function (location) {
    console.assert(typeof location === 'string', 'Location should be a string');

    return new Promise(function (resolve, reject) {

      // if we have the data already available, serve it from the cache
      if (cache[location]) {
        resolve(cache[location]);
        return;
      }

      // retrieve the coordinates from Google
      request.
        get('//maps.googleapis.com/maps/api/geocode/json?address=' + location + '&sensor=true').
        end(function (error, res) {

          if (error) {
            reject(NO_CONNECTION_ERROR);
            return;
          }

          var results = res.body.results;
          if (results.length) {
            var coordinates = results[0].geometry.location;

            resolve(coordinates);

            // put the results into the cache
            cache[location] = coordinates;
          }
          else {
            // probably more sophisticated situations exist, but for now this will do
            reject(UNKNOWN_LOCATION);
          }
        });
    });
  },

  /**
   * Find location in cache
   *
   * @param searchTxt
   * @returns {Array}
   */
  findLocationsInCache: function (searchTxt) {
    var cachedLocations = Object.keys(cache);

    return cachedLocations.filter(function(location){
      return location.indexOf(searchTxt) > -1;
    });
  }

};

module.exports = LocationService;