import Field from "../../classes/Field";
import Node from "../../classes/Node";
import { PathfindingAlgorithmName } from "../../types";

export default function openNeighbours(field: Field, currentNode: Node, algorithm: PathfindingAlgorithmName): void {
  currentNode.neighbours.forEach((neighbour) => {
    const neighbourNode = neighbour.node;
    // calculate new path distance from start
    // current node + distance between current and neighbour calculated with Pythagorean theorem
    // if neighbour is swamp, distance x2
    const newFromStart =
      currentNode.fromStart +
      Math.sqrt((currentNode.x - neighbourNode.x) ** 2 + (currentNode.y - neighbourNode.y) ** 2) *
        (1 + 1 * +neighbourNode.isSwamp);

    // if neighbour is not closed or wall
    // or if new path to open node is shorter than existing
    if (
      neighbourNode.state !== "closed" &&
      neighbourNode.state !== "wall" &&
      (neighbourNode.state !== "open" || neighbourNode.fromStart > newFromStart)
    ) {
      field.openNode(neighbourNode, currentNode, newFromStart);

      // calculate empirical distance from neighbour to end
      // just Pythagorean theorem, ignoring swamps, walls and all the stuff
      neighbourNode.toEnd = Math.sqrt(
        (field.endNode.x - neighbourNode.x) ** 2 + (field.endNode.y - neighbourNode.y) ** 2
      );

      // dijkstra index = start
      // a* index = start + end
      // weighted index = start*2 + end
      neighbourNode.index =
        neighbourNode.fromStart +
        neighbourNode.fromStart * +(algorithm === "weighted") +
        neighbourNode.toEnd * +(algorithm !== "dijkstra");
    }
  });
}
