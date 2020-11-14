type NodeState = "empty" | "open" | "closed" | "wall" | "start" | "end";

export default class Node {
  x: number;
  y: number;

  width: number;
  height: number;

  xCoord: number;
  yCoord: number;

  state: NodeState;
  neighbours: Node[];

  div: HTMLDivElement;

  addDiv = (): void => {};
  addNeighbour = (a: Node): void => {};
  removeNeighbour = (a: Node): void => {};
  makeWall = (): void => {};
  makeEmpty = (): void => {};
  makeStart = (): void => {};
  makeEnd = (): void => {};

  constructor(args: { x: number; y: number; width?: number; height?: number }) {
    //positiom on grid
    this.x = args.x;
    this.y = args.y;

    this.width = args.width || 1;
    this.height = args.height || 1;

    // position of center of node for distance calculations
    this.xCoord = this.x + this.width / 2;
    this.yCoord = this.y + this.height / 2;

    this.state = "empty";
    this.neighbours = [];

    this.div = document.createElement("div");
    this.addDiv();
  }
}

Node.prototype.addDiv = function () {
  this.div.classList.add("node");
  this.div.style.top = this.y * 25 + "px";
  this.div.style.left = this.x * 25 + "px";
  this.div.style.width = this.width * 25 + "px";
  this.div.style.height = this.height * 25 + "px";

  this.div.dataset.x = this.x + "";
  this.div.dataset.y = this.y + "";
};

Node.prototype.addNeighbour = function (a) {
  a.neighbours.push(a);
};

Node.prototype.removeNeighbour = function (a) {
  this.neighbours = this.neighbours.filter((n: any) => n != a);
};

Node.prototype.makeWall = function () {
  this.state = "wall";
  this.div.classList.add("node--wall");
};

Node.prototype.makeEmpty = function () {
  this.state = "empty";
  this.div.classList.remove("node--wall", "node--start", "node--end", "node--open", "node--closed");
};

Node.prototype.makeStart = function () {
  this.state = "start";
  this.div.classList.add("node--start");
};

Node.prototype.makeEnd = function () {
  this.state = "end";
  this.div.classList.add("node--end");
};
