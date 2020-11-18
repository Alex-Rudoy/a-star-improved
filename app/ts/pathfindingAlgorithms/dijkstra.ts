import Field from "../Field";
import callbackChecks from "./utils/callbackChecks";
import chooseNextNode from "./utils/chooseNextNode";
import openNeighbours from "./utils/openNeighbours";

export default function dijkstraStep(field: Field, callback: () => void, quickRedraw: boolean): void {
  // choose next node to work with, based on algorithm
  const currentNode = chooseNextNode(field, "dijkstra");

  // if stuck or finished, return
  if (callbackChecks(field, currentNode, callback)) return;

  // set the current node to closed and remove it from openNodes
  field.closeNode(currentNode!);

  //  add neighbours to openNodes, set their state to "open", calculate new indexes
  openNeighbours(field, currentNode!, "dijkstra");

  // if need to instantly redraw on startNode or endNode move, call itself
  if (quickRedraw) {
    dijkstraStep(field, callback, quickRedraw);
  }
}
