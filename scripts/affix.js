/* global ko, VUI */

(function() {
  'use strict';

  Class('VUI.AffixBindingHandler', {

    Depends: ['AffixController'],
    
    Binds: ['init', 'update'],

    init: function(element, valueAccessor) {
      var self = this;
      var options = ko.utils.unwrapObservable(valueAccessor());
      
      self.AffixController.create(element, options);
    },

    update: function(element, valueAccessor) {
      var self = this;
      var options = ko.utils.unwrapObservable(valueAccessor());
      
      if (options.disable) {
        self.AffixController.disableAffix(options.name);
      } else {
        self.AffixController.enableAffix(options.name);
      }

      if (options.updateHeight) {
        self.AffixController.updateHeight(options.name);
      }
    }
    
  });

  ko.bindingHandlers.vuiAffix = new VUI.AffixBindingHandler();

})();