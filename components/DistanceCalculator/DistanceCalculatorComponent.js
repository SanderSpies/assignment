'use strict';

// dependencies
var LocationService = require('../../services/LocationService');
var calculateDistance = require('../../external/calculateDistance');

/**
 * Component that tells the difference between the user's location and a point of interest.
 *
 * @param options
 * @constructor
 */
var DistanceCalculatorComponent = function DistanceCalculatorComponent(options) {
  console.assert(options && options.container && options.container instanceof HTMLElement,
    'An options:{container:HTMLElement} parameter is required');

  var container = options.container;

  // references to elements
  originDiv = container.getElementsByClassName('DistanceCalculator-origin')[0];
  destinationInput = container.getElementsByClassName('DistanceCalculator-destination-input')[0];
  distanceDiv = container.getElementsByClassName('DistanceCalculator-result')[0];
  var calculateDistanceButton = container.getElementsByClassName('DistanceCalculator-button')[0];

  // listen to the click event
  calculateDistanceButton.addEventListener('click', _onCalculateDistanceButtonClick);

  // retrieve the user's current location using the geolocation api (could be abstracted away nicer)
  navigator.geolocation.getCurrentPosition(_onCurrentPositionLoaded, _onCurrentPositionLoadError);
};

// we are not afraid of hoisting
var destinationInput;
var distanceDiv;
var originDiv;
var originCoordinates;
var destinationCoordinates;

// constants
var CURRENT_POSITION_ERROR_MSG = 'Could not retrieve your current position.';

// public
DistanceCalculatorComponent.prototype = {
  calculateLocationDistanceFor: function (location) {
    destinationInput.value = location;
    _calculateDistance(location);
  }
};

// private functions

/**
 * Handles the geography coordinates loaded event, and loads the location that belongs to the coordinates
 *
 * @param options
 * @private
 */
function _onCurrentPositionLoaded(options) {
  console.assert(options && options.coords, 'An options:{coords:{}} parameter is required');

  originCoordinates = options.coords;

  LocationService.getLocationByCoordinates(originCoordinates).then(
    function onResolve(formattedAddress) {
      _setOriginLocation(formattedAddress);
    },
    function onReject(msg) {
      alert(msg);
    }
  );
}

/**
 * In the case when the current position is not retrieved
 *
 * @private
 */
function _onCurrentPositionLoadError() {
  alert(CURRENT_POSITION_ERROR_MSG);
}

function _onCalculateDistanceButtonClick() {
  _calculateDistance(destinationInput.value);
}

/**
 * Calculate the distance between the users current location and the point of interest
 *
 * @private
 */
function _calculateDistance(pointOfInterest) {
  LocationService.getCoordinatesByLocation(pointOfInterest).then(
    function onResolve(coordinates) {
      destinationCoordinates = coordinates;
      _setResultText(
        calculateDistance(
          originCoordinates.latitude,
          originCoordinates.longitude,
          destinationCoordinates.lat,
          destinationCoordinates.lng
        )
      );
    },
    function onReject(msg) {
      alert(msg);
    }
  );
}

/**
 * Set the origin location
 *
 * @param location
 * @private
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