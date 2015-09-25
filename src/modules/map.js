import {Tile} from './tile.js';

export class Map {
  constructor(screen, tilesize=32){

    // calculate map and tile sizes based on screen size
    let w = screen.getAttribute('width');
    let h = screen.getAttribute('height');

    this.width = Math.floor(w / tilesize);
    this.height = Math.floor(h / tilesize);

    this.tiles = [];

    this.tilesize = tilesize;

    this.generate();

    // add tile elements to screen
    this.el = d3.select('#canvas').selectAll("rect")
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
  }

  createCluster(obj, startPoint){
    let clusterSize = 10;
    let halfCluster = clusterSize / 2;
    let tile;

    for (let y = startPoint.y - halfCluster; y < startPoint.y + halfCluster; y++){
      for (let x = startPoint.x - halfCluster; x < startPoint.x + halfCluster; x++) {
        tile = _.filter(this.tiles, _.matches({'x': x, 'y': y}));
        if (tile) {

          tile.addItem(obj);
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
  update() {


  }
}
