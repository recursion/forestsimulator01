"use strict";

import {KeyboardEventsHandler} from './keyboardEventsHandler.js';
import {Mob} from './mob.js';
import {Map} from './map.js';

const TILESIZE = 16;
// create a game module for handling boilerplate
// game stuff (init, load assets, switch levels?
export class Game{

  constructor(){
    // set up our screen
    // we are using the shorthand 'canvas' to define
    // the surface we are drawing on, whether its svg, canvas, webgl or whatever
    this.canvas = document.getElementById("canvas");
    this.setCanvasSize();

    // create a new map
    this.map = new Map(this.canvas, TILESIZE);

    // instantiate our keyboard event handler
    // this simply keeps track of what keys are currently pressed
    this.keyboardEventsHandler = new KeyboardEventsHandler();

    // add event listeners
    window.addEventListener("keydown", this.keyboardEventsHandler.keysPressed.bind(this.keyboardEventsHandler), false);
    window.addEventListener("keyup", this.keyboardEventsHandler.keysReleased.bind(this.keyboardEventsHandler), false);
    window.addEventListener("resize", this.setCanvasSize, false);

    disableScroll();

    // load assets
    this.player = new Mob(this.map, 8, 8, "white");

  }

  /*
   * Checks the games keyboardEventsHandler object
   * and adjusts player direction accordingly
   */
  processPlayerInput() {
    // TODO: These should be generic and configurable
    // up (w)
    if (this.keyboardEventsHandler.keys[87]) {
      this.player.dy = -TILESIZE;
    }

    // left (a)
    if (this.keyboardEventsHandler.keys[65]) {
      this.player.dx = -TILESIZE;
    }

    // right (d)
    if (this.keyboardEventsHandler.keys[68]) {
      this.player.dx = TILESIZE;
    }

    // x
    if (this.keyboardEventsHandler.keys[88]) {
    }

    // down (s)
    if (this.keyboardEventsHandler.keys[83]) {
      this.player.dy = TILESIZE;
    }

    if (!this.keyboardEventsHandler.keys[87] && !this.keyboardEventsHandler.keys[83]){
      this.player.dy = 0;
    }
    if (!this.keyboardEventsHandler.keys[65] && !this.keyboardEventsHandler.keys[68]){
      this.player.dx = 0;
    }
    // jump space
    if (this.keyboardEventsHandler.keys[32]) {
      var p = this.player;
      if (!p.jumping) {
        p.jumping = true;
        p.el
          .transition()
          .duration(100)
          .attr("y",  ' ' + (+p.el.attr("y") - 80))
          .each('end', function() {
            p.el
              .transition()
              .duration(100)
              .attr("y", ' ' + (+p.el.attr("y") + 80))
              .each('end', function() {
                p.jumping = false;
              });
          });
      }
    }
  }

  setCanvasSize() {
    var screen = Game.prototype.getScreenSize();
    this.canvas.setAttribute("width", screen.w);
    this.canvas.setAttribute("height", screen.h);
  }

  getScreenSize() {
    return {
      w: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
      h: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    };
  }

  // a niave attempt at allowing a pause of the loop
  // through using the return from setInterval, but I need to check
  // the proper way to do o
  run() {
    setInterval(()=>{
      this.processPlayerInput();
      this.player.update();
      this.map.update();
    }, 1000 / 60);
  }
}

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
  if (window.addEventListener) // older FF
      window.addEventListener('DOMMouseScroll', preventDefault, false);
  window.onwheel = preventDefault; // modern standard
  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
  window.ontouchmove  = preventDefault; // mobile
  document.onkeydown  = preventDefaultForScrollKeys;
}

/*
function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
}
*/
