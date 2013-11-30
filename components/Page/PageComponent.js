'use strict';

// this could be more advanced, but for now this will do

// dependencies
var DistanceCalculatorComponent = require('../DistanceCalculator/DistanceCalculatorComponent');
var DistanceHistorySearchComponent = require('../DistanceHistorySearch/DistanceHistorySearchComponent');

// instances of components
var distanceCalculatorComponent = new DistanceCalculatorComponent({container: document.getElementById('DistanceCalculator')});
var historySearchComponent = new DistanceHistorySearchComponent({container: document.getElementById('DistanceHistorySearch')});

// small piece of interaction between the two components
historySearchComponent.on('click:historyItem', function (location) {
  distanceCalculatorComponent.calculateLocationDistanceFor(location);
});