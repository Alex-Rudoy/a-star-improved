import Field from "../Field";
import Node from "../Node";

export default function aStarStep(field: Field, callback: () => void, quickRedraw: boolean): void {
  const currentNode = aStarChooseNextNode(field);

  // if there are no way to get to end, stop
  if (!currentNode) {
    callback();
    return;
  }

  // if current one is the end, draw the path
  if (currentNode === field.endNode) {
    callback();
    field.drawPath(currentNode);
    return;
  }

  // set the current node to closed and remove it from openNodes
  field.closeNode(currentNode);

  aStarOpenNeighbours(field, currentNode);

  // if this is redraw on move
  if (quickRedraw) {
    aStarStep(field, callback, quickRedraw);
  }
}

function aStarChooseNextNode(field: Field): Node | null {
  let minIndex = Infinity;
  let minToEnd = Infinity;
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
    return null;
  }

  // find node with smallest distance to the end in that array
  foundMinIndexNodes.forEach((node) => {
    if (node.toEnd < minToEnd) {
      minToEnd = node.toEnd;
      currentNode = node;
    }
  });

  return currentNode;
}

function aStarOpenNeighbours(field: Field, currentNode: Node): void {
  currentNode.neighbours.forEach((neighbourNode) => {
    const newFromStart =
      currentNode.fromStart +
      Math.sqrt((currentNode.x - neighbourNode.x) ** 2 + (currentNode.y - neighbourNode.y) ** 2) *
        (1 + 1 * +neighbourNode.isSwamp);
    if (
      neighbourNode.state !== "closed" &&
      neighbourNode.state !== "wall" &&
      (neighbourNode.state !== "open" || neighbourNode.fromStart > newFromStart)
    ) {
      field.openNode(neighbourNode, currentNode, newFromStart);
      neighbourNode.toEnd = Math.sqrt(
        (field.endNode.x - neighbourNode.x) ** 2 + (field.endNode.y - neighbourNode.y) ** 2
      );
      neighbourNode.index = neighbourNode.fromStart + neighbourNode.toEnd;
    }
  });
}
