import Field from "../Field";
import callbackChecks from "./utils/callbackChecks";
import chooseNextNode from "./utils/chooseNextNode";
import openNeighbours from "./utils/openNeighbours";

export default function weightedStep(field: Field, callback: () => void, quickRedraw: boolean): void {
  const currentNode = chooseNextNode(field, "weighted");

  if (callbackChecks(field, currentNode, callback)) return;

  // set the current node to closed and remove it from openNodes
  field.closeNode(currentNode!);

  openNeighbours(field, currentNode!, "weighted");

  // if this is redraw on move
  if (quickRedraw) {
    weightedStep(field, callback, quickRedraw);
  }
}
