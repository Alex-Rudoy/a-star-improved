import Field from "../Field";
import Node from "../Node";

export default function dykstraStep(field: Field): void {
  // make array of open nodes with smallest index
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
    // TODO stuck logic
    return;
  }

  // find node with smallest distance to the end in that array
  foundMinIndexNodes.forEach((node) => {
    if (node.toEnd < minToEnd) {
      minToEnd = node.toEnd;
      currentNode = node;
    }
  });

  // set the current node to closed
  currentNode.makeClosed();

  // if current one is the end, draw the path
  if (currentNode === field.endNode) {
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
      neighbourNode.makeOpen(newFromStart);
      neighbourNode.toEnd = Math.sqrt(
        (field.endNode.x - neighbourNode.x) ** 2 + (field.endNode.y - neighbourNode.y) ** 2
      );
      neighbourNode.index = neighbourNode.fromStart + neighbourNode.toEnd;
    }
  });

  setTimeout(() => {
    dykstraStep(field);
  }, 100);
}
