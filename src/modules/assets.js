export class GameObject {
  constructor(map, x, y, width, height) {
    // every game object is dependant on a map
    this.map = map;

    // object satts
    this.age = 0;
    this.x = x;
    this.y = y;
    this.width = width || this.map.tilesize;
    this.height = height || this.map.tilesize;
  }

  // randomly select a nearby tile
  getNearbyTile() {
    let dirs = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];

    let newDirection = this.map.vectors()[dirs[Math.floor(Math.random() * dirs.length)]];
    // move further away occasionally
    newDirection[0] *= Math.floor(Math.random() * (4-1) + 1);
    newDirection[1] *= Math.floor(Math.random() * (4-1) + 1);
    let newY = this.y + newDirection[0] * this.map.tilesize;
    let newX = this.x + newDirection[1] * this.map.tilesize;
    return [newY, newX];
  }

  update(){
    this.age++;
  }

}

export class Plant extends GameObject {
  constructor(map, y, x, size, growthRate){
    super(map, x, y, size, size);
    let growthRateModifier = (Math.random() * (5 - 1) +1);
    if (Math.random() > 0.5){
      growthRateModifier = -growthRateModifier;
    }
    this.growthRate = Math.abs(Math.floor(growthRate + growthRateModifier));
    this.reproductionRate = 25;
    this.maxSize = this.map.tilesize;
    this.lifespan = 1000 * Math.random() * (2 - 0.5) + 0.5;
  }

  die(){
    // remove from dom
    this.el.remove();

    // remove from parent tile
    let tile = this.map.getTile(this.y % this.map.tilesize, this.x % this.map.tilesize);
    let i = tile.items.indexOf(this);
    tile.items.splice(i, 1);
  }

  spawn() {
    let [newX, newY] = this.getNearbyTile();
    let tile = this.map.getTile(newY, newX);
    if (tile){
      if (tile.items.length === 0) {
        tile.addItem(new this.constructor(this.map, newY, newX));
      }
    }
  }

  grow() {
    // do some growing
    let growBy = this.growthRate * Math.random() * (1 - 0.1) + 0.1;
    growBy /= 100;
    if (+this.el.attr("width") < this.maxSize){
      this.el
        .attr("transform", "translate(16," + (this.map.tilesize / 2) + ")")
        .attr("width", +this.el.attr("width") + growBy)
        .attr("height", +this.el.attr("height") + growBy);
    }

  }

  update(){
    super.update();

    // time to die?
    if (this.age >= this.lifespan) {
      this.die();
      return;
    }

    this.grow();

    // spawn?
    if ((Math.random() * 100) < this.reproductionRate){
      this.spawn();
    }
  }
}

export class Tree extends Plant {
  constructor(map, y, x){
    super(map, x, y, 1, 10);
    this.reproductionRate = 5;
    this.maxSize = Math.floor((this.map.tilesize * 3) * (Math.random()));
    this.lifespan = 10000 * Math.random() * (2 - 0.5) - 0.5;
    this.layer = this.map.foreground;
    this.el = this.layer.append('image')
      .attr("xlink:href", 'http://localhost:8000/assets/trees/tree54.svg')
      .attr('width', 1)
      .attr('height', 1)
      .attr('x', x)
      .attr('y', y);
  }
}
export class Grass extends Plant {
  constructor(map, y, x){
    super(map, x, y, 1, 50);
    this.reproductionRate = 99;
    this.maxSize = Math.floor((this.map.tilesize * 2) * (Math.random()));
    this.lifespan = 1000 * Math.random() * (2 - 0.5) - 0.5;
    this.layer = this.map.midground;
    this.el = this.layer.append('image')
      .attr("xlink:href", 'http://localhost:8000/assets/grass.svg')
      .attr('width', 1)
      .attr('height', 1)
      .attr('x', x)
      .attr('y', y);
  }

}
