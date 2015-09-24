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
    this.width = 16;
    this.height = 16;
    this.dx = 0;
    this.dy = 0;
  }
  move() {
    let xMove = +this.el.attr("cx") + this.dx;
    let yMove = +this.el.attr("cy") + this.dy;

    if (xMove + this.width < this.game.map.width * this.game.map.tilesize && xMove >= 0){
      this.el.attr("cx", xMove);
    }

    if (yMove + this.height < this.game.map.height * this.game.map.tilesize && yMove >= 0){
      this.el.attr("cy", yMove);
    }
  }
}

