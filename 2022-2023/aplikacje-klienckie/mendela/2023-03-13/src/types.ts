/**
 * Module with most of the types, interfaces and enums in this project
 * @module types
 */

export interface ui {
  drawBoard(gameBoard: Cell[][]): void;
  preparePill(colors: [Cell["color"], Cell["color"]]): void;
  animateThrow(): Boolean;
  setTopScore(score: number): void;
  setScore(score: number): void;
  setMicrobesLeft(ammount: number): void;
  gameOver(): void;
  stageCleared(): void;
}

interface useless {
  itDoesNothing(): void;
  variable01: Boolean;
  variableText: String;
  variableNum: Number;
}

export type frameInfo = {
  framesNr: number;
  frames: [
    {
      x: number;
      y: number;
      w: number;
      h: number;
    }
  ];
  size: {
    w: number;
    h: number;
  };
};

export type spritesheet = {
  sprites: { [key: string]: frameInfo };
};

// mogły by to równie dobrze być interfejsy ale bardziej sensowne wydało mi się użycie typów

export type Cell = {
  cellType: "movingPill" | "pill" | "microbe" | "none";
  color?: "red" | "blue" | "yellow";
  nr?: number;
  side?: Side;
};

export enum Side {
  All,
  Top,
  Bottom,
  Left,
  Right,
}

export type Point = {
  x: number;
  y: number;
};

export type Move = {
  old: {
    x: number;
    y: number;
  };
  new: {
    x: number;
    y: number;
  };
  cell: Cell;
};
