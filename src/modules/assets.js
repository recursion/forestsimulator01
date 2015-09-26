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
    newDirection[0] *= 2;
    newDirection[1] *= 2;
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
    this.growthRate = growthRate;
    this.maxSize = this.map.tilesize;
    this.lifespan = 10000 * Math.random();
    this.lastSpawned = 0;
  }

  die(){
    this.el.remove();
    // needs to call parent
    // so that it really dies
  }

  spawn() {
    let [newX, newY] = this.getNearbyTile();
    let tile = this.map.getTile(newY, newX);
    if (tile && Date.now() - this.lastSpawned > 1000){
      tile.addItem(new this.constructor(this.map, newY, newX));
      this.lastSpawned = Date.now();
    }
  }

  update(){
    super.update();

    // time to die?
    if (this.age >= this.lifespan) {
      this.die();
    }

    // do some growing
    let growBy = this.growthRate / Math.random();
    if (+this.el.attr("width") + growBy < this.maxSize){
      this.el
        .attr("transform", "translate(16," + (this.map.tilesize / 2) + ")")
        .attr("width", +this.el.attr("width") + growBy)
        .attr("height", +this.el.attr("height") + growBy);
    }

    // spawn?
    // are we old enough?
    if (this.age > this.lifespan / 4){
      // is it the right 'time of the month'?
      let now = Date.now();
      if (now % 99 === 0 && now % 7){
        // if we are lucky
        if (Math.random() > 0.85){
          this.spawn();
        }
      }
    }
  }

}

export class Tree extends Plant {
  constructor(map, y, x){
    super(map, x, y, 1, 0.00115);
    this.layer = this.map.foreground;
    this.maxSize = this.map.tilesize * (2 + Math.random());
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
    super(map, x, y, 1, 0.005);
    this.layer = this.map.midground;
    this.el = this.layer.append('image')
      .attr("xlink:href", 'http://localhost:8000/assets/grass.svg')
      .attr('width', 1)
      .attr('height', 1)
      .attr('x', x)
      .attr('y', y);
  }
}
