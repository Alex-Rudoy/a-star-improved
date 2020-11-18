import Field from "../../classes/Field";
import Node from "../../classes/Node";

export default function callbackChecks(field: Field, currentNode: Node | null, callback: () => void) {
  // if there are no way to get to end, stop
  if (!currentNode) {
    callback();
    return true;
  }

  // if current one is the end, draw the path
  if (currentNode === field.endNode) {
    callback();
    field.drawPath(currentNode);
    return true;
  }

  return false;
}
