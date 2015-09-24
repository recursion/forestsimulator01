// object for tracking keypress and release
export class KeyboardEventsHandler {
  constructor() {
    this.keys = [];
  }
  keysPressed(e) {
    // store an entry for every key pressed
    this.keys[e.keyCode] = true;
  }

  keysReleased(e) {
    // mark keys that were released
    this.keys[e.keyCode] = false;
  }

}
