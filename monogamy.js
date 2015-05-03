(function() {

  /**
   * @param {Function} fn - the function to lock
   * @param {Object=} opt_context - an optional context to provide to the fn
   * @returns {Function}
   */
  function monogamy(fn, opt_context) {
    var unlock = function() {
      wrapped.locked = false;
    };

    function wrapped() {
      if (wrapped.locked) return;
      wrapped.locked = true;

      var args = [], i;
      for (i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
      }

      // The case where a callback is provide and we use
      // that as the 'unlock' function
      if (typeof args[args.length - 1] === 'function') {
        var callback = args.pop();
        args.push(function() {
          var cbargs = [], j;
          // What's the point of this you might ask.
          // Well, it's a minor optimization for V8.
          // Does that matter? Probably not, but let's do it anyway
          for (j = 0; j < arguments.length; j++) {
            cbargs.push(arguments[j]);
          }
          unlock();
          callback.apply(null, cbargs);
        });
      }
      // No callback passed? Provide an 'unlock' function
      // as the last argument to the provided fn
      else {
        args.push(unlock);
      }

      return fn.apply(opt_context || this, args);
    }

    return wrapped;
  }

  // CommonJS/node.js support
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = monogamy;
    }
    exports.monogamy = monogamy;
  } else {
    // No module loader
    this.monogamy = monogamy;
  }

  // AMD/Require.js support
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return monogamy;
    });
  }
}).call(this);
