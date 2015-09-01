/* global VUI */

(function() {
  'use strict';

  Class('VUI.Affix', {
    
    Extends: Affix,

    Binds: ['updateWrapperMinHeight', 'disable', 'enable'],

    initialize: function (element, options) {
      this.parent(element, options);
      
      this.$target.addEvent('resize', self.updateWrapperMinHeight);
    },

    checkPosition: function () {
      if (this.$element.hasClass('affix-disabled')) {
        return;
      }

      this.parent();
      
      this.updateWrapperMinHeight();
    },

    updateWrapperMinHeight: function() {
      var self = this;
      var $elementParent = self.$element.getParent('.affix-wrapper');

      if ($elementParent) {
        var currentHeight = self.$element.getSize().y;
        
        $elementParent.setStyle('min-height', currentHeight);
      }
    },

    disable: function(callback) {
      var self = this;

      self.$element.addClass('affix-disabled');
      self.resetClasses();
      self.affixed = null;

      if (typeof callback === 'function') {
        callback(self.$element);
      } else {
        window.scrollTo(0, 0);
      }
    },

    enable: function(callback) {
      var self = this;

      self.$element.removeClass('affix-disabled');
      self.affixed = null;

      if (typeof callback === 'function') {
        callback(self.$element);
      } else {
        window.scrollTo(0, 0);
      } 
    }
    
  });

})();