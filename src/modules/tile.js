export const TILETYPES = ['dirt', 'road', 'grass', 'sand', 'mud', 'water', 'rock', 'wall'];

  /*
   *.attr("xlink:href","https://upload.wikimedia.org/wikipedia/commons/d/d8/Compass_card_(de).svg")
    .attr("width", 100)
    .attr("height", 100)
    */

function setRandomTileType() {
  var randy = Math.floor(Math.random() * (TILETYPES.length - 0));
  return TILETYPES[randy];
}

export class Tile {
  constructor(type="rand", x="0", y="0", size="16") {
    this.type = (function() {
      if (type === "rand") {
        return setRandomTileType();
      } else {
        if (TILETYPES.indexOf(type) !== -1){
          return type;
        } else {
          throw new Error('Unknown tile type: ', type);
        }
      }
    })();

    this.x = x * size;
    this.y = y * size;
    this.width = size;
    this.height = size;

    // items placed on this tile
    this.items = [];

    switch(this.type){
      case 'dirt':
        this.color = 'darkbrown';
        break;
      case 'wall':
        this.color = 'grey';
        break;
      case 'water':
        this.color = 'blue';
        break;
      case 'road':
        this.color = 'black';
        break;
      case 'sand':
        this.color = 'white';
        break;
      case 'rock':
        this.color = 'lightgrey';
        break;
      case 'grass':
        this.color = 'green';
        break;
      case 'mud':
        this.color = 'lightbrown';
        break;
      default:
        this.color = 'orange';
        break;
    }
  }

  addItem(item){
    //console.log('Adding ', item, ' to tile');
    this.items.push(item);
  }

  removeItem(item){
    //console.log('Removing', item, ' from tile');
    let itemIndex = this.items.indexOf(item);
    if (itemIndex === -1){
      console.error('Item: ', item, ' not found');
    } else {
      item = this.items[itemIndex];
      this.items.splice(itemIndex, 1);
      return item;
    }

  }

  items(){
    return this.items;
  }

  update() {
    // draw the first item in this.items
    // if it hasnt already been drawn
    this.items.forEach(function(item){
      item.update();
      //setTimeout(nothing, 0);
    });
  }

  isWall() {
    return this.type === 'wall';
  }
}

function nothing(){}
