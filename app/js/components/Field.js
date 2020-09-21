import Vertice from "./Vertice";

export default class Field {
  constructor() {
    this.field = document.querySelector(".field");
    this.nodes = [];

    this.setupMap();
  }

  setupMap() {
    // add nodes
    for (let row = 0; row < 50; row++) {
      this.nodes.push([]);

      for (let column = 0; column < 50; column++) {
        this.nodes[row].push(new Vertice({ x: column, y: row }));
        this.nodes[row][column].addDiv();
        this.field.insertAdjacentElement("beforeend", this.nodes[row][column].div);
        this.nodes[row][column].div.addEventListener("mouseDown", (e) => this.clickHandler(e));
      }
    }

    // add edges
    for (let row = 0; row < 50; row++) {
      for (let column = 0; column < 50; column++) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (column + j >= 0 && row + i >= 0 && column + j < 50 && row + i < 50) {
              this.addNeighbour(this.nodes[row][column], this.nodes[row + i][column + j]);
            }
          }
        }
      }
    }

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
