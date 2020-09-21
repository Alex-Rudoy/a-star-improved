import Vertice from "./Vertice";

export default class Field {
  constructor() {
    this.field = document.querySelector(".field");
    this.nodes = [];

    this.setupMap();
  }

  setupMap() {
    // field size based on screen size
    this.field = document.querySelector(".field");
    let main = document.querySelector("main");

    this.fieldWidth = Math.floor(main.clientWidth / 25);
    this.fieldHeight = Math.floor(main.clientHeight / 25);

    this.field.style.width = this.fieldWidth * 25 + "px";
    this.field.style.height = this.fieldHeight * 25 + "px";

    // add nodes to field
    for (let y = 0; y < this.fieldHeight; y++) {
      this.nodes.push([]);

      for (let x = 0; x < this.fieldWidth; x++) {
        this.nodes[y].push(new Vertice({ x: x, y: y }));
        this.nodes[y][x].addDiv();
        this.field.insertAdjacentElement("beforeend", this.nodes[y][x].div);
      }
    }

    // add neighbours
    for (let y = 0; y < this.fieldHeight; y++) {
      for (let x = 0; x < this.fieldWidth; x++) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (x + j >= 0 && y + i >= 0 && x + j < this.fieldWidth && y + i < this.fieldHeight) {
              this.nodes[y][x].addNeighbour(this.nodes[y + i][x + j]);
            }
          }
        }
      }
    }

    // add start and end nodes
    this.startNode = this.nodes[Math.round(this.fieldHeight / 2)][Math.round(this.fieldWidth / 3)];
    this.startNode.div.classList.add("node--start");
    this.endNode = this.nodes[Math.round(this.fieldHeight / 2)][Math.round((this.fieldWidth / 3) * 2)];
    this.endNode.div.classList.add("node--end");

    // big elements array
    this.nodes.push([]);
  }

  addNeighbour(a, b) {
    a.neighbours.push(b);
  }

  removeNeighbour(a, b) {
    a.neighbours = a.neighbours.filter((n) => n != b);
  }

  clickHandler(e) {
    e.target.classList.add("node--start");
  }
}
