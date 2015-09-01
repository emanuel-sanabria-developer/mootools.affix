(function() {
  'use strict';

  function removeItem(array, item) {
    var index = array.indexOf(item);
    if (index >= 0) {
      array.splice(index, 1);
    }
  }
  
  Object.place('VUI.getFromPath', function(source, parts) {
    if (typeof parts === 'string') {
      parts = parts.split('.');
    }
    for (var i = 0, l = parts.length; i < l; i++) {
      var part = parts[i];
      var suffix = ']';
      if (part.indexOf(suffix, part.length - suffix.length) !== -1) {
        part = part.replace(']');
        var indexedParts = part.split('[');
        if (source.hasOwnProperty(indexedParts[0])) {
          var index = parseInt(indexedParts[1], 0);
          source = source[indexedParts[0]][index];
        } else {
          return null;
        }

      } else {
        if (source.hasOwnProperty(part)) {
          source = source[part];
        } else {
          return null;
        }
      }
    }
    return source;
  });

  Class('VUI.Destroyable', {
    initialize: function() {
      var self = this;
      self._recordedDestroyables = [];
      self._recordedEventHandles = [];
    },

    record: function(destroyable) {
      var self = this;
      if (typeOf(destroyable) === 'array') {
        self._recordedDestroyables.append(arguments);
      } else {
        self._recordedDestroyables.push(destroyable);
      }
      return destroyable;
    },

    erase: function(destroyable) {
      var self = this;

      destroyable.destroy();
      removeItem(self._recordedDestroyables, destroyable);
    },

    addRecordedEvent: function(target, type, fn) {
      var self = this;

      target.addEvent(type, fn);

      self._recordedEventHandles.push({
        target: target,
        type: type,
        fn: fn
      });
    },

    eraseEvent: function(target, type, fn) {
      var self = this;

      target.removeEvent(type, fn);

      var eventHandle = self._recordedEventHandles.find(function(eventHandle) {
        return eventHandle.target === target && eventHandle.type === type && eventHandle.fn === fn;
      });
      removeItem(self._recordedEventHandles, eventHandle);
    },

    eraseAll: function() {
      var self = this;

      self._recordedDestroyables.each(function(destroyable) {
        if (destroyable.destroy) {
          destroyable.destroy();
        }
      });

      self._recordedEventHandles.each(function(eventHandle) {
        eventHandle.target.removeEvent(eventHandle.type, eventHandle.fn);
      });

      self._recordedDestroyables = [];
      self._recordedEventHandles = [];
    }
  });

  function removeOn(string) {
    return string.replace(/^on([A-Z])/, function(full, first) {
      return first.toLowerCase();
    });
  }

  Class('VUI.CatchUpEvents', {
    Extends : Events,
    fireEvent : function fireEvent(type, args, delay) {
      type = removeOn(type);

      if (!this.$catchup) {
        this.$catchup = {};
      }

      this.$catchup[type] = {
        args : args,
        delay : delay || 0
      };

      return this.parent(type, args, delay || 1);
    },

    addEvent : function(type, fn) {
      type = removeOn(type);

      if (/:catchup/.test(type)) {
        type = type.replace(':catchup', '');

        if (this.$catchup && this.$catchup[type]) {
          fn.delay(this.$catchup[type].delay, this, this.$catchup[type].args);
        }
      }
      return this.parent(type, fn);
    },

    removeEvent : function(type, fn) {
      type = removeOn(type);

      if (/:catchup/.test(type)) {
        type = type.replace(':catchup', '');
      }

      return this.parent(type, fn);
    }
  });
})();
