type NodeState = "empty" | "open" | "closed" | "path" | "wall" | "start" | "end";

export default class Node {
  x: number;
  y: number;

  width: number;
  height: number;

  xCoord: number;
  yCoord: number;

  fromStart: number;
  toEnd: number;
  index: number;

  state: NodeState;
  neighbours: Node[];
  parent: Node | null;

  div: HTMLDivElement;

  constructor(args: { x: number; y: number; width?: number; height?: number }) {
    //positiom on grid
    this.x = args.x;
    this.y = args.y;

    this.width = args.width || 1;
    this.height = args.height || 1;

    // position of center of node for distance calculations
    this.xCoord = this.x + this.width / 2;
    this.yCoord = this.y + this.height / 2;

    // distances for algorhitms
    this.fromStart = Infinity;
    this.toEnd = Infinity;
    this.index = Infinity;

    this.state = "empty";
    this.neighbours = [];
    this.parent = null;

    this.div = document.createElement("div");
    this.addDiv();
  }

  addDiv() {
    console.log("ololo");
    this.div.classList.add("node");
    this.div.style.top = this.y * 25 + "px";
    this.div.style.left = this.x * 25 + "px";
    this.div.style.width = this.width * 25 + "px";
    this.div.style.height = this.height * 25 + "px";

    this.div.dataset.x = this.x + "";
    this.div.dataset.y = this.y + "";
  }

  addNeighbour(a: Node) {
    a.neighbours.push(a);
  }

  removeNeighbour(a: Node) {
    this.neighbours = this.neighbours.filter((n: any) => n != a);
  }

  makeWall() {
    this.state = "wall";
    this.div.classList.add("node--wall");
  }

  makeEmpty() {
    this.state = "empty";
    this.div.classList.remove("node--wall", "node--start", "node--end", "node--open", "node--closed", "node--path");
  }

  makeOpen(fromStart: number) {
    this.state = "open";
    this.fromStart = fromStart;
    this.div.classList.add("node--open");
  }

  makeClosed() {
    this.state = "closed";
    this.div.classList.add("node--closed");
    this.div.classList.remove("node--open");
  }

  makePath() {
    this.state = "path";
    this.div.classList.add("node--path");
    this.div.classList.remove("node--closed");
  }

  makeStart() {
    this.state = "start";
    this.div.classList.add("node--start");
  }

  makeEnd() {
    this.state = "end";
    this.div.classList.add("node--end");
  }
}
