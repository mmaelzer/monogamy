monogamy
========

Lock a function until a provided `unlock` function is called. If a callback is provided, the callback will assume the roll of the `unlock` function. Supports CommonJS/AMD/VanillaJS.  
  
The returned wrapped function provides a `locked` property so that you can test if a function is locked.

Install
-------
### npm
```
npm install monogamy
```

### bower
```
bower install monogamy
```

Example
-------
```javascript
var lock = require('monogamy');
var $ = require('jquery');

// Prevent fetching of pi from the server until the first
// request finishes.
var onClick = lock(function(e, unlock) {
  $.get('/all-digits-of-pi', function(pi) {
    // Oh look, we have the full value of pi.
    // I'm sure this will end well.
    alert(pi);
    // And now onClick can be called again
    unlock();
  });
});

$('#get-pi-button').on('click', onClick);
```

Contrived example
-----------------
```javascript
var lock = require('monogamy');
var fs = require('fs');

var write = lock(fs.writeFile);

write('foo.txt', Date.now(), function(err) {
  console.log(write.locked)
  // false

  // The callback takes the place of the unlock function
});

console.log(write.locked);
// true
```
