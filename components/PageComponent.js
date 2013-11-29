'use strict';

var DistanceCalculatorComponent = require('./DistanceCalculatorComponent');

var distanceCalculatorComponent;

/**
 * There can only be one. Page, that is.
 *
 */
var PageComponent = {

  initialize: function() {
    var container = document.body;

    // distance component
    distanceCalculatorComponent = new DistanceCalculatorComponent({container: document.getElementById('DistanceCalculator')});
    // distanceCalculatorComponent.on('calculateDistance', _onCalculateDestinationClick.bind(this));
    // distanceCalculatorComponent.on('calculateDistance', _onCalculateDestinationClick.bind(this));
  }

};

function _onCalculateDestinationClick() {
  // set stuff on the distance calculator
}

function _onHistoryItemClick() {
  // perform magic
}


PageComponent.initialize();

module.exports = PageComponent;