import Vertice from "./Vertice";

export default class Field {
  constructor() {
    this.nodes = [];

    this.setupMap();

    // mouse click handlers
    document.addEventListener("mousedown", (e) => (this.mouseDown = true));
    document.addEventListener("mouseup", (e) => {
      this.mouseDown = false;
      this.clickTarget = "";
      this.startNode.div.classList.remove("node--wall");
    });
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
        this.nodes[y][x].div.addEventListener("mousedown", (e) => this.mouseDownHandler(e));
        this.nodes[y][x].div.addEventListener("mouseenter", (e) => this.mouseMoveHandler(e));
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

  mouseDownHandler(e) {
    e.preventDefault();
    if (e.target == this.startNode.div) {
      this.clickTarget = "start";
      return;
    }
    if (e.target == this.endNode.div) {
      this.clickTarget = "end";
      return;
    }
    if (e.target.classList.contains("node--wall")) {
      this.clickTarget = "removeWall";
    } else {
      this.clickTarget = "addWall";
    }
  }

  mouseMoveHandler(e) {
    e.preventDefault();
    let div = e.target;
    if (this.clickTarget == "start") {
      this.startNode.div.classList.remove("node--start");
      div.classList.add("node--start");
      this.startNode = this.nodes[div.dataset.y][div.dataset.x];
      return;
    }

    if (this.clickTarget == "end") {
      this.endNode.div.classList.remove("node--end");
      div.classList.add("node--end");
      this.endNode = this.nodes[div.dataset.y][div.dataset.x];
      return;
    }

    if (
      this.clickTarget == "addWall" &&
      !div.classList.contains("node--start") &&
      !div.classList.contains("node--start")
    ) {
      div.classList.add("node--wall");
    }

    if (this.clickTarget == "removeWall") {
      div.classList.remove("node--wall");
    }
  }
}
