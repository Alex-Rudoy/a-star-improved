import Node from "./Node";

export default class Field {
  nodes: Node[][];
  openNodes: Node[];
  startNode: Node;
  endNode: Node;

  fieldWidth: number;
  fieldHeight: number;

  interval: NodeJS.Timeout;

  constructor() {
    this.nodes = [];
    this.openNodes = [];
    this.startNode = new Node({ x: 0, y: 0 });
    this.endNode = new Node({ x: 0, y: 0 });

    this.fieldWidth = 0;
    this.fieldHeight = 0;

    this.interval = setInterval(() => {}, Infinity);

    this.setupMap();
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
    this.startNode.makeStart();
    this.endNode = this.nodes[Math.round(this.fieldHeight / 2)][Math.round((this.fieldWidth / 3) * 2)];
    this.endNode.makeEnd();

    // big elements array
    this.nodes.push([]);
  }

  softResetMap() {
    this.openNodes = [];

    this.nodes.forEach((row) =>
      row.forEach((node) => {
        if (node.state === "closed" || node.state === "open" || node.state === "path") {
          node.makeEmpty();
        }
      })
    );

    this.startNode.makeStart();
    this.endNode.makeEnd();
  }

  hardResetMap() {
    this.openNodes = [];

    this.nodes.forEach((row) =>
      row.forEach((node) => {
        node.makeEmpty();
      })
    );

    this.startNode = this.nodes[Math.round(this.fieldHeight / 2)][Math.round(this.fieldWidth / 3)];
    this.startNode.makeStart();
    this.endNode = this.nodes[Math.round(this.fieldHeight / 2)][Math.round((this.fieldWidth / 3) * 2)];
    this.endNode.makeEnd();
  }

  moveStartNode(div: HTMLDivElement) {
    this.startNode.makeEmpty();
    this.startNode = this.nodes[+div.dataset.y!][+div.dataset.x!];
    this.startNode.makeStart();
  }

  moveEndNode(div: HTMLDivElement) {
    this.endNode.makeEmpty();
    this.endNode = this.nodes[+div.dataset.y!][+div.dataset.x!];
    this.endNode.makeEnd();
  }

  drawPath(node: Node) {
    if (node.parent !== this.startNode) {
      node.parent!.makePath();
      this.drawPath(node.parent!);
    }
  }

  openNode(node: Node, parent: Node, fromStart: number) {
    this.openNodes.push(node);
    node.makeOpen(parent, fromStart);
  }

  closeNode(nodeToClose: Node) {
    this.openNodes = this.openNodes.filter((node) => node !== nodeToClose);
    nodeToClose.makeClosed();
  }
}
