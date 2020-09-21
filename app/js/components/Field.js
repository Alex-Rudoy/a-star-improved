import Vertice from "./Vertice";

export default class Field {
  constructor() {
    this.field = document.querySelector(".field");
    this.nodes = [];

    this.setupMap();
    this.events();
  }

  events() {}

  setupMap() {
    // add nodes
    for (let row = 0; row < 50; row++) {
      this.nodes.push([]);

      for (let column = 0; column < 50; column++) {
        this.nodes[row].push(new Vertice({ x: column, y: row }));
        this.nodes[row][column].addDiv();
        this.nodes[row][column].div.addEventListener("mousemove", (e) => this.clickHandler(e));
      }
    }

    // add edges
    for (let row = 0; row < 50; row++) {
      for (let column = 0; column < 50; column++) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (column + j >= 0 && row + i >= 0 && column + j < 50 && row + i < 50) {
              this.nodes[row][column].neighbours.push(this.nodes[row + i][column + j]);
            }
          }
        }
      }
    }

    // big elements array
    this.nodes.push([]);
  }

  clickHandler(e) {
    e.target.classList.add("node--start");
  }
}
