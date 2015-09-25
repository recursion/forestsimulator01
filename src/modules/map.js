import {Tile} from './tile.js';

export class Map {
  constructor(screen, tilesize=32){

    // calculate map and tile sizes based on screen size
    let w = screen.getAttribute('width');
    let h = screen.getAttribute('height');

    this.width = Math.floor(w / tilesize);
    this.height = Math.floor(h / tilesize);

    this.tilesize = tilesize;

    this.generate();

    // add tile elements to screen
    this.el = d3.select('#canvas');
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
      this.el.append("rect")
        .attr("x", ' ' + this.tiles[y][x].x)
        .attr("y", ' ' + this.tiles[y][x].y)
        .attr("width", ' ' + this.tiles[y][x].width)
        .attr("height", ' ' + this.tiles[y][x].height)
        .attr("stroke", 'black')
        .attr("fill", this.tiles[y][x].color);

      }
     }
  }

  // generate a new map
  generate() {
    // create an array that is the length of the tileheight
    this.tiles = new Array(this.height);
    for (let y = 0; y < this.height; y++) {

      // in each element in the height array, create
      // an array of columns
      this.tiles[y] = new Array(this.width);
      for (let x = 0; x < this.width; x++) {

        this.tiles[y][x] = new Tile("grass", x, y, this.tilesize);

      }
    }
  }

  createCluster(obj, startPoint){
    let clusterSize = 10;
    let halfCluster = clusterSize / 2;
    let tile;

    for (let y = startPoint.y - halfCluster; y < startPoint.y + halfCluster; y++){
      for (let x = startPoint.x - halfCluster; x < startPoint.x + halfCluster; x++) {
        tile = this.getTile(y,x);
        if (tile) {
          this.tiles[y][x] = new Tile(obj, x, y, this.tilesize);
        }
      }
    }
  }

  // take in an x and a y coordinate
  // and return a tile from the map
  // returns null if the tile cannot be found
  getTile(yCoord, xCoord) {
    // since our map matrix is in a sequence orderd by 1s
    // and our map is ordered by tiles
    // divide the coordinates by our tile size
    // to get the correct index
    yCoord /= this.tilesize;
    xCoord /= this.tilesize;

    if (!this.tiles[yCoord]){
      return null;
    } else if (!this.tiles[yCoord][xCoord]){
      return null;
    } else {
      return this.tiles[yCoord][xCoord];
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
    let isWall;
    if (tile instanceof Tile) {
      isWall = tile.isWall();
      if (isWall){
        return;
      }
    } else {
      return;
    }

    // bounds checking
    if (xCoord <= this.width * this.tilesize && xCoord >= 0){
      obj.el.attr("cx", xCoord);
    }
    if (yCoord <= this.height * this.tilesize && yCoord >= 0){
      obj.el.attr("cy", yCoord);
    }

  }
  update() {


  }
}
