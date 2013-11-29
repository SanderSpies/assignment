'use strict';

var request = require('superagent');
var Promise = require('promise');

var coordsCaching = {};
var addressCaching = {};

var LocationService = {

  /**
   * Get the location by coordinates
   *
   * @param coords
   * @returns {Promise}
   */
  getLocationByCoords: function(coords) {
    return new Promise(function(resolve, reject){

      var latitude = coords.latitude;
      var longitude = coords.longitude;
      var latlng = latitude + ',' + longitude;

      if(coordsCaching[latlng]) {
        resolve(coordsCaching[latlng])
      }

      request.
        get('//maps.googleapis.com/maps/api/geocode/json?latlng=' + latlng + '&sensor=true').
        end(function(error, res) {
          if(error) {
            reject();
            return;
          }

          var formattedAddress = res.body.results[0].formatted_address;
          resolve(formattedAddress);

          coordsCaching[latlng] = formattedAddress;
        });
    });
  },

  /**
   * Get a location by address
   *
   * @param address {string}
   * @returns {Promise}
   */
  getLocationByAddress: function(address) {
    return new Promise(function(resolve, reject) {

      if(addressCaching[address]){
        resolve(addressCaching[address]);
        return;
      }

      request.
        get('//maps.googleapis.com/maps/api/geocode/json?address=' + address + '&sensor=true').
        end(function(error, res) {
          if(error) {
            reject();
            return;
          }

          var location = res.body.results[0].geometry.location;
          resolve(location);
          addressCaching[address] = location;
        });
    });
  }
};

module.exports = LocationService;