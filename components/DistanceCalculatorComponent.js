'use strict';

// dependencies
var LocationService = require('../services/LocationService');
var calculateDistance = require('../external/calculateDistance');

// constructor
var DistanceCalculatorComponent = function DistanceCalculatorComponent(options) {
  console.assert(options && options.container && options.container instanceof HTMLElement,
    'An options:{container:HTMLElement} parameter is required');

  var container = options.container;

  // references to elements
  originDiv = container.getElementsByClassName('DistanceCalculator-origin')[0];
  destinationInput = container.getElementsByClassName('DistanceCalculator-destination-input')[0];
  distanceDiv = container.getElementsByClassName('DistanceCalculator-result')[0];
  calculateDistanceButton = container.getElementsByClassName('DistanceCalculator-button')[0];
  historyDiv = container.getElementsByClassName('DistanceCalculator-history')[0];

  // listen to the click event
  calculateDistanceButton.addEventListener('click', _onCalculateDestinationClick.bind(this));

  // retrieve the user's current location using the geolocation api
  navigator.geolocation.getCurrentPosition(_onGeographyCoordinatesLoaded.bind(this));
};

var destinationInput;
var distanceDiv;
var calculateDistanceButton;
var historyDiv;
var originDiv;
var originCoordinates;
var destinationCoordinates;

/**
 * Handles the geography coordinates loaded event, and loads the location that belongs to the coordinates
 *
 * @param options
 * @private
 */
function _onGeographyCoordinatesLoaded(options) {
  console.assert(options && options.coords, 'An options:{coords:{}} parameter is required');

  originCoordinates = options.coords;

  var self = this;
  LocationService.getLocationByCoordinates(originCoordinates).then(
    function onResolve(formattedAddress){
      _setOriginLocation(formattedAddress);
    },
    function onReject(msg) {
      alert(msg);
    }
  );
}

/**
 * Calculate the distance between the origin and destination
 *
 * @param options
 * @private
 */
function _onCalculateDestinationClick() {
  var self = this;
  LocationService.getCoordinatesByLocation(destinationInput.value).then(
    function onResolve(res){
      destinationCoordinates = res;
      _setResultText(
        calculateDistance(
          originCoordinates.latitude,
          originCoordinates.longitude,
          destinationCoordinates.lat,
          destinationCoordinates.lng
        )
      );
    },
    function onReject(msg){
      alert(msg);
    }
  );
}

/**
 * Set the input field to the history item, and 'press' the button for the user
 *
 * @private
 */
function _onHistoryItemClick() {

}

/**
 * Set the origin location
 *
 * @param location
 */
function _setOriginLocation(location) {
  console.assert(location && typeof location === 'string', 'A location:string parameter is required');

  originDiv.innerHTML = location;
}

/**
 * Set the distance text
 *
 * @param result
 * @private
 */
function _setResultText(result) {
  console.assert(result && typeof result === 'number', 'A result:number parameter is required');

  distanceDiv.innerHTML = Math.round(result) + "km";
}

module.exports = DistanceCalculatorComponent;