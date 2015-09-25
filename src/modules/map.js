import {Tile} from './tile.js';

class Tree {
  constructor(layer, y, x){
    layer.append('image')
      .attr("xlink:href", 'http://localhost:8000/assets/trees/tree54.svg')
      .attr('width', 16)
      .attr('height', 16)
      .attr('x', x)
      .attr('y', y);
  }
}

export class Map {
  constructor(screen, tilesize=32){

    // calculate map and tile sizes based on screen size
    let w = screen.getAttribute('width');
    let h = screen.getAttribute('height');

    let svg = d3.select('#canvas');

    this.layers = {};
    this.layers.background = svg.append('g');
    this.layers.midground = svg.append('g');
    this.layers.foreground = svg.append('g');

    this.width = Math.floor(w / tilesize);
    this.height = Math.floor(h / tilesize);

    this.tiles = [];

    this.tilesize = tilesize;

    this.generate();

    // add tile elements to background layer screen
    this.layers.background.selectAll("rect")
      .data(this.tiles)
      .enter()
      .append("rect")
        .attr("x", function(d){ return d.x;})
        .attr("y", function(d){ return d.y;})
        .attr("width", function(d){ return d.width;})
        .attr("height", function(d){ return d.height;})
        .attr("stroke", 'black')
        .attr("fill", function(d){ return d.color;});

  }

  // generate a new map
  generate() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.tiles.push(new Tile("grass", x, y, this.tilesize));
      }
    }
    // make some tree clusters
    for (let i = 0; i < 5; i++) {
      var x = Math.random() * (this.width * this.tilesize - 0);
      var y = Math.random() * (this.height * this.tilesize - 0);
      this.createCluster(Tree, {y: y, x: x});
    }

  }

  /*
   * create a cluster of game objects
   * - ideally should be an 'island' of tiles
   *   that contains the obj
   */
  createCluster(obj, startpoint){

    // format and translate the startpoint into something we can use
    // (get an integer that is a multiple of our tilesize)
    let y = Math.floor(startpoint.y / this.tilesize);
    let x = Math.floor(startpoint.x / this.tilesize);
    y *= this.tilesize;
    x *= this.tilesize;

    let directionalVectors = [
      [-1,0],   // n
      [-1, 1],  // ne
      [0, 1],   // e
      [1, 1],   // se
      [1, 0],   // s
      [1, -1],  // sw
      [0, -1],  // w
      [-1, -1]  // nw
    ];

    // validates the tile is real
    // and can hold the item being placed
    // if it is/can the work callback is
    // called with the tile passed as an argument
    let validate = (y, x, work, unique) => {
      let tile = this.getTile(y, x);
      if (tile){
        if (unique){
          // if tile already has one
          if (tile.items[tile.items.length] instanceof obj.constructor){
            // dont count this one and find a new spot
            return null;
          } else {
            return work(tile);
          }
        } else {
          return work(tile);
        }
      }
    };
    var placeTree = (tile)=>{
      let tree = new Tree(this.layers.midground, y, x);
      tile.addItem(obj);
      return tree;
    };

    for (let i  = 0; i < 5; i++){

      // if we cant place the tree
      if(!validate(y, x, placeTree, true)){
        // reset the counter
        i--;
        continue;
      }
      // pick random direction
      let dir = Math.floor(Math.random() * 8);
      let newDir = directionalVectors[dir];
      y = y + (newDir[0] * this.tilesize);
      x = x + (newDir[1] * this.tilesize);

    }
   }

  // take in an x and a y coordinate
  // and return a tile from the map
  // returns null if the tile cannot be found
  getTile(yCoord, xCoord) {
    let tile = _.filter(this.tiles, _.matches({'x': xCoord, 'y': yCoord}));

    if (tile){
      return tile[0];
    } else {
      return null;
    }
  }

  // map#place(<gameObj>, number, number)
  // attempt to place an object on a map tile
  place(obj, yCoord, xCoord){

    // translate from tilecenters to tile start
    let x = (xCoord - this.tilesize / 2);
    let y = (yCoord - this.tilesize / 2);

    // make sure the tile is valid
    let tile = this.getTile(y, x);

    // determine if we are hitting a wall
    if (tile instanceof Tile) {
      if (tile.isWall()){
        return;
      }
    } else {
      return;
    }

    // bounds checking
    if (xCoord <= this.width * this.tilesize && xCoord >= 0){
      obj.el.attr("cx", '' + xCoord);
    }
    if (yCoord <= this.height * this.tilesize && yCoord >= 0){
      obj.el.attr("cy", '' + yCoord);
    }

  }
  update(){
    this.tiles.forEach(function(tile){
      tile.update();
    });
  }
}
