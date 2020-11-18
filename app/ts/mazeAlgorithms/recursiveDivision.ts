import Field from "../classes/Field";
import Node from "../classes/Node";

// add chamber type
class Chamber {
  nodes: Node[][];
  width: number;
  height: number;

  constructor(chamber: Field | Chamber, startX: number, endX: number, startY: number, endY: number) {
    this.nodes = [];
    for (let y = startY; y < endY; y++) {
      this.nodes.push([]);
      for (let x = startX; x < endX; x++) {
        this.nodes[y - startY].push(chamber.nodes[y][x]);
      }
    }
    this.width = this.nodes[0].length;
    this.height = this.nodes.length;
  }
}

let chambers: Chamber[] = [];

export default async function recursiveDivision(field: Field, callback: () => void) {
  chambers.push(new Chamber(field, 0, field.fieldWidth, 0, field.fieldHeight));

  while (chambers.length > 0) {
    let chamber = chambers.pop()!;

    while (chamber.height < 5 && chamber.width < 5) {
      if (chambers.length === 0) {
        callback();
        return;
      }
      chamber = chambers.pop()!;
    }

    if (chamber.width > chamber.height) {
      // draw vertical line
      const randomColumn = Math.floor((Math.random() * chamber.width) / 2 + chamber.width / 4);

      for (let row = 0; row < chamber.nodes.length; row++) {
        await asyncMakeWall(chamber, row, randomColumn);
      }

      // make a hole from one of sides
      chamber.nodes[Math.floor(Math.random() * 2) * (chamber.height - 1)][randomColumn].removeWall();

      // create two chambers divided by that vertical line
      chambers.push(new Chamber(chamber, 0, randomColumn, 0, chamber.height));
      chambers.push(new Chamber(chamber, randomColumn + 1, chamber.width, 0, chamber.height));
    } else {
      // draw horizontal line
      const randomRow = Math.floor((Math.random() * chamber.height) / 2 + chamber.height / 4);

      for (let column = 0; column < chamber.nodes[0].length; column++) {
        await asyncMakeWall(chamber, randomRow, column);
      }

      // make a hole from one of sides
      chamber.nodes[randomRow][Math.floor(Math.random() * 2) * (chamber.width - 1)].removeWall();

      // create two chambers divided by that horizontal line
      chambers.push(new Chamber(chamber, 0, chamber.width, 0, randomRow));
      chambers.push(new Chamber(chamber, 0, chamber.width, randomRow + 1, chamber.height));
    }
  }
}

async function asyncMakeWall(chamber: Chamber, row: number, column: number): Promise<void> {
  return new Promise((resolve) =>
    setTimeout(() => {
      chamber.nodes[row][column].makeWall();
      resolve();
    }, 4)
  );
}
