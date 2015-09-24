"use strict";

import {KeyboardEventsHandler} from './keyboardEventsHandler.js';
import {Mob} from './mob.js';

// create a game module for handling boilerplate
// game stuff (init, load assets, switch levels?
export class Game{

  constructor(){
    // set up our screen
    // we are using the shorthand 'canvas' to define
    // the surface we are drawing on, whether its svg, canvas, webgl or whatever
    this.canvas = document.getElementById("canvas");
    this.setCanvasSize();

    // instantiate our keyboard event handler
    this.keyboardEventsHandler = new KeyboardEventsHandler();

    // add event listeners
    window.addEventListener("keydown", this.keyboardEventsHandler.keysPressed.bind(this.keyboardEventsHandler), false);
    window.addEventListener("keyup", this.keyboardEventsHandler.keysReleased.bind(this.keyboardEventsHandler), false);
    window.addEventListener("resize", this.setCanvasSize, false);


    // load assets
    this.player = new Mob(this, 60, 60, 100, "green");

  }

  processPlayerInput() {
    // TODO: These should be generic and configurable
    // up (w)
    if (this.keyboardEventsHandler.keys[87]) {
      this.player.dy = -this.player.speed;
    }

    // left (a)
    if (this.keyboardEventsHandler.keys[65]) {
      this.player.dx = -this.player.speed;
    }

    // right (d)
    if (this.keyboardEventsHandler.keys[68]) {
      this.player.dx = this.player.speed;
    }

    // x
    if (this.keyboardEventsHandler.keys[88]) {
    }

    // down (s)
    if (this.keyboardEventsHandler.keys[83]) {
      this.player.dy = this.player.speed;
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
          .attr("cy",  ' ' + (+p.el.attr("cy") - 80))
          .each('end', function() {
            p.el
              .transition()
              .duration(100)
              .attr("cy", ' ' + (+p.el.attr("cy") + 80))
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
    var self = this;
    setInterval(function(){
      self.processPlayerInput();
      self.player.move();
    }, 1000 / 60);
  }
}
