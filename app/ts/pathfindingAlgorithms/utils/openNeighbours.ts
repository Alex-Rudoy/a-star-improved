import Field from "../../Field";
import Node from "../../Node";
import { PathfindingAlgorithmName } from "../../types";

export default function openNeighbours(field: Field, currentNode: Node, algorithm: PathfindingAlgorithmName): void {
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

      neighbourNode.index =
        neighbourNode.fromStart +
        neighbourNode.toEnd * +(algorithm !== "dijkstra") +
        neighbourNode.fromStart * +(algorithm === "weighted");
    }
  });
}
