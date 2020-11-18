import Field from "./classes/Field";

export type ObstacleMode = "wall" | "swamp" | "join";

export type PathfindingAlgorithmName = "aStar" | "dijkstra" | "weighted";
export type PathfindingAlgorithms = {
  [name in PathfindingAlgorithmName]: (field: Field, callback: () => void, searchFinished: boolean) => void;
};

export type MazeBuildingAlgorithmName = "recursiveDivision";
export type MazeBuildingAlgorithms = {
  [name in MazeBuildingAlgorithmName]: (field: Field, callback: () => void) => void;
};

export type ClickTargets = "" | "makeWall" | "removeWall" | "makeSwamp" | "removeSwamp" | "start" | "end";

export type NodeState = "empty" | "open" | "closed" | "path" | "wall" | "start" | "end";
