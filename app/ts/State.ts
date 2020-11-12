import Field from "./Field";
import aStarStep from "./pathfindingAlgorhitms/aStar";
import dykstraStep from "./pathfindingAlgorhitms/dykstra";

type ObstacleMode = "wall" | "swamp";

type PathfindingAlgorhitmName = "aStar" | "dykstra";

export default class State {
  field: Field;
  obstacleMode: ObstacleMode;
  pathfindingAlgorhitms: {
    [name in PathfindingAlgorhitmName]: (field: Field) => void;
  };
  buttons: NodeListOf<Element>;

  constructor() {
    this.field = new Field();
    this.obstacleMode = "wall";
    this.pathfindingAlgorhitms = { aStar: aStarStep, dykstra: dykstraStep };
    this.buttons = document.querySelectorAll(".button");
    this.buttons.forEach((button) => button.addEventListener("click", (e) => this.buttonClickHandler(e)));
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
      case "runPathfinding":
        let algorhitm = <PathfindingAlgorhitmName>button.dataset.algorhitm;
        this.pathfindingAlgorhitms[algorhitm](this.field);
      default:
        break;
    }
  }
}
