(function(window, undefined) {
  'use strict';

  var Affix = new Class({
    
    Implements: [Options, Events],
    
    VERSION: '3.3.5',
    _RESET: 'affix affix-top affix-bottom',
    
    options: {
      offset: 0,
      target: window
    },

    initialize: function (element, _options) {
      var self = this;

      self.setOptions(_options);
      
      self.$target = $(this.options.target);
      self.$target.addEvents({
        'scroll': self.checkPosition.bind(self),
        'click': self.checkPositionWithEventLoop.bind(self)
      });

      self.$element = $$(element)[0];
      self.affixed = null;
      self.unpin = null;
      self.pinnedOffest = null;
      self.$doc = $$(document)[0];
      self.$body = $$('body')[0];

      self.checkPosition();
    },

    getState: function (scrollHeight, height, offsetTop, offsetBottom) {
      var self = this;

      var scrollTop = self.$target.scrollY;
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

      self.$element.removeClass(self._RESET).addClass('affix');
      var scrollTop = self.$target.scrollY;
      var position  = self.$element.getPosition();

      return (self.pinnedOffset = position.y - scrollTop);
    },

    checkPositionWithEventLoop: function () {
      setTimeout(self.checkPosition, 1);
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
      var scrollHeight = Math.max(self.$doc.getSize().y, self.$body.getSize().y);

      if (typeof offset != 'object') {
        offsetBottom = offsetTop = offset;
      }
      
      if (typeof offsetTop == 'function') {
        offsetTop = offset.top(this.$element);
      }

      if (typeof offsetBottom == 'function') {
        offsetBottom = offset.bottom(this.$element);
      }

      console.log(offsetBottom);

      var affix = self.getState(scrollHeight, height, offsetTop, offsetBottom);

      console.log('affix', affix);
      console.log('affixed ', self.affixed);

      if (self.affixed != affix) {
        if (self.unpin != null) {
          self.$element.setStyle('top', '');
        }

        var affixType = 'affix' + (affix ? '-' + affix : '');

        self.affixed = affix;
        self.unpin = affix == 'bottom' ? self.getPinnedOffset() : null;

        console.log('affix inside', affix);
        console.log('affixed inside', self.affixed);

        self.$element.removeClass(self._RESET);
        self.$element.addClass(affixType);
      }

      if (affix == 'bottom') {
        this.$element.setPosition({
          y: scrollHeight - height - offsetBottom
        })
      }
    }

  });

  var el = $$('#the-row')[0];
  var header = $$('header')[0];
  var elInitialPosition = el.getPosition().y;
  var headerSize = header.getSize().y;

  new Affix('#the-row', {
    offset: {
      top: function() {
        return elInitialPosition - headerSize;
      },

      bottom: 2000
    }
  });

})(this);