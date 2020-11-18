import Node from "../classes/Node";
import State from "../classes/State";

export default function addMouseListeners(state: State) {
  document.addEventListener("mousedown", (e) => (state.mouseDown = true));
  document.addEventListener("mouseup", (e) => {
    mouseUpHandler();
  });
  document.addEventListener("contextmenu", (e) => e.preventDefault());
  state.field.nodes.forEach((row) =>
    row.forEach((node) => {
      node.div.addEventListener("mousedown", mouseDownHandler);
      node.div.addEventListener("mouseenter", mouseMoveHandler);
    })
  );

  function mouseDownHandler(e: MouseEvent) {
    e.preventDefault();
    let div = <HTMLDivElement>e.target!;
    if (!state.algorithmInProgress) {
      if (div == state.field.startNode.div) {
        state.clickTarget = "start";
        return;
      }

      if (div == state.field.endNode.div) {
        state.clickTarget = "end";
        return;
      }

      // e.which is right mouse button
      if (state.obstacleMode === "wall") {
        if (e.which == 3 || div.classList.contains("node--wall")) {
          state.clickTarget = "removeWall";
          state.field.nodes[+div.dataset.y!][+div.dataset.x!].removeWall();
        } else {
          state.clickTarget = "makeWall";
          state.field.nodes[+div.dataset.y!][+div.dataset.x!].makeWall();
        }
      }

      if (state.obstacleMode === "swamp") {
        if (e.which == 3 || div.classList.contains("node--swamp")) {
          state.clickTarget = "removeSwamp";
          state.field.removeSwamp(+div.dataset.y!, +div.dataset.x!);
        } else {
          state.clickTarget = "makeSwamp";
          state.field.createSwamp(+div.dataset.y!, +div.dataset.x!);
        }
      }
    }
  }

  function mouseUpHandler() {
    state.mouseDown = false;
    state.clickTarget = "";
  }

  function mouseMoveHandler(e: MouseEvent) {
    e.preventDefault();
    let div = <HTMLDivElement>e.target;

    if (!state.algorithmInProgress) {
      switch (state.clickTarget) {
        case "start":
          state.field.moveStartNode(div);
          if (state.searchFinished) {
            state.field.softResetMap();
            state.field.openNode(state.field.startNode, new Node({ x: 0, y: 0 }), 0);
            state.pathfindingalgorithms[state.pathfindingalgorithm](
              state.field,
              state.pathFindingCallback,
              state.searchFinished
            );
          }
          break;

        case "end":
          state.field.moveEndNode(div);
          if (state.searchFinished) {
            state.field.softResetMap();
            state.field.openNode(state.field.startNode, new Node({ x: 0, y: 0 }), 0);
            state.pathfindingalgorithms[state.pathfindingalgorithm](
              state.field,
              state.pathFindingCallback,
              state.searchFinished
            );
          }
          break;

        case "makeWall":
          state.field.nodes[+div.dataset.y!][+div.dataset.x!].makeWall();
          break;

        case "removeWall":
          state.field.nodes[+div.dataset.y!][+div.dataset.x!].removeWall();
          break;

        case "makeSwamp":
          state.field.createSwamp(+div.dataset.y!, +div.dataset.x!);
          break;

        case "removeSwamp":
          state.field.removeSwamp(+div.dataset.y!, +div.dataset.x!);
          break;

        default:
          break;
      }
    }
  }
}
