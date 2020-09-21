export default class Vertice {
  constructor(args) {
    this.x = args.x;
    this.y = args.y;
    this.width = args.width || 1;
    this.height = args.height || 1;
    this.neighbours = [];

    this.addDiv();
  }
}

Vertice.prototype.addDiv = function () {
  this.div = document.createElement("div");

  this.div.classList.add("node");
  this.div.style.top = this.y * 15 + "px";
  this.div.style.left = this.x * 15 + "px";
  this.div.style.width = this.width * 15 + "px";
  this.div.style.height = this.height * 15 + "px";
};
