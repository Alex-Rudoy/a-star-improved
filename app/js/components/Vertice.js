export default class Vertice {
  constructor(args) {
    this.x = args.x;
    this.y = args.y;

    this.width = args.width || 1;
    this.height = args.height || 1;

    this.xCoord = this.x + this.width / 2;
    this.yCoord = this.y + this.height / 2;

    this.state = "empty";
    this.neighbours = [];

    this.addDiv();
  }
}

Vertice.prototype.addDiv = function () {
  this.div = document.createElement("div");

  this.div.classList.add("node");
  this.div.style.top = this.y * 25 + "px";
  this.div.style.left = this.x * 25 + "px";
  this.div.style.width = this.width * 25 + "px";
  this.div.style.height = this.height * 25 + "px";

  this.div.dataset.x = this.x;
  this.div.dataset.y = this.y;
};

Vertice.prototype.addNeighbour = function (a) {
  a.neighbours.push(a);
};

Vertice.prototype.removeNeighbour = function (a) {
  this.neighbours = this.neighbours.filter((n) => n != a);
};

Vertice.prototype.makeWall = function () {
  this.state = "wall";
  this.div.classList.add("node--wall");
};

Vertice.prototype.removeWall = function () {
  this.state = "empty";
  this.div.classList.remove("node--wall");
};
