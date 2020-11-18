import Field from "../Field";
import callbackChecks from "./utils/callbackChecks";
import chooseNextNode from "./utils/chooseNextNode";
import openNeighbours from "./utils/openNeighbours";

export default function aStarStep(field: Field, callback: () => void, quickRedraw: boolean): void {
  const currentNode = chooseNextNode(field, "aStar");

  if (callbackChecks(field, currentNode, callback)) return;

  // set the current node to closed and remove it from openNodes
  field.closeNode(currentNode!);

  openNeighbours(field, currentNode!, "aStar");

  // if this is redraw on move
  if (quickRedraw) {
    aStarStep(field, callback, quickRedraw);
  }
}
