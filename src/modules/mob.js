// template object for anything that moves around in the game
export class Mob {
  constructor(game, positionX="60", positionY="60", radius="90", color="blue") {
    this.game = game;
    this.el = d3.select('#canvas').append("circle")
      .attr("cx", positionX)
      .attr("cy", positionY)
      .attr("r", radius)
      .attr("fill", color)
      .attr("stroke", "black");

    this.jumping = false;
    this.speed = 2;
    this.dx = 0;
    this.dy = 0;
  }
  move() {
    this.el.attr("cx", (+this.el.attr("cx") + this.dx));
    this.el.attr("cy", (+this.el.attr("cy") + this.dy));
  }
}

