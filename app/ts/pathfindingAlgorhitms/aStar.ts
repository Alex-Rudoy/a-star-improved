import Field from "../Field";

export default function aStarStep(field: Field): void {
  // make array of open nodes with smallest index
  let minIndex = Infinity;
  let minToEnd = Infinity;
  let foundMinIndexNodes = [];
  let currentX;
  let currentY;

  for (let i = 0; i < 50; i++) {
    for (let j = 0; j < 50; j++) {
      if (state.nodes[j][i].isOpen && state.nodes[j][i].index <= minIndex) {
        foundMinIndexNodes.push(state.nodes[j][i]);
      }
    }
  }

  if (foundMinIndexNodes.length == 0) {
    dispatch({ type: "stuck" });
    return;
  }

  // find node with smallest distance to the end in that array
  foundMinIndexNodes.forEach((node) => {
    if (node.toEnd < minToEnd) {
      minToEnd = node.toEnd;
      currentX = node.x;
      currentY = node.y;
    }
  });

  // set the current node to closed
  dispatch({ type: "setToClosed", x: currentX, y: currentY });
  const currentNode = state.nodes[currentY][currentX];

  // if current one is the end, draw the path
  if (currentX == state.endNode.x && currentY == state.endNode.y) {
    drawPath(currentNode.parent.x, currentNode.parent.y);
    return;
  }

  // go through neighbours of the current

  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      if (currentY + j >= 0 && currentX + i >= 0 && currentY + j < 50 && currentX + i < 50) {
        const neighbourNode = state.nodes[currentY + j][currentX + i];
        let newFromStart;
        if ((j + i) % 2 == 0) {
          newFromStart = currentNode.fromStart + 141;
        } else {
          newFromStart = currentNode.fromStart + 100;
        }
        if (
          !(j == 0 && i == 0) &&
          !neighbourNode.isClosed &&
          !neighbourNode.isWall &&
          (!neighbourNode.isOpen || neighbourNode.fromStart > newFromStart)
        ) {
          setToOpen(neighbourNode.x, neighbourNode.y, currentNode.x, currentNode.y, newFromStart);
        }
      }
    }
  }
  dispatch({ type: "step" });
}
