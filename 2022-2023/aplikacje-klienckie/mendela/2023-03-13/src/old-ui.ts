/**
 * Module which contains a class used for presenting games state to the player.
 * @module old-ui
 * @deprecated Use {@link ui} instead
 */

import { Cell, Side, ui } from "./types";

/**
 * Class which is used for presentation of the game state using divs styled with
 * css. No fancy graphics included.
 * 
 * @deprecated Use {@link ui.Board} instead
 */
export class Board implements ui {
  width: number;
  height: number;
  htmlBase: HTMLElement;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;

    this.htmlBase = document.getElementById("game") ?? document.body;
  }

  //
  public setScore(score: number): void {}
  public setTopScore(score: number): void {}
  public setMicrobesLeft(ammount: number): void {}
  public gameOver(): void {
    alert("game over");
  }
  public stageCleared(): void {
    alert("stage cleared");
  }
  public preparePill(
    colors: ["red" | "blue" | "yellow", "red" | "blue" | "yellow"]
  ): void {}
  public animateThrow(): Boolean {
    return true;
  }
  public destroyPill() {}

  drawBoard(gameBoard: Cell[][]) {
    this.htmlBase.innerHTML = "";

    const board = document.createElement("div");
    board.id = "board";

    for (let y = 0; y < this.height; y++) {
      const row = document.createElement("div");
      for (let x = 0; x < this.width; x++) {
        const cell = gameBoard[y][x];
        const cellEl = this.drawCell(cell, cell.side);
        row.append(cellEl);
      }
      board.append(row);
    }

    this.htmlBase.append(board);
  }

  drawCell(cellData: Cell, side: Side = Side.All): HTMLDivElement {
    const cell = document.createElement("div");
    cell.classList.add("cell");

    switch (cellData.cellType) {
      case "movingPill":
      case "pill":
        cell.innerText = cellData.nr.toString();
        cell.classList.add(cellData.color!);
        switch (side) {
          case 0:
            cell.classList.add("s-all");
            break;
          case 1:
            cell.classList.add("s-top");
            break;
          case 2:
            cell.classList.add("s-bottom");
            break;
          case 3:
            cell.classList.add("s-left");
            break;
          case 4:
            cell.classList.add("s-right");
            break;
        }
        return cell;
      case "microbe":
        cell.innerText = "M";
        cell.classList.add("s-all");
        cell.classList.add(cellData.color!);
        return cell;
      default:
        return cell;
    }
  }
}
