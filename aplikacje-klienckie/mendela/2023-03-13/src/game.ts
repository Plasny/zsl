/**
 * Module with games logic
 * @module game
 */

import { keysPressed } from "./input";
// import { Board } from "./old-ui";
import { Board } from "./ui";
import { Cell, Point, Move, Side } from "./types";
import { getBestScore, setBestScore } from "./storage";

interface board {
  width: number;
  height: number;
  ui: Board;
  pillPosition: Point[];
  bestScore: number;
  tickLength: number;
  tick: number;
  score: number;
  microbesNr: number;
}

/**
 * Class where everything happens
 *
 * @example
 * To use it use to following code
 * ```ts
 * import { Game } from "./game";
 * import { startListening } from "./input";
 *
 * startListening()
 * new Game()
 * ```
 */
export class Game implements board {
  private Render: FrameRequestCallback;
  private animationFrame: number;
  private lastFrame: number;
  public readonly width: number;
  public readonly height: number;
  public ui: Board;
  public pillPosition: Point[];
  private lastPillPosition: Point[];
  private table: Cell[][];
  private types = ["red", "blue", "yellow"];
  public tickLength: number; // time game updates
  public tick = 0;
  public score = 0;
  private pillNr = 0;
  public bestScore = getBestScore();
  public microbesNr: number;
  private noGame: boolean = false;
  private nextColors: [Cell["color"], Cell["color"]] = ["red", "yellow"];

  /**
   * Constructor of the Game class
   * @param width width of the gameboard
   * @param height height of the gameboard
   * @param microbes number of microbes to clear stage
   * @param tickLength speed of the game (higher number => higher speed of game)
   */
  constructor(width = 8, height = 16, microbes = 4, tickLength = 10) {
    this.width = width;
    this.height = height;
    this.microbesNr = microbes;
    this.tickLength = tickLength;

    this.table = new Array();
    for (let i = 0; i < this.height; i++) {
      this.table.push(new Array(width).fill(<Cell>{ cellType: "none" }));
    }

    this.lastFrame = Date.now();
    this.pillPosition = [];

    this.ui = new Board(width, height);
    this.ui.setScore(this.score);
    this.ui.setTopScore(this.bestScore);
    this.ui.preparePill(this.nextColors);
    this.ui.drawBoard(this.table);

    this.randomMicrobes(this.microbesNr);

    this.preparePill();

    this.Render = () => {
      this.animationFrame = requestAnimationFrame(this.Render);
      if (this.ui.ok === false) return;
      if (this.lastFrame + 1000 / this.tickLength >= Date.now()) return;

      this.lastFrame = Date.now();
      this.tick++;

      this.checkForMaches();

      this.dropAll();

      this.ui.drawBoard(this.table);

      this.checkEndTheGame();

      if (this.noGame) {
        const ok = this.ui.animateThrow();

        if (ok) this.spawnPill(this.nextColors);
        else return;
      }

      if (
        this.tick % 10 == 0 ||
        keysPressed.get("ArrowDown") ||
        keysPressed.get("s")
      )
        this.dropPill();

      this.movePill();
    };

    this.Render(0);
  }

  /**
   * Method which return empty cell
   * @returns empty cell
   */
  private emptyCell(): Cell {
    return { cellType: "none" };
  }

  /**
   * Method which places microbes in random cells of the board
   */
  private randomMicrobes(n: number) {
    const types = ["red", "blue", "yellow"];

    l1: for (let i = 0; i < n; i++) {
      const x = Math.floor(Math.random() * this.width);
      const y = Math.floor(
        (Math.random() * this.height * 2) / 3 + this.height / 3
      );
      const type = Math.floor(Math.random() * types.length);

      // temporary fix for bug in checkForMaches method
      for (let j = 0; j < this.width; j++) {
        if (this.table[y][j].cellType === "microbe") {
          i--;
          continue l1;
        }
      }
      for (let j = 0; j < this.height; j++) {
        if (this.table[j][x].cellType === "microbe") {
          i--;
          continue l1;
        }
      }

      // if(this.table[y][x].cellType === "microbe") {
      //   i--;
      //   continue;
      // }

      this.table[y][x] = {
        cellType: "microbe",
        color: <Cell["color"]>types[type],
      };
      console.info(`${types[type]} microbe on ${x}:${y}`);
    }
  }

  /**
   * Method which is used for starting the pill throwing animation
   */
  private preparePill() {
    // remove all moving pills before creating new ones
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.table[y][x].cellType === "movingPill")
          this.table[y][x].cellType = "pill";
      }
    }

    if (
      this.pillPosition &&
      this.lastPillPosition &&
      this.lastPillPosition[0].y === this.pillPosition[0].y &&
      this.lastPillPosition[0].x === this.pillPosition[0].x
    ) {
      cancelAnimationFrame(this.animationFrame);
      this.ui.gameOver();
    }

    this.noGame = true;
  }

  /**
   * Method which is used for spawning a new pill on the board
   * @param colors
   */
  private spawnPill(colors: [Cell["color"], Cell["color"]]) {
    this.pillPosition = [];
    this.pillPosition.push({ y: 0, x: 3 });
    this.pillPosition.push({ y: 0, x: 4 });

    let number = ++this.pillNr;

    this.table[0][3] = {
      cellType: "movingPill",
      color: colors[0],
      nr: number,
      side: Side.Left,
    };

    this.table[0][4] = {
      cellType: "movingPill",
      color: colors[1],
      nr: number,
      side: Side.Right,
    };

    let types = [...this.types];
    let type: number;

    for (let i = 0; i < 2; i++) {
      // color = types.splice(type, 1).toString() as Cell["color"];
      type = Math.floor(Math.random() * types.length);
      this.nextColors[i] = types[type] as Cell["color"];
    }
    this.noGame = false;
    this.ui.preparePill(this.nextColors);
  }

  /**
   * Method which drops the moving pill one position
   */
  private dropPill() {
    const moves: Move[] = [];

    if (!this.pillPosition) return;

    for (let i = 0; i < this.pillPosition.length; i++) {
      const pillCellPos = this.pillPosition[i];
      const y = pillCellPos.y;
      const x = pillCellPos.x;

      if (y >= this.height - 1) {
        this.preparePill();
        return;
      }

      if (!["none", "movingPill"].includes(this.table[y + 1][x].cellType)) {
        this.preparePill();
        return;
      }

      moves.push({
        old: { x: x, y: y },
        new: { x: x, y: y + 1 },
        cell: this.table[y][x],
      });
    }

    this.lastPillPosition = [...this.pillPosition];
    this.pillPosition.splice(0, this.pillPosition.length);
    for (const move of moves) {
      this.table[move.old.y][move.old.x] = this.emptyCell();
    }
    for (const move of moves) {
      this.table[move.new.y][move.new.x] = move.cell;
      this.pillPosition.push({ x: move.new.x, y: move.new.y });
    }
  }

  /**
   * Method which drops all pill parts
   */
  private dropAll() {
    const moves: Move[] = [];

    for (let y = this.height - 1; y >= 0; y--) {
      for (let x = 0; x < this.width; x++) {
        const cell = this.table[y][x];

        if (cell.cellType !== "pill") continue;

        if (y + 1 < this.height && this.table[y + 1][x].cellType === "none") {
          if (x + 1 < this.width) {
            if (this.table[y][x + 1].nr === cell.nr) {
              if (this.table[y + 1][x + 1].cellType === "none") {
                moves.push({
                  old: { x: x, y: y },
                  new: { x: x, y: y + 1 },
                  cell: this.table[y][x],
                });
                moves.push({
                  old: { x: x + 1, y: y },
                  new: { x: x + 1, y: y + 1 },
                  cell: this.table[y][x + 1],
                });
              }

              x++;
            } else if (
              (x === 0 && this.table[y][x + 1].nr != cell.nr) ||
              (x - 1 >= 0 && this.table[y][x - 1].nr != cell.nr)
            ) {
              moves.push({
                old: { x: x, y: y },
                new: { x: x, y: y + 1 },
                cell: this.table[y][x],
              });
            }
          } else if (
            x === this.width - 1 &&
            this.table[y][x - 1].nr != cell.nr
          ) {
            moves.push({
              old: { x: x, y: y },
              new: { x: x, y: y + 1 },
              cell: this.table[y][x],
            });
          }
        }
      }
    }

    for (const move of moves) {
      this.table[move.old.y][move.old.x] = this.emptyCell();
    }
    for (const move of moves) {
      this.table[move.new.y][move.new.x] = move.cell;
    }
  }

  /**
   * Method which moves the main pill depending on the {@link input.keysPressed}
   */
  private movePill() {
    // to refactor
    const moves: Move[] = [];

    if (keysPressed.get("a")) {
      for (let i = 0; i < this.pillPosition.length; i++) {
        const x = this.pillPosition[i].x;
        const y = this.pillPosition[i].y;

        if (
          (x - 1 > 0 &&
            ["none", "movingPill"].includes(this.table[y][x - 1].cellType)) ||
          (x - 1 >= 0 && this.table[y][x - 1].cellType === "none")
        ) {
          moves.push({
            old: { x: x, y: y },
            new: { y: y, x: x - 1 },
            cell: this.table[y][x],
          });
        }
      }
    }

    if (keysPressed.get("d")) {
      for (let i = 0; i < this.pillPosition.length; i++) {
        const x = this.pillPosition[i].x;
        const y = this.pillPosition[i].y;

        if (
          (x < this.width - 2 &&
            ["none", "movingPill"].includes(this.table[y][x + 1].cellType)) ||
          (x < this.width - 1 && this.table[y][x + 1].cellType === "none")
        ) {
          moves.push({
            old: { x: x, y: y },
            new: { y: y, x: x + 1 },
            cell: this.table[y][x],
          });
        }
      }
    }

    if (keysPressed.get("q") || keysPressed.get("w")) {
      let x = this.pillPosition[0].x;
      let y = this.pillPosition[0].y;

      if (
        this.pillPosition[0].y === this.pillPosition[1].y &&
        y - 1 > 0 &&
        this.table[y - 1][x].cellType === "none"
      ) {
        this.table[y][x].side = Side.Bottom;
        this.table[this.pillPosition[1].y][this.pillPosition[1].x].side =
          Side.Top;

        moves.push({
          old: { x: x, y: y },
          new: { y: y, x: x },
          cell: this.table[y][x],
        });

        moves.push({
          old: { x: this.pillPosition[1].x, y: this.pillPosition[1].y },
          new: { y: y - 1, x: x },
          cell: this.table[this.pillPosition[1].y][this.pillPosition[1].x],
        });
      } else if (
        this.pillPosition[0].x === this.pillPosition[1].x &&
        x + 1 < this.width &&
        this.table[y][x + 1].cellType === "none"
      ) {
        this.table[this.pillPosition[1].y][this.pillPosition[1].x].side =
          Side.Left;
        this.table[y][x].side = Side.Right;

        moves.push({
          old: { x: this.pillPosition[1].x, y: this.pillPosition[1].y },
          new: { y: y, x: x },
          cell: this.table[this.pillPosition[1].y][this.pillPosition[1].x],
        });

        moves.push({
          old: { x: x, y: y },
          new: { y: y, x: x + 1 },
          cell: this.table[y][x],
        });
      }
    }

    if (keysPressed.get("e")) {
      let x = this.pillPosition[0].x;
      let y = this.pillPosition[0].y;

      if (
        this.pillPosition[0].y === this.pillPosition[1].y &&
        y - 1 > 0 &&
        this.table[y - 1][x].cellType === "none"
      ) {
        this.table[y][x].side = Side.Bottom;
        this.table[this.pillPosition[1].y][this.pillPosition[1].x].side =
          Side.Top;

        moves.push({
          old: { x: x, y: y },
          new: { y: y, x: x },
          cell: this.table[y][x],
        });

        moves.push({
          old: { x: this.pillPosition[1].x, y: this.pillPosition[1].y },
          new: { y: y - 1, x: x },
          cell: this.table[this.pillPosition[1].y][this.pillPosition[1].x],
        });
      } else if (
        this.pillPosition[0].x === this.pillPosition[1].x &&
        x - 1 >= 0 &&
        this.table[y][x - 1].cellType === "none"
      ) {
        this.table[this.pillPosition[1].y][this.pillPosition[1].x].side =
          Side.Right;
        this.table[y][x].side = Side.Left;

        moves.push({
          old: { x: this.pillPosition[1].x, y: this.pillPosition[1].y },
          new: { y: y, x: x },
          cell: this.table[this.pillPosition[1].y][this.pillPosition[1].x],
        });

        moves.push({
          old: { x: x, y: y },
          new: { y: y, x: x - 1 },
          cell: this.table[y][x],
        });
      }
    }

    if (moves.length === 2) {
      this.pillPosition.splice(0, this.pillPosition.length);

      // clear old moving pills
      for (const move of moves) {
        this.table[move.old.y][move.old.x] = this.emptyCell();
      }

      // draw new moving pills
      for (const move of moves) {
        this.table[move.new.y][move.new.x] = move.cell;
        this.pillPosition.push({ x: move.new.x, y: move.new.y });
      }
    }
  }

  /**
   * Method which checks for maching rows or columns
   * 
   * @todo fix when more than 2 microbes in one line
   *   -> now we are just removing the ability to spawn multiple microbes in one
   *   line inside {@link Game.randomMicrobes} method
   */
  private checkForMaches() {
    let counter: number;
    let wrongColor: boolean;
    let currentColor: string;

    for (let y = this.height - 1; y >= 0; y--) {
      const cellsInRow = this.table[y];
      counter = 0;
      currentColor = "";
      wrongColor = false;
      let microbe = 0;

      for (let i = 0; i < cellsInRow.length; i++) {
        const cell = cellsInRow[i];
        wrongColor = true;

        if (cell.cellType === "microbe") ++microbe;

        if (["pill", "microbe"].includes(cell.cellType)) {
          if (currentColor === cell.color) {
            wrongColor = false;
            counter++;

            if (i < cellsInRow.length - 1) continue;
          }

          currentColor = cell.color;
        } else {
          currentColor = "";
        }

        if (counter >= 3) {
          if (wrongColor) {
            microbe ? (this.score += microbe * 100) : (this.score -= 0);
            this.microbesNr -= microbe;
            // console.log("wrongX", this.score);

            for (let x = i - 1; x >= i - 1 - counter; x--) {
              this.ui.destroyPill(this.table[y][x].color, y, x);
              this.table[y][x] = this.emptyCell();
            }
          } else if (i === cellsInRow.length - 1) {
            microbe ? (this.score += microbe * 100) : (this.score -= 0);
            this.microbesNr -= microbe;
            // console.log("lastX", this.score);

            for (let x = i; x >= i - counter; x--) {
              this.ui.destroyPill(this.table[y][x].color, y, x);
              this.table[y][x] = this.emptyCell();
            }
          }
        }

        counter = 0;
      }
    }

    for (let x = 0; x < this.width; x++) {
      counter = 0;
      currentColor = "";
      let microbe = 0;

      for (let i = this.height - 1; i >= 0; i--) {
        const cell = this.table[i][x];
        wrongColor = true;

        if (cell.cellType === "microbe") ++microbe;

        if (["pill", "microbe"].includes(cell.cellType)) {
          if (currentColor === cell.color) {
            wrongColor = false;
            counter++;

            if (i > 0) continue;
          }

          currentColor = cell.color;
        } else {
          currentColor = "";
        }

        if (counter >= 3) {
          if (wrongColor) {
            microbe ? (this.score += microbe * 100) : (this.score -= 0);
            this.microbesNr -= microbe;
            // console.log("wrongY", counter, this.score);

            for (let y = i + 1; y <= i + 1 + counter; y++) {
              this.ui.destroyPill(this.table[y][x].color, y, x);
              this.table[y][x] = this.emptyCell();
            }
          } else if (i === 0 && counter >= 3) {
            microbe ? (this.score += microbe * 100) : (this.score -= 0);
            this.microbesNr -= microbe;
            // console.log("y0", this.score);

            for (let y = 0; y <= counter; y++) {
              this.ui.destroyPill(this.table[y][x].color, y, x);
              this.table[y][x] = this.emptyCell();
            }
          }
        }

        counter = 0;
      }

      this.ui.setScore(this.score);
      this.ui.setMicrobesLeft(this.microbesNr);
    }
  }

  /**
   * Method which checks if the game should end
   */
  private checkEndTheGame() {
    if (!(this.pillPosition && this.lastPillPosition)) return;

    if (this.microbesNr === 0) {
      if (this.score > this.bestScore) {
        this.bestScore = this.score;
        setBestScore(this.score);
      }

      cancelAnimationFrame(this.animationFrame);
      this.ui.stageCleared();
    }
  }
}
