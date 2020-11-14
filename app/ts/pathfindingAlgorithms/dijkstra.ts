import Field from "../Field";
import Node from "../Node";

export default function dijkstraStep(field: Field, callback: () => void, pathFound: boolean): void {
  const currentNode = dijkstraChooseNextNode(field);

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

  dijkstraOpenNeighbours(field, currentNode);

  // if this is redraw on move
  if (pathFound) {
    dijkstraStep(field, callback, pathFound);
  }
}

function dijkstraChooseNextNode(field: Field): Node | null {
  // make array of open nodes with smallest index
  let minIndex = Infinity;
  let foundMinIndexNodes: Node[] = [];

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

  return foundMinIndexNodes[0];
}

function dijkstraOpenNeighbours(field: Field, currentNode: Node): void {
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
      neighbourNode.index = neighbourNode.fromStart;
    }
  });
}
