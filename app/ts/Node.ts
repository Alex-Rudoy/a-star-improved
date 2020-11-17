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
  isSwamp: boolean;

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

    // distances for algorithms
    this.fromStart = 0;
    this.toEnd = 0;
    this.index = 0;

    this.state = "empty";
    this.isSwamp = false;

    this.neighbours = [];
    this.parent = null;

    this.div = document.createElement("div");
    this.addDiv();
  }

  addDiv() {
    this.div.classList.add("node");
    this.div.style.top = this.y * 25 + "px";
    this.div.style.left = this.x * 25 + "px";
    this.div.style.width = this.width * 25 + "px";
    this.div.style.height = this.height * 25 + "px";

    this.div.dataset.x = this.x + "";
    this.div.dataset.y = this.y + "";
  }

  addNeighbour(a: Node) {
    this.neighbours.push(a);
  }

  removeNeighbour(a: Node) {
    this.neighbours = this.neighbours.filter((n: any) => n != a);
  }

  makeWall() {
    if (this.state !== "start" && this.state !== "end") {
      this.state = "wall";
      this.div.classList.add("node--wall");
    }
  }

  removeWall() {
    if (this.state === "wall") {
      this.state = "empty";
      this.div.classList.remove("node--wall");
    }
  }

  makeSwamp() {
    let n = Math.floor(Math.random() * 20);
    if (n < 4 && this.state === "empty" && !this.isSwamp) {
      this.div.classList.add(`node--swamp${n}`);
    }
    this.div.classList.add("node--swamp");
    this.isSwamp = true;
  }

  removeSwamp() {
    this.isSwamp = false;
    this.div.classList.remove("node--swamp");
  }

  softReset() {
    this.state = "empty";
    this.div.classList.remove("node--open", "node--closed", "node--path");
  }

  makeEmpty() {
    this.state = "empty";
    this.div.classList.remove(
      "node--wall",
      "node--start",
      "node--end",
      "node--open",
      "node--closed",
      "node--path",
      "node--swamp",
      "node--swamp0",
      "node--swamp1",
      "node--swamp2",
      "node--swamp3"
    );
  }

  makeOpen(parent: Node, fromStart: number) {
    this.state = "open";
    this.parent = parent;
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
