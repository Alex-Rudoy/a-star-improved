import Field from "./Field";
import Node from "./Node";
import aStarStep from "./pathfindingAlgorithms/aStar";
import dijkstraStep from "./pathfindingAlgorithms/dijkstra";

type ObstacleMode = "wall" | "swamp";
type PathfindingalgorithmName = "aStar" | "dijkstra";
type ClickTargets = "" | "makeWall" | "removeWall" | "start" | "end";

export default class State {
  field: Field;

  algorithmInProgress: boolean = false;
  searchFinished: boolean = false;

  obstacleMode: ObstacleMode = "wall";
  pathfindingalgorithm: PathfindingalgorithmName = "aStar";
  pathfindingalgorithms: {
    [name in PathfindingalgorithmName]: (field: Field, callback: () => void, searchFinished: boolean) => void;
  };

  buttons: NodeListOf<Element>;

  interval: NodeJS.Timeout = setInterval(() => {}, Infinity);

  mouseDown: boolean = false;
  clickTarget: ClickTargets = "";

  constructor() {
    this.field = new Field();

    this.pathfindingalgorithms = { aStar: aStarStep, dijkstra: dijkstraStep };

    this.buttons = document.querySelectorAll(".button");
    this.buttons.forEach((button) => button.addEventListener("click", (e) => this.buttonClickHandler(e)));

    // mouse click handlers
    document.addEventListener("mousedown", (e) => (this.mouseDown = true));
    document.addEventListener("mouseup", (e) => {
      this.mouseUpHandler();
    });
    document.addEventListener("contextmenu", (e) => e.preventDefault());
    this.NodeListeners();

    this.pathFindingCallback = this.pathFindingCallback.bind(this);
  }

  NodeListeners() {
    this.field.nodes.forEach((row) =>
      row.forEach((node) => {
        node.div.addEventListener("mousedown", (e) => this.mouseDownHandler(e));
        node.div.addEventListener("mouseenter", (e) => this.mouseMoveHandler(e));
      })
    );
  }

  mouseDownHandler(e: MouseEvent) {
    e.preventDefault();
    let div = <HTMLDivElement>e.target!;
    if (!this.algorithmInProgress) {
      if (div == this.field.startNode.div) {
        this.clickTarget = "start";
        return;
      }

      if (div == this.field.endNode.div) {
        this.clickTarget = "end";
        return;
      }

      // e.which is right mouse button
      if (e.which == 3 || div.classList.contains("node--wall")) {
        this.clickTarget = "removeWall";
        this.field.nodes[+div.dataset.y!][+div.dataset.x!].makeEmpty();
      } else {
        this.clickTarget = "makeWall";
        this.field.nodes[+div.dataset.y!][+div.dataset.x!].makeWall();
      }
    }
  }

  mouseUpHandler() {
    this.mouseDown = false;
    this.clickTarget = "";
  }

  mouseMoveHandler(e: MouseEvent) {
    e.preventDefault();
    let div = <HTMLDivElement>e.target;

    if (!this.algorithmInProgress) {
      switch (this.clickTarget) {
        case "start":
          this.field.moveStartNode(div);
          if (this.searchFinished) {
            this.field.softResetMap();
            this.field.openNode(this.field.startNode, new Node({ x: 0, y: 0 }), 0);
            this.pathfindingalgorithms[this.pathfindingalgorithm](
              this.field,
              this.pathFindingCallback,
              this.searchFinished
            );
          }
          break;

        case "end":
          this.field.moveEndNode(div);
          if (this.searchFinished) {
            this.field.softResetMap();
            this.field.openNode(this.field.startNode, new Node({ x: 0, y: 0 }), 0);
            this.pathfindingalgorithms[this.pathfindingalgorithm](
              this.field,
              this.pathFindingCallback,
              this.searchFinished
            );
          }
          break;

        case "makeWall":
          if (!div.classList.contains("node--start") && !div.classList.contains("node--end")) {
            this.field.nodes[+div.dataset.y!][+div.dataset.x!].makeWall();
          }
          break;

        case "removeWall":
          this.field.nodes[+div.dataset.y!][+div.dataset.x!].removeWall();
          break;

        default:
          break;
      }
    }
  }

  buttonClickHandler(e: Event): void {
    let button = <HTMLElement>e.target!;
    switch (button.dataset.action) {
      case "changeMode":
        this.obstacleMode = <ObstacleMode>button.dataset.mode;
        if (button && button.parentNode && button.parentNode.parentNode) {
          button.parentNode.parentNode.children[0].innerHTML = button.innerHTML;
        }
        break;
      case "changePathfindingAlgorithm":
        this.pathfindingalgorithm = <PathfindingalgorithmName>button.dataset.mode;
        document.querySelector("#find")!.innerHTML = `Find path with ${button.innerHTML}`;
        break;
      case "runPathfinding":
        document.querySelector("#find")?.classList.add("hidden");
        document.querySelector("#pause")?.classList.remove("hidden");
        document.querySelector("#stop")?.classList.remove("hidden");
        this.algorithmInProgress = true;
        this.field.openNode(this.field.startNode, new Node({ x: 0, y: 0 }), 0);
        this.interval = setInterval(
          () => this.pathfindingalgorithms[this.pathfindingalgorithm](this.field, this.pathFindingCallback, false),
          4
        );
        break;
      case "pausePathfinding":
        document.querySelector("#pause")?.classList.add("hidden");
        document.querySelector("#play")?.classList.remove("hidden");
        clearInterval(this.interval);
        break;
      case "unpausePathfinding":
        document.querySelector("#play")?.classList.add("hidden");
        document.querySelector("#pause")?.classList.remove("hidden");
        this.interval = setInterval(
          () => this.pathfindingalgorithms[this.pathfindingalgorithm](this.field, this.pathFindingCallback, false),
          4
        );
        break;
      case "stopPathfinding":
        console.log("stop is clicked");
        document.querySelector("#find")?.classList.remove("hidden");
        document.querySelector("#pause")?.classList.add("hidden");
        document.querySelector("#play")?.classList.add("hidden");
        document.querySelector("#stop")?.classList.add("hidden");
        this.algorithmInProgress = false;
        clearInterval(this.interval);
        this.field.softResetMap();
        break;
      default:
        break;
    }
  }

  pathFindingCallback(): void {
    document.querySelector("#pause")?.classList.add("hidden");
    document.querySelector("#play")?.classList.add("hidden");
    clearInterval(this.interval);
    this.algorithmInProgress = false;
    this.searchFinished = true;
  }
}
