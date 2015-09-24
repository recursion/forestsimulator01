// template object for anything that moves around in the game
export let Mob = function(game, positionX, positionY, radius, color) {

  positionX = positionX || "60";
  positionY = positionY || "60";
  radius = radius || ' ' + Math.floor(game.getScreenSize().w / 90);
  color = color || 'blue';

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
};
Mob.prototype.move = function() {
  this.el.attr("cx", (+this.el.attr("cx") + this.dx));
  this.el.attr("cy", (+this.el.attr("cy") + this.dy));
};

