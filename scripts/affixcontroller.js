/* global ko, VUI */

(function() {
  'use strict';

  Class('VUI.AffixController', {
    
    Binds: ['disableAffix', 'enableAffix', 'updateHeight', 'getInstance'],

    InjectAs: {
      name: 'AffixController',
      singleton: true
    },

    _instances: {},

    initialize: function() {
      var self = this;
      self._registerEvents();
    },

    create: function(element, options) {
      var self = this;

      if (!self._instances[options.name]) {
        self._instances[options.name] = new VUI.Affix(element, options);
      }
    },

    getInstance: function(name) {
      var self = this;
      return self._instances[name];
    },

    disableAffix: function(name) {
      var self = this;
      self._instances[name].disable();
    },

    enableAffix: function(name) {
      var self = this;
      self._instances[name].enable();
    },

    updateHeight: function(name) {
      var self = this;
      self._instances[name].updateWrapperMinHeight();
    },

    _registerEvents: function() {
      var self = this;
      
      window.addEvents({
        'affix.height.update': self.updateHeight,
        'affix.disable': self.disableAffix,
        'affix.enable': self.enableAffix
      });
    }
    
  });

})();