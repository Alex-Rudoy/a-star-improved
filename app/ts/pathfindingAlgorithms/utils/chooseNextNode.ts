import Field from "../../Field";
import Node from "../../Node";
import { PathfindingAlgorithmName } from "../../types";

export default function chooseNextNode(field: Field, algorithm: PathfindingAlgorithmName): Node | null {
  // find min index value in all nodes
  let minIndex = field.openNodes.reduce((index, node) => (index <= node.index ? index : node.index), Infinity);

  // get all nodes with min index
  let foundMinIndexNodes = field.openNodes.filter((node) => node.index <= minIndex);

  // if no nodes found (stuck into wall)
  if (foundMinIndexNodes.length === 0) return null;

  // if dijkstra, we can get any node from the pull
  if (algorithm === "dijkstra") return foundMinIndexNodes[0];

  // if not dijkstra, find node with smallest distance to the end in that array
  return foundMinIndexNodes.reduce((currentNode, node) => (node.toEnd < currentNode.toEnd ? node : currentNode));
}
