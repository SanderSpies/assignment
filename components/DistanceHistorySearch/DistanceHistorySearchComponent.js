'use strict';

var LocationService = require('../../services/LocationService');


/**
 * Component that searches in the user's previous entries.
 *
 * @param options
 * @constructor
 */
var DistanceHistorySearchComponent = function DistanceHistorySearchComponent(options) {
  var container = options.container;

  var searchInput = container.getElementsByClassName('DistanceHistorySearch-search-input')[0];
  searchResultsDiv = container.getElementsByClassName('DistanceHistorySearch-search-results')[0];

  searchInput.addEventListener('input', _onSearchInputChanged);
  searchResultsDiv.addEventListener('click', _onSearchResultsClick);
};

// private variables
var searchResultsDiv;
var eventListeners = {};

// public api
DistanceHistorySearchComponent.prototype = {

  on: function (eventName, callBack) {
    if (!eventListeners[eventName]) {
      eventListeners[eventName] = [];
    }
    eventListeners[eventName].push(callBack);
  }
};

// private functions

function _trigger(eventName, options) {
  var callbacks = eventListeners[eventName];
  for (var i = 0, l = callbacks.length; i < l; i++) {
    callbacks[i].call(null, options);
  }
}

function _onSearchInputChanged(e) {
  var resultsFragment = document.createDocumentFragment();
  var results = LocationService.findLocationsInCache(e.target.value);

  for(var i = 0, l = results.length; i < l; i++) {
    var location = results[i];
    var searchResultElement = document.createElement('li');
    searchResultElement.className = 'DistanceHistorySearch-search-result';
    searchResultElement.dataset.location = location;
    searchResultElement.innerHTML = location;
    resultsFragment.appendChild(searchResultElement);
  }

  // ensure dom writing only happens once
  searchResultsDiv.innerHTML = '';
  searchResultsDiv.appendChild(resultsFragment);
}

/**
 * Handle a click on a search result
 *
 * @param e
 * @private
 */
function _onSearchResultsClick(e) {
  _trigger('click:historyItem', e.target.dataset.location);
}

module.exports = DistanceHistorySearchComponent;