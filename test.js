var test = require('tape');
var lock = require('./monogamy');

test('monogamy', function(t) {
  t.plan(5);

  var countup = 0;
  var waitUntil = 500;

  var testfn = lock(function(done) {
    countup++;
    setTimeout(done, waitUntil);
  });

  var numberToTest = 1;
  var testfn2 = lock(function(num, done) {
    t.equal(num, numberToTest, 'monogamy passes arguments');
  });

  var testfn3 = lock(function(num, callback) {
    setTimeout(function() {
      callback(num * 2);
    }, waitUntil);
  });

  testfn2(numberToTest);

  var k = 0;

  var callbackCounter = 0;
  var callback = function(num) {
    callbackCounter++;
  };

  while (k++ < 10) {
    testfn();
    testfn2();
    testfn3(2, callback);
  }

  t.ok(testfn.locked, 'monogamy adds a `locked` property to the function');

  setTimeout(function() {
    testfn();
    t.equal(countup, 2, 'monogamy locks a function until unlocked');
  }, waitUntil + 100);

  setTimeout(function() {
    testfn3(2, function(double) {
      callbackCounter++;
      t.equal(double, 2*2, 'monogamy passes data to the callback fn');
      t.equal(callbackCounter, 2, 'monogamy treats callbacks as unlock functions');
    });
  }, waitUntil + 100);
});
