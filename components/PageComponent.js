'use strict';

var DistanceCalculatorComponent = require('./DistanceCalculatorComponent');

/**
 * Starting point of the application, not much happening here
 */
var PageComponent = {

  /**
   * Starting point for the page
   */
  initialize: function() {

    // distance component
    new DistanceCalculatorComponent({container: document.getElementById('DistanceCalculator')});
  }

};

PageComponent.initialize();

module.exports = PageComponent;