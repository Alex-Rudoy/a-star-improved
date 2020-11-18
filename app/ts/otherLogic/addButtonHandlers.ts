import Node from "../classes/Node";
import State from "../classes/State";
import { MazeBuildingAlgorithmName, ObstacleMode, PathfindingAlgorithmName } from "../types";

export default function addButtonHandlers(state: State) {
  let buttons: NodeListOf<Element> = document.querySelectorAll(".button");
  buttons.forEach((button) => button.addEventListener("click", buttonClickHandler));

  function buttonClickHandler(e: Event): void {
    let button = <HTMLElement>e.target!;
    switch (button.dataset.action) {
      case "changeMode":
        state.obstacleMode = <ObstacleMode>button.dataset.mode;
        if (button && button.parentNode && button.parentNode.parentNode) {
          button.parentNode.parentNode.children[0].innerHTML = button.innerHTML;
        }
        break;

      case "changeMazeBuildingAlgorithm":
        state.mazeBuildingAlgorithm = <MazeBuildingAlgorithmName>button.dataset.mode;
        document.querySelector("#runMazeBuilding")!.innerHTML = button.innerHTML;
        break;

      case "runMazeBuilding":
        if (!state.algorithmInProgress) {
          state.algorithmInProgress = true;
          state.mazeBuildingAlgorithms[state.mazeBuildingAlgorithm](state.field, state.mazeBuildingCallback);
        }
        break;

      case "changePathfindingAlgorithm":
        state.pathfindingalgorithm = <PathfindingAlgorithmName>button.dataset.mode;
        document.querySelector("#runPathfinding")!.innerHTML = `Find path with ${button.innerHTML}`;
        break;

      case "runPathfinding":
        if (!state.algorithmInProgress) {
          document.querySelector("#runPathfinding")?.classList.add("hidden");
          document.querySelector("#softReset")?.classList.remove("hidden");
          state.algorithmInProgress = true;
          state.field.openNode(state.field.startNode, new Node({ x: 0, y: 0 }), 0);
          state.interval = setInterval(
            () =>
              state.pathfindingalgorithms[state.pathfindingalgorithm](state.field, state.pathFindingCallback, false),
            4
          );
        }
        break;

      case "softReset":
        document.querySelector("#runPathfinding")?.classList.remove("hidden");
        document.querySelector("#softReset")?.classList.add("hidden");
        state.algorithmInProgress = false;
        clearInterval(state.interval);
        state.field.softResetMap();
        break;

      case "hardReset":
        document.querySelector("#runPathfinding")?.classList.remove("hidden");
        document.querySelector("#softReset")?.classList.add("hidden");
        state.algorithmInProgress = false;
        state.searchFinished = false;
        clearInterval(state.interval);
        state.field.hardResetMap();
        break;
      default:
        break;
    }
  }
}
