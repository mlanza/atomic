define(function(){

  if(!String.prototype.trimLeft) {
    String.prototype.trimLeft = function() {
      return this.replace(/^\s+/,"");
    }
  }

  if(!String.prototype.trimRight) {
    String.prototype.trimRight = function() {
      return this.replace(/\s+$/,"");
    }
  }

  if (!String.prototype.repeat) {
    String.prototype.repeat = function(count) {
      'use strict';
      if (this == null) {
        throw new TypeError('can\'t convert ' + this + ' to object');
      }
      var str = '' + this;
      count = +count;
      if (count != count) {
        count = 0;
      }
      if (count < 0) {
        throw new RangeError('repeat count must be non-negative');
      }
      if (count == Infinity) {
        throw new RangeError('repeat count must be less than infinity');
      }
      count = Math.floor(count);
      if (str.length == 0 || count == 0) {
        return '';
      }
      if (str.length * count >= 1 << 28) {
        throw new RangeError('repeat count must not overflow maximum string size');
      }
      var maxCount = str.length * count;
      count = Math.floor(Math.log(count) / Math.log(2));
      while (count) {
        str += str;
        count--;
      }
      str += str.substring(0, maxCount - str.length);
      return str;
    }
  }

  if (!String.prototype.padStart) {
    String.prototype.padStart = function(targetLength, padString) {
      targetLength = targetLength>>0;
      padString = String((typeof padString !== 'undefined' ? padString : ' '));
      if (this.length > targetLength) {
        return String(this);
      }
      else {
        targetLength = targetLength-this.length;
        if (targetLength > padString.length) {
            padString += padString.repeat(targetLength/padString.length);
        }
        return padString.slice(0,targetLength) + String(this);
      }
    }
  }

  if (!String.prototype.padEnd) {
    String.prototype.padEnd = function(targetLength, padString) {
      targetLength = targetLength>>0;
      padString = String((typeof padString !== 'undefined' ? padString : ' '));
      if (this.length > targetLength) {
        return String(this);
      }
      else {
        targetLength = targetLength-this.length;
        if (targetLength > padString.length) {
            padString += padString.repeat(targetLength/padString.length);
        }
        return String(this) + padString.slice(0,targetLength);
      }
    }
  }

  if (!Element.prototype.matches && document.querySelectorAll) {
    Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function(s) {
      var matches = (this.document || this.ownerDocument).querySelectorAll(s),
          i = matches.length;
      while (--i >= 0 && matches.item(i) !== this) {}
      return i > -1;
    };
  }

  if (!window.location.origin) {
    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
  }

  if (!Object.assign) {
    Object.assign = function(dest, src){
      var to = Object(dest);
      for (var idx = 1; idx < arguments.length; idx++) {
        var source = Object(arguments[idx]);
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            to[key] = source[key];
          }
        }
      }
      return to;
    };
  }

  if (!Object.values) {
    Object.values = function(obj)  {
      return Object.keys(obj).map(function(key) {
        return obj[key];
      });
    }
  }

  if (typeof window.CustomEvent !== "function") {

    function CustomEvent(name, options) {
      options = Object.assign({bubbles: false, cancelable: false}, options || {});
      var e = document.createEvent('CustomEvent');
      e.initCustomEvent(name, options.bubbles, options.cancelable, options.detail);
      return e;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
  }

});