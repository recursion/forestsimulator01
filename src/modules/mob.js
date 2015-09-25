// template object for anything that moves around in the game
export class Mob {
  constructor(map, positionX="8", positionY="8", color="blue") {
    this.map = map;
    this.el = d3.select('#canvas').append("circle")
      .attr("cx", positionX)
      .attr("cy", positionY)
      .attr("r", ' ' + Math.floor(this.map.tilesize / 2))
      .attr("fill", color)
      .attr("stroke", "black");

    this.jumping = false;
    this.speed = 2;

    this.width = this.map.tilesize;
    this.height = this.map.tilesize;

    // direction
    this.dx = 0;
    this.dy = 0;
  }

  update() {
    let xCoord = (+this.el.attr("cx") + this.dx);
    let yCoord = (+this.el.attr("cy") + this.dy);
    this.map.place(this, yCoord, xCoord);
  }
}

