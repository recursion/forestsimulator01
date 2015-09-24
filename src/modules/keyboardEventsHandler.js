// object for tracking keypress and release
let KeyboardEventsHandler = function() {
  var o = {};
  o.keys = [];
  o.keysPressed = function(e) {
    // store an entry for every key pressed
    o.keys[e.keyCode] = true;
  };

  o.keysReleased = function(e) {
    // mark keys that were released
    o.keys[e.keyCode] = false;
  };

  return o;
};
export {KeyboardEventsHandler};
