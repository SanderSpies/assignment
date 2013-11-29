'use strict';

var LocationService = require('../services/LocationService');
var calculateDistance = require('../external/calculateDistance');

var DistanceCalculatorComponent = function DistanceCalculatorComponent(options) {
  this.initialize(options);
};

var eventListeners = {};
var locationInput;
var resultDiv;
var searchButton;
var historyDiv;
var originDiv;
var originCoords;
var destinationCoords;

DistanceCalculatorComponent.prototype = {

  initialize: function(options) {
    var container = options.container;

    originDiv = container.getElementsByClassName('DistanceCalculator-origin')[0];
    locationInput = container.getElementsByClassName('DistanceCalculator-destination-input')[0];
    resultDiv = container.getElementsByClassName('DistanceCalculator-result')[0];
    searchButton = container.getElementsByClassName('DistanceCalculator-button')[0];
    historyDiv = container.getElementsByClassName('DistanceCalculator-history')[0];

    searchButton.addEventListener('click', _onCalculateDestinationClick.bind(this));

    navigator.geolocation.getCurrentPosition(_onGeographyCoordinatesLoaded.bind(this));
  },

  /**
   * Simple event mechanism
   */
  on: function(eventName, callBack) {
    if(!eventListeners[eventName]) {
      eventListeners[eventName] = []
    }

    eventListeners[eventName].push(callBack);
  },

  /**
   * Set the origin location
   *
   * @param location
   */
  setOriginLocation: function (location) {
    originDiv.innerHTML = location;
  },

  setResultText: function (result) {
    resultDiv.innerHTML = result;
  }

};

function _trigger (eventName, options) {
  var callbacks = eventListeners[eventName];
  for(var i = 0, l = callbacks.length; i < l; i++) {
    callbacks[i].call(null, options);
  }
}

function _onGeographyCoordinatesLoaded(options) {

  originCoords = options.coords;

  var self = this;
  LocationService.getLocationByCoords(options.coords).then(
    function onResolve(formattedAddress){
      self.setOriginLocation(formattedAddress);
    },
    function onReject() {
      console.log('Show error message here');
    }
  );
}

function _onCalculateDestinationClick(options) {
  var self = this;
  LocationService.getLocationByAddress(locationInput.value).then(
    function onResolve(res){
      destinationCoords = res;

      self.setResultText(calculateDistance(originCoords.latitude, originCoords.longitude,
        destinationCoords.lat, destinationCoords.lng))
    },
    function onReject(){
      console.log('oh noes!');
    }
  );
  // set stuff on the distance calculator
}

function _onHistoryItemClick() {
  // perform magic
}

module.exports = DistanceCalculatorComponent;