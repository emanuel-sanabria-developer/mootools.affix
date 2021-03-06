/* ========================================================================
 * This is a port for Mootools of the original Boostrap affix.js jQuery plugin 3.3.5
 * TODO: add an acctual attribution msg
 * 
 * ======================================================================== */

(function() {
  'use strict';

  Class('Affix', {
    
    Implements: [Options, Events],
    
    VERSION: '3.3.5',
    
    options: {
      offset: 0,
      target: window
    },

    initialize: function (element, options) {
      var self = this;

      self.setOptions(options);
      
      self.$target = $(this.options.target);
      self.$target.addEvents({
        'scroll': self.checkPosition.bind(self),
        'click': self.checkPositionWithEventLoop.bind(self)
      });

      self.$element = document.getElement(element);
      self.affixed = null;
      self.unpin = null;
      self.pinnedOffest = null;
      self.$body = document.getElement('body');

      self.checkPosition();
    },

    getState: function (scrollHeight, height, offsetTop, offsetBottom) {
      var self = this;

      var scrollTop = self.$target.getScroll().y;
      var position = self.$element.getPosition();
      var targetHeight = self.$target.getSize().y;

      if (offsetTop != null && self.affixed == 'top') {
        return scrollTop < offsetTop ? 'top' : false;
      }

      if (self.affixed == 'bottom') {
        if (offsetTop != null) {
          return (scrollTop + self.unpin <= position.y) ? false : 'bottom';
        }
        return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom';
      }

      var initializing   = self.affixed == null;
      var colliderTop    = initializing ? scrollTop : position.y;
      var colliderHeight = initializing ? targetHeight : height;

      if (offsetTop != null && scrollTop <= offsetTop) {
        return 'top';
      }

      if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) {
        return 'bottom';
      }

      return false
    },

    getPinnedOffset: function () {
      var self = this;

      if (self.pinnedOffset) {
        return self.pinnedOffset;
      }

      self.resetClasses();
      self.$element.addClass('affix');
      var scrollTop = self.$target.getScroll().y;
      var position  = self.$element.getPosition();

      return (self.pinnedOffset = position.y - scrollTop);
    },

    checkPositionWithEventLoop: function () {
      var self = this;
      setTimeout(self.checkPosition.bind(this), 0);
    },

    checkPosition: function () {
      var self = this;

      if (!self.$element.isDisplayed()) {
        return;
      }

      var height       = self.$element.getSize().y;
      var offset       = self.options.offset;
      var offsetTop    = offset.top;
      var offsetBottom = offset.bottom;
      var scrollHeight = Math.max(document.getScrollSize().y, self.$body.getScrollSize().y);

      if (typeof offset != 'object') {
        offsetBottom = offsetTop = offset;
      }
      
      if (typeof offsetTop == 'function') {
        offsetTop = offset.top(this.$element);
      }

      if (typeof offsetBottom == 'function') {
        offsetBottom = offset.bottom(this.$element);
      }

      var affix = self.getState(scrollHeight, height, offsetTop, offsetBottom);

      if (self.affixed != affix) {
        if (self.unpin != null) {
          self.$element.setStyle('top', '');
        }

        var affixType = 'affix' + (affix ? '-' + affix : '');

        self.affixed = affix;
        self.unpin = affix == 'bottom' ? self.getPinnedOffset() : null;

        self.resetClasses();
        self.$element.addClass(affixType);
      }

      if (affix == 'bottom') {
        this.$element.setPosition({
          y: scrollHeight - height - offsetBottom
        })
      }
    },

    resetClasses: function() {
      this.$element.removeClass('affix');
      this.$element.removeClass('affix-top');
      this.$element.removeClass('affix-bottom');
    }

  });

  // AFFIX DATA-API
  // ==============

  window.addEvent('domready', function() {
    $$('[data-spy="affix"]').each(function ($el) {
      var data = {
        offset: {
          top: $el.get('data-offset-top') || null,
          bottom: $el.get('data-offset-bottom') || null
        }
      };

      new Affix($el, data);
    })
  });

})();