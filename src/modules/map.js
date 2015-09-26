import {Tile} from './tile.js';
import {Tree, Grass} from './assets.js';

// pretty much every where vectors are used
// im following a y, x pattern
// I have no idea why.. but thats what i decided on
export class Map {
  constructor(screen, tilesize=32){

    // calculate map and tile sizes based on screen size
    let w = screen.getAttribute('width');
    let h = screen.getAttribute('height');

    let svg = d3.select('#canvas');

    this.background = svg.append('g');
    this.midground = svg.append('g');
    this.foreground = svg.append('g');

    this.width = Math.floor(w / tilesize);
    this.height = Math.floor(h / tilesize);

    this.tiles = [];

    this.tilesize = tilesize;

    this.generate();

    // add tile elements to background layer screen
    this.background.selectAll("rect")
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

  // useful for translating
  // direction abbreviations
  // to actual vectors
  vectors(){
    // use this to find
    // new tiles
    return {
      n: [-1,0],
      ne: [-1, 1],
      e: [0, 1],
      se: [1, 1],
      s: [1, 0],
      sw: [1, -1],
      w: [0, -1],
      nw: [-1, -1]
    };
  }

  // generate a new map
  generate() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.tiles.push(new Tile("grass", x, y, this.tilesize));
      }
    }
    // make some tree clusters
    for (let i = 0; i <= 5; i++) {
      let x = Math.random() * (this.width * this.tilesize - 0);
      let y = Math.random() * (this.height * this.tilesize - 0);
      this.createCluster(Tree, {y: y, x: x});
    }
    // make some Grass clusters
    for (let i = 0; i < 5; i++) {
      let x = Math.random() * (this.width * this.tilesize - 0);
      let y = Math.random() * (this.height * this.tilesize - 0);
      this.createCluster(Grass , {y: y, x: x});
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

    // validates the tile is real
    // and can hold the item being placed
    // if it is/can the work callback is
    // called with the tile passed as an argument
    let validate = (y, x, obj, work, unique) => {
      let tile = this.getTile(y, x);
      if (tile){
        if (unique){
          // if tile already has one
          if (tile.items[tile.items.length - 1]){
            // dont do the work
            return null;
          } else {
            return work(obj, tile);
          }
        } else {
          return work(obj, tile);
        }
      } else {
        return null;
      }
    };
    // a function that places a tree on a tile
    // and returns the tree
    let place = (Obj, tile)=>{
      if (!tile instanceof Tile){
        throw new Error('Invalid tile');
      }
      if (Math.random() > 0.5){
        let o = new Obj(this, tile.y, tile.x);
        tile.addItem(o);
        return o;
      } else {
        return null;
      }
    };

    let incrementTile = (dir) => {
      switch(dir){
        case 'up':
          y -= this.tilesize;
          break;
        case 'right':
          x += this.tilesize;
          break;
        case 'down':
          y += this.tilesize;
          break;
        case 'left':
          x -= this.tilesize;
          break;
        default:
          break;
      }
      return [y, x];
    };

    // applyJobToTiles
    // takes coordinates, a direction, number of tiles
    // and a callback to be performed on the number of tiles specified
    // dir(ection)
    // 0 = up   1 = right
    // 2 = down 3 = left
    let applyJobToTiles = (tileCoords, dir, numTiles, job) => {
      let y = tileCoords.y;
      let x = tileCoords.x;
      for (let i = 0; i < numTiles; i++){
        [y, x] = incrementTile(dir);
        job(y, x);
      }
      return [y, x];
    };

    let i = 0;
    let _inc = 1;
    let limit = 28;

    // place initial item
    if (validate(y, x, obj, place, true)){
      i++;
    }

    // randomly place items in an outward growing rectangle pattern
    while (i < limit){

      // move right x tiles, creating an object on each tile
      [y, x] = applyJobToTiles({y: y, x: x}, 'right', _inc, (a, b)=>{
        if (validate(a, b, obj, place, true)){
          i++;
        }
      });

      // move down
      [y, x] = applyJobToTiles({y: y, x: x}, 'down', _inc, (a, b)=>{
        if (validate(a, b, obj, place, true)){
          i++;
        }
      });

      // increase incrementor
      _inc++;

      // move left
      [y, x] = applyJobToTiles({y: y, x: x}, 'left', _inc, (a, b)=>{
        if (validate(a, b, obj, place, true)){
          i++;
        }
      });

      // move up
      // if its the last run, do 1 less tile
      if (i + 1 >= limit) {
        _inc = _inc - 1;
      }
      [y, x] = applyJobToTiles({y: y, x: x}, 'up', _inc, (a, b)=>{
        if (validate(a, b, obj, place, true)){
          i++;
        }
      });

      // increment the incrementor
      _inc++;
    }

    /*
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
    for (let i  = 0; i < 15; i++){

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

      if (y < 0) {
        y = 0;
      } else if (y > this.height * this.tilesize){
        y = this.height * this.tilesize;
      }

      if (x < 0) {
        x = 0;
      } else if (x > this.width * this.tilesize){
        x = this.width * this.tilesize;
      }
      setTimeout(nothing, 0);
    }
    */
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
      setTimeout(nothing, 0);
    });
  }
}
function nothing(){}
