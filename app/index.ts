import "./scss/main.scss";
import Field from "./ts/Field";
import recursiveDivision from "./ts/mazeAlgorithms/recursiveDivision";
import Node from "./ts/Node";
import aStarStep from "./ts/pathfindingAlgorithms/aStar";
import dijkstraStep from "./ts/pathfindingAlgorithms/dijkstra";
import weightedStep from "./ts/pathfindingAlgorithms/weighted";
import {
  ClickTargets,
  MazeBuildingAlgorithmName,
  MazeBuildingAlgorithms,
  ObstacleMode,
  PathfindingAlgorithmName,
  PathfindingAlgorithms,
} from "./ts/types";

let field: Field = new Field();

let algorithmInProgress: boolean = false;
let searchFinished: boolean = false;

let obstacleMode: ObstacleMode = "wall";
let pathfindingalgorithm: PathfindingAlgorithmName = "aStar";
let pathfindingalgorithms: PathfindingAlgorithms = { aStar: aStarStep, dijkstra: dijkstraStep, weighted: weightedStep };
let mazeBuildingAlgorithm: MazeBuildingAlgorithmName = "recursiveDivision";
let mazeBuildingAlgorithms: MazeBuildingAlgorithms = { recursiveDivision: recursiveDivision };

let interval: NodeJS.Timeout = setInterval(() => {}, Infinity);

let mouseDown: boolean = false;
let clickTarget: ClickTargets = "";

let buttons: NodeListOf<Element> = document.querySelectorAll(".button");
buttons.forEach((button) => button.addEventListener("click", buttonClickHandler));

document.addEventListener("mousedown", (e) => (mouseDown = true));
document.addEventListener("mouseup", (e) => {
  mouseUpHandler();
});
document.addEventListener("contextmenu", (e) => e.preventDefault());
NodeListeners();

function NodeListeners() {
  field.nodes.forEach((row) =>
    row.forEach((node) => {
      node.div.addEventListener("mousedown", mouseDownHandler);
      node.div.addEventListener("mouseenter", mouseMoveHandler);
    })
  );
}

function mouseDownHandler(e: MouseEvent) {
  e.preventDefault();
  let div = <HTMLDivElement>e.target!;
  if (!algorithmInProgress) {
    if (div == field.startNode.div) {
      clickTarget = "start";
      return;
    }

    if (div == field.endNode.div) {
      clickTarget = "end";
      return;
    }

    // e.which is right mouse button
    if (obstacleMode === "wall") {
      if (e.which == 3 || div.classList.contains("node--wall")) {
        clickTarget = "removeWall";
        field.nodes[+div.dataset.y!][+div.dataset.x!].removeWall();
      } else {
        clickTarget = "makeWall";
        field.nodes[+div.dataset.y!][+div.dataset.x!].makeWall();
      }
    }

    if (obstacleMode === "swamp") {
      if (e.which == 3 || div.classList.contains("node--swamp")) {
        clickTarget = "removeSwamp";
        field.removeSwamp(+div.dataset.y!, +div.dataset.x!);
      } else {
        clickTarget = "makeSwamp";
        field.createSwamp(+div.dataset.y!, +div.dataset.x!);
      }
    }
  }
}

function mouseUpHandler() {
  mouseDown = false;
  clickTarget = "";
}

function mouseMoveHandler(e: MouseEvent) {
  e.preventDefault();
  let div = <HTMLDivElement>e.target;

  if (!algorithmInProgress) {
    switch (clickTarget) {
      case "start":
        field.moveStartNode(div);
        if (searchFinished) {
          field.softResetMap();
          field.openNode(field.startNode, new Node({ x: 0, y: 0 }), 0);
          pathfindingalgorithms[pathfindingalgorithm](field, pathFindingCallback, searchFinished);
        }
        break;

      case "end":
        field.moveEndNode(div);
        if (searchFinished) {
          field.softResetMap();
          field.openNode(field.startNode, new Node({ x: 0, y: 0 }), 0);
          pathfindingalgorithms[pathfindingalgorithm](field, pathFindingCallback, searchFinished);
        }
        break;

      case "makeWall":
        field.nodes[+div.dataset.y!][+div.dataset.x!].makeWall();
        break;

      case "removeWall":
        field.nodes[+div.dataset.y!][+div.dataset.x!].removeWall();
        break;

      case "makeSwamp":
        field.createSwamp(+div.dataset.y!, +div.dataset.x!);
        break;

      case "removeSwamp":
        field.removeSwamp(+div.dataset.y!, +div.dataset.x!);
        break;
      default:
        break;
    }
  }
}

function buttonClickHandler(e: Event): void {
  let button = <HTMLElement>e.target!;
  switch (button.dataset.action) {
    case "changeMode":
      obstacleMode = <ObstacleMode>button.dataset.mode;
      if (button && button.parentNode && button.parentNode.parentNode) {
        button.parentNode.parentNode.children[0].innerHTML = button.innerHTML;
      }
      break;

    case "changeMazeBuildingAlgorithm":
      mazeBuildingAlgorithm = <MazeBuildingAlgorithmName>button.dataset.mode;
      document.querySelector("#runMazeBuilding")!.innerHTML = button.innerHTML;
      break;

    case "runMazeBuilding":
      if (!algorithmInProgress) {
        algorithmInProgress = true;
        mazeBuildingAlgorithms[mazeBuildingAlgorithm](field, mazeBuildingCallback);
      }
      break;

    case "changePathfindingAlgorithm":
      pathfindingalgorithm = <PathfindingAlgorithmName>button.dataset.mode;
      document.querySelector("#runPathfinding")!.innerHTML = `Find path with ${button.innerHTML}`;
      break;

    case "runPathfinding":
      if (!algorithmInProgress) {
        document.querySelector("#runPathfinding")?.classList.add("hidden");
        document.querySelector("#softReset")?.classList.remove("hidden");
        algorithmInProgress = true;
        field.openNode(field.startNode, new Node({ x: 0, y: 0 }), 0);
        interval = setInterval(() => pathfindingalgorithms[pathfindingalgorithm](field, pathFindingCallback, false), 4);
      }
      break;

    case "softReset":
      document.querySelector("#runPathfinding")?.classList.remove("hidden");
      document.querySelector("#softReset")?.classList.add("hidden");
      algorithmInProgress = false;
      clearInterval(interval);
      field.softResetMap();
      break;

    case "hardReset":
      document.querySelector("#runPathfinding")?.classList.remove("hidden");
      document.querySelector("#softReset")?.classList.add("hidden");
      algorithmInProgress = false;
      searchFinished = false;
      clearInterval(interval);
      field.hardResetMap();
      break;
    default:
      break;
  }
}

function pathFindingCallback(): void {
  document.querySelector("#pause")?.classList.add("hidden");
  document.querySelector("#play")?.classList.add("hidden");
  clearInterval(interval);
  algorithmInProgress = false;
  searchFinished = true;
}

function mazeBuildingCallback(): void {
  algorithmInProgress = false;
}
