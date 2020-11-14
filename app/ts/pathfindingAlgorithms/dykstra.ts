import Field from "../Field";
import Node from "../Node";

export default function dykstraStep(field: Field, callback: (pathFound: boolean) => void, pathFound: boolean): void {
  // make array of open nodes with smallest index
  let minIndex = Infinity;
  let foundMinIndexNodes: Node[] = [];
  let currentNode: Node = new Node({ x: 0, y: 0 });

  field.openNodes.forEach((node) => {
    if (node.index <= minIndex) {
      minIndex = node.index;
    }
  });

  field.openNodes.forEach((node) => {
    if (node.index <= minIndex) {
      foundMinIndexNodes.push(node);
    }
  });

  if (foundMinIndexNodes.length === 0) {
    callback(false);
    return;
  }

  currentNode = foundMinIndexNodes[0];

  // set the current node to closed and remove it from openNodes
  field.closeNode(currentNode);

  // if current one is the end, draw the path
  if (currentNode === field.endNode) {
    callback(true);
    field.drawPath(currentNode);
    return;
  }

  // go through neighbours of the current
  currentNode.neighbours.forEach((neighbourNode) => {
    const newFromStart =
      currentNode.fromStart +
      Math.sqrt((currentNode.x - neighbourNode.x) ** 2 + (currentNode.y - neighbourNode.y) ** 2);
    if (
      neighbourNode.state !== "closed" &&
      neighbourNode.state !== "wall" &&
      (neighbourNode.state !== "open" || neighbourNode.fromStart > newFromStart)
    ) {
      field.openNode(neighbourNode, currentNode, newFromStart);
      neighbourNode.index = neighbourNode.fromStart;
    }
  });

  // if this is redraw on move
  if (pathFound) {
    dykstraStep(field, callback, pathFound);
  }
}
