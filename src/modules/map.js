export class Map {
  constructor(screen, tilesize=32){
    // calculate map and tile sizes based on screen size
    let w = screen.getAttribute('width');
    let h = screen.getAttribute('height');
    console.log(w, h);
    this.width = Math.floor(w / tilesize);
    this.height = Math.floor(h / tilesize);
    console.log(this.width, this.height);

    this.tilesize = tilesize;
    this.tiles = new Array(this.height);
    for (let y = 0; y < this.height; y++) {
      this.tiles[y] = new Array(this.width);
      for (let x = 0; x < this.width; x++) {
        this.tiles[y][x] = {
          x: x * tilesize,
          y: y * tilesize,
          width: tilesize,
          height: tilesize,
          color: 'grey'
        };
      }
    }

    this.el = d3.select('#canvas');

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
      this.el.append("rect")
        .attr("x", ' ' + this.tiles[y][x].x)
        .attr("y", ' ' + this.tiles[y][x].y)
        .attr("width", ' ' + this.tiles[y][x].width)
        .attr("height", ' ' + this.tiles[y][x].width)
        .attr("stroke", 'black')
        .attr("fill", ' ' + this.tiles[y][x].color);

      }
     }
  }
  update() {

  }
}
