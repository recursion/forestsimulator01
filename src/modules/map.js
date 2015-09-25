const TILETYPES = ['ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground','ground', 'wall', 'poo'];

function setRandomTileType() {
  var randy = Math.floor(Math.random() * (TILETYPES.length - 0));
  return TILETYPES[randy];
}

class Tile {
  constructor(type="rand", x="0", y="0", size="16") {
    this.type = (function() {
      if (type === "rand") {
        return setRandomTileType();
      } else {
        return type;
      }
    })();
    this.x = x * size;
    this.y = y * size;
    this.width = size;
    this.height = size;
    switch(this.type){
      case 'ground':
        this.color = 'white';
        break;
      case 'wall':
        this.color = 'grey';
        break;
      case 'poo':
        this.color = 'brown';
        break;
      default:
        this.color = 'orange';
        break;
    }
  }
  isWall() {
    return this.type === 'wall';
  }
}

export class Map {
  constructor(screen, tilesize=32){

    // calculate map and tile sizes based on screen size
    let w = screen.getAttribute('width');
    let h = screen.getAttribute('height');

    this.width = Math.floor(w / tilesize);
    this.height = Math.floor(h / tilesize);

    this.tilesize = tilesize;

    // generate a new map
    // create an array that is the length of the tileheight
    this.tiles = new Array(this.height);
    for (let y = 0; y < this.height; y++) {

      // in each element in the height array, create
      // an array of columns
      this.tiles[y] = new Array(this.width);
      for (let x = 0; x < this.width; x++) {
        this.tiles[y][x] = new Tile("rand", x, y, tilesize);
      }
    }

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

    // bounds checking
    if (yCoord <= this.height * this.tilesize && yCoord >= 0){
      obj.el.attr("cy", yCoord);
    }


  }
  update() {


  }
}
