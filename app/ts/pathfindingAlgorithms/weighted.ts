import Field from "../Field";
import callbackChecks from "./utils/callbackChecks";
import chooseNextNode from "./utils/chooseNextNode";
import openNeighbours from "./utils/openNeighbours";

export default function weightedStep(field: Field, callback: () => void, quickRedraw: boolean): void {
  // choose next node to work with, based on algorithm
  const currentNode = chooseNextNode(field, "weighted");

  // if stuck or finished, return
  if (callbackChecks(field, currentNode, callback)) return;

  // set the current node to closed and remove it from openNodes
  field.closeNode(currentNode!);

  //  add neighbours to openNodes, set their state to "open", calculate new indexes
  openNeighbours(field, currentNode!, "weighted");

  // if need to instantly redraw on startNode or endNode move, call itself
  if (quickRedraw) {
    weightedStep(field, callback, quickRedraw);
  }
}
