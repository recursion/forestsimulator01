import {GameObject} from './assets.js';

// template object for anything that moves around in the game
export class Mob extends GameObject {
  constructor(map, positionX="8", positionY="8", color="blue") {
    super(map, positionX, positionY);
    this.el = map.midground.append("circle")
      .attr("cx", positionX)
      .attr("cy", positionY)
      .attr("r", ' ' + Math.floor(this.map.tilesize / 2))
      .attr("fill", color)
      .attr("stroke", "black");

    this.jumping = false;
    this.speed = 100;
    this.timeOfLastMove = 0;

    this.hunger = 0;

    this.width = this.map.tilesize;
    this.height = this.map.tilesize;

    // direction
    this.dx = 0;
    this.dy = 0;
  }

  update() {
    super.update();
    this.move();
  }

  move() {
    let xCoord = (+this.el.attr("cx") + this.dx * this.map.tilesize);
    let yCoord = (+this.el.attr("cy") + this.dy * this.map.tilesize);
    this.map.place(this, yCoord, xCoord);
    this.timeOfLastMove = Date.now();
  }
}

export class Squirrel extends Mob {
  constructor(map, x, y){
    super(map, x, y, 'grey');
  }
  update(){
    super.update();
    // am i hungry
    // is there food here
    this.dx = Math.floor(Math.random() * (2 + 1) -1);
    this.dy = Math.floor(Math.random() * (2 + 1) -1);
    // move towards food

  }
}
