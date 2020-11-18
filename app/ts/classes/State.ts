import recursiveDivision from "../mazeAlgorithms/recursiveDivision";
import aStarStep from "../pathfindingAlgorithms/aStar";
import dijkstraStep from "../pathfindingAlgorithms/dijkstra";
import weightedStep from "../pathfindingAlgorithms/weighted";
import {
  ClickTargets,
  MazeBuildingAlgorithmName,
  MazeBuildingAlgorithms,
  ObstacleMode,
  PathfindingAlgorithmName,
  PathfindingAlgorithms,
} from "../types";
import Field from "./Field";

export default class State {
  field = new Field();
  algorithmInProgress = false;
  searchFinished = false;

  obstacleMode: ObstacleMode = "wall";

  pathfindingalgorithm: PathfindingAlgorithmName = "aStar";
  pathfindingalgorithms: PathfindingAlgorithms = { aStar: aStarStep, dijkstra: dijkstraStep, weighted: weightedStep };

  mazeBuildingAlgorithm: MazeBuildingAlgorithmName = "recursiveDivision";
  mazeBuildingAlgorithms: MazeBuildingAlgorithms = { recursiveDivision: recursiveDivision };

  interval: NodeJS.Timeout = setInterval(() => {}, Infinity);

  mouseDown = false;
  clickTarget: ClickTargets = "";

  constructor() {
    this.pathFindingCallback = this.pathFindingCallback.bind(this);
    this.mazeBuildingCallback = this.mazeBuildingCallback.bind(this);
  }

  pathFindingCallback(): void {
    document.querySelector("#pause")?.classList.add("hidden");
    document.querySelector("#play")?.classList.add("hidden");
    clearInterval(this.interval);
    this.algorithmInProgress = false;
    this.searchFinished = true;
  }

  mazeBuildingCallback(): void {
    this.algorithmInProgress = false;
  }
}
