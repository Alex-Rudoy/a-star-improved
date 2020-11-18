import Field from "../Field";
import callbackChecks from "./utils/callbackChecks";
import chooseNextNode from "./utils/chooseNextNode";
import openNeighbours from "./utils/openNeighbours";

export default function dijkstraStep(field: Field, callback: () => void, pathFound: boolean): void {
  const currentNode = chooseNextNode(field, "dijkstra");

  if (callbackChecks(field, currentNode, callback)) return;

  // set the current node to closed and remove it from openNodes
  field.closeNode(currentNode!);

  openNeighbours(field, currentNode!, "dijkstra");

  // if this is redraw on move
  if (pathFound) {
    dijkstraStep(field, callback, pathFound);
  }
}
