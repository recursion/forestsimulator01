// template object for anything that moves around in the game
export class Mob {
  constructor(map, positionX="8", positionY="8", color="blue") {
    this.map = map;
    this.el = map.midground.append("circle")
      .attr("cx", positionX)
      .attr("cy", positionY)
      .attr("r", ' ' + Math.floor(this.map.tilesize / 2))
      .attr("fill", color)
      .attr("stroke", "black");

    this.jumping = false;
    this.speed = 100;
    this.timeOfLastMove = 0;

    this.width = this.map.tilesize;
    this.height = this.map.tilesize;

    // direction
    this.dx = 0;
    this.dy = 0;
  }

  update() {
    this.move();
  }

  move() {
    let xCoord = (+this.el.attr("cx") + this.dx);
    let yCoord = (+this.el.attr("cy") + this.dy);
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
    // is there food here
    this.dx = Math.floor(Math.random() * 2);
    this.dy = Math.floor(Math.random() * 2);
    // move towards food

  }
}
