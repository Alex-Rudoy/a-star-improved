import Node from "./Node";

type ClickTargets = "" | "makeWall" | "makeEmpty" | "start" | "end";

export default class Field {
  nodes: Node[][];
  openNodes: Node[];
  startNode: Node;
  endNode: Node;

  fieldWidth: number;
  fieldHeight: number;

  mouseDown: boolean;
  clickTarget: ClickTargets;

  constructor() {
    this.nodes = [];
    this.openNodes = [];
    this.startNode = new Node({ x: 0, y: 0 });
    this.endNode = new Node({ x: 0, y: 0 });

    this.fieldWidth = 0;
    this.fieldHeight = 0;

    this.mouseDown = false;
    this.clickTarget = "";

    this.setupMap();

    // mouse click handlers
    document.addEventListener("mousedown", (e) => (this.mouseDown = true));
    document.addEventListener("mouseup", (e) => {
      this.mouseUpHandler();
    });
    document.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  setupMap() {
    // field size based on screen size
    let field = <HTMLElement>document.querySelector(".field")!;
    let header = document.querySelector("header")!;
    let main = document.querySelector("main")!;

    main.style.height = `calc(100vh - ${header.clientHeight}px)`;
    this.fieldWidth = Math.floor(main.clientWidth / 25);
    this.fieldHeight = Math.floor(main.clientHeight / 25);

    field.style.width = this.fieldWidth * 25 + "px";
    field.style.height = this.fieldHeight * 25 + "px";

    // add nodes to field
    for (let y = 0; y < this.fieldHeight; y++) {
      this.nodes.push([]);

      for (let x = 0; x < this.fieldWidth; x++) {
        this.nodes[y].push(new Node({ x: x, y: y }));
        this.nodes[y][x].addDiv();
        field.insertAdjacentElement("beforeend", this.nodes[y][x].div);
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

  mouseDownHandler(e: MouseEvent) {
    e.preventDefault();
    let div = <HTMLDivElement>e.target!;

    if (div == this.startNode.div) {
      this.clickTarget = "start";
      return;
    }

    if (div == this.endNode.div) {
      this.clickTarget = "end";
      return;
    }

    // e.which is right mouse button
    if (e.which == 3 || div.classList.contains("node--wall")) {
      this.clickTarget = "makeEmpty";
      this.nodes[+div.dataset.y!][+div.dataset.x!].makeEmpty();
    } else {
      this.clickTarget = "makeWall";
      this.nodes[+div.dataset.y!][+div.dataset.x!].makeWall();
    }
  }

  mouseUpHandler() {
    this.mouseDown = false;
    this.clickTarget = "";
  }

  mouseMoveHandler(e: MouseEvent) {
    e.preventDefault();
    let div = <HTMLDivElement>e.target;

    if (this.clickTarget == "start") {
      this.moveStartNode(div);
    }

    if (this.clickTarget == "end") {
      this.moveEndNode(div);
    }

    if (
      this.clickTarget == "makeWall" &&
      !div.classList.contains("node--start") &&
      !div.classList.contains("node--end")
    ) {
      this.nodes[+div.dataset.y!][+div.dataset.x!].makeWall();
    }

    if (this.clickTarget == "makeEmpty") {
      this.nodes[+div.dataset.y!][+div.dataset.x!].makeEmpty();
    }
  }

  moveStartNode(div: HTMLDivElement) {
    this.startNode.makeEmpty();
    this.nodes[+div.dataset.y!][+div.dataset.x!].makeStart();
    div.classList.add("node--start");
    this.startNode = this.nodes[+div.dataset.y!][+div.dataset.x!];
  }

  moveEndNode(div: HTMLDivElement) {
    this.endNode.div.classList.remove("node--end");
    div.classList.add("node--end");
    this.endNode = this.nodes[+div.dataset.y!][+div.dataset.x!];
  }

  drawPath(node: Node) {
    if (node !== this.startNode && node.parent) {
      node.parent.makePath();
      this.drawPath(node.parent);
    }
  }
}
