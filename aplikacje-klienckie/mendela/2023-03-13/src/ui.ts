/**
 * Module which is used to present the game to the user
 * @module ui
 */

import throwAnimation from "./animations/throwAnimation";
import lensAnimation from "./animations/lensAnimation";
import { Cell, ui, spritesheet } from "./types";

/**
 * Class which draws the state of the game on the canvas
 * @beta
 */
export class Board implements ui {
  private height: number;
  private width: number;
  private canvW = 640;
  private canvH = 384;
  private ctx: CanvasRenderingContext2D;
  private spritesheet: HTMLImageElement;
  private currentFrame: number = 0;
  private topScore: number = 0;
  private score: number = 0;
  private sizeUnit = 16;
  private microbesLeft: number = 4;
  private throwAnimationTime = 0;
  private nextColors: [Cell["color"], Cell["color"]];
  private toDestroy: { sprite: string; x: number; y: number }[] = [];
  private toDraw: { spriteName: string; pos: { x: number; y: number } }[] =
    lensAnimation();
  /**
   * Property which stores positions and frames of the sprites
   */
  private json: spritesheet;
  /**
   * Variable which is used to check if all assets are loaded
   */
  public ok = false;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;

    const htmlBase = document.getElementById("game") ?? document.body;
    htmlBase.innerHTML = "";

    const canvasEl = document.createElement("canvas");
    canvasEl.width = this.canvW;
    canvasEl.height = this.canvH;
    canvasEl.id = "board";

    this.ctx = canvasEl.getContext("2d");

    this.loadJson();
    this.loadSprites();

    htmlBase.append(canvasEl);
  }

  /**
   * Method used to load spritesheet which containes all sprites (images) used 
   * in game.
   */
  private async loadSprites() {
    this.spritesheet = new Image();
    this.spritesheet.src = "./res/sprites.png";
    await this.spritesheet.decode();

    this.ok = true;
  }

  /**
   * Method used to load json file with locations of each sprite in spritesheet
   * to {@link ui.Board.json} property 
   */
  private async loadJson() {
    this.json = await fetch("./res/animations.json").then((res) => res.json());
  }

  /**
   * Method that is used to prepare next pill for animation
   * @param colors colors of the next pill
   */
  public preparePill(colors: [Cell["color"], Cell["color"]]) {
    this.nextColors = colors;
  }

  /**
   * Method that animates the doctor throwing the pill to the bottle
   * @returns true when animation has ended
   */
  public animateThrow(): Boolean {
    const throwAnimationLength = 24;

    if (this.throwAnimationTime === throwAnimationLength) {
      this.throwAnimationTime = 0;
      return true;
    }

    for (const el of throwAnimation(this.nextColors)[this.throwAnimationTime]) {
      this.drawFrame(el.spriteName, el.pos.x, el.pos.y);
    }

    this.throwAnimationTime++;
    return false;
  }

  /**
   * Method that is used to set the top score
   * @param score top score
   */
  public setTopScore(score: number) {
    this.topScore = score;
  }

  /**
   * Method that is used to set current score
   * @param score current score
   */
  public setScore(score: number) {
    this.score = score;
  }

  /**
   * Method that is used to set how many microbes are left
   * @param ammount number of microbes left
   */
  public setMicrobesLeft(ammount: number) {
    this.microbesLeft = ammount;
  }

  /**
   * Method that gets the position and size of the sprite from the 
   * {@link ui.Board.json} depending on the current frame.
   * @param name name of the sprite 
   * @returns position and size of the sprite 
   */
  private getFrame(name: string): [number, number, number, number] {
    if (!this.json) return [0, 0, 0, 0];

    const frame = this.currentFrame % this.json.sprites[name].framesNr;
    return Object.values(this.json.sprites[name].frames[frame]) as [
      number,
      number,
      number,
      number
    ];
  }

  /**
   * Method which returns the size of the sprite from the {@link ui.Board.json}
   * @param name name of the sprite
   * @returns width and height of the sprite
   */
  private getSize(name: string): [number, number] {
    if (!this.json) return [0, 0];

    return [this.json.sprites[name].size.w, this.json.sprites[name].size.h];
  }

  /**
   * Method that draws a sprite on the canvas
   * @param name sprite name
   * @param x x position
   * @param y y position
   */
  private drawFrame(name: string, x: number, y: number) {
    this.ctx.drawImage(
      this.spritesheet,
      ...this.getFrame(name),
      x,
      y,
      ...this.getSize(name)
    );
  }

  /**
   * Method that draws text (numbers) on the canvas
   * @param text text to draw
   * @param size length of text
   * @param leftMargin x position
   * @param topMargin y position
   */
  private drawText(
    text: number | string,
    size: number,
    leftMargin: number,
    topMargin: number
  ) {
    let s: string[];
    let charArr: string[];

    s = text.toString().split("");
    charArr = new Array(size);
    for (let i = 0; i < s.length; i++) charArr[size - s.length + i] = s[i];
    charArr.fill("0", 0, size - s.length);

    for (let i = 0; i < size; i++) {
      this.ctx.drawImage(
        this.spritesheet,
        ...this.getFrame(charArr[i]),
        (leftMargin + i) * this.sizeUnit,
        topMargin * this.sizeUnit,
        ...this.getSize(charArr[i])
      );
    }
  }

  /**
   * Method that displays game over popup and changes doctors sprite
   */
  public gameOver() {
    const [x, y] = this.getSize("pop_gameOver");
    const dispX = (this.canvW - x) / 2;
    const dispY = (this.canvH - y) / 2;

    this.drawFrame("pop_gameOver", dispX, dispY);
    this.drawFrame("dr_gameOver", 480, 48);
  }

  /**
   * Method that displays stage cleared popup
   */
  public stageCleared() {
    const [x, y] = this.getSize("pop_stageCleared");
    const dispX = (this.canvW - x) / 2;
    const dispY = (this.canvH - y) / 2;

    this.drawFrame("pop_stageCleared", dispX, dispY);
  }

  /**
   * Method that draws a given cell on a given position
   * @param cellData 
   * @param y y position
   * @param x x position
   */
  private drawCell(cellData: Cell, y: number, x: number) {
    const dispX = (17 + x) * this.sizeUnit;
    const dispY = (6 + y) * this.sizeUnit;

    switch (cellData.cellType) {
      case "movingPill":
      case "pill":
        // cellData.
        this.drawFrame(`pill_${cellData.color}_${cellData.side}`, dispX, dispY);
        break;
      case "microbe":
        this.drawFrame(`microbe_${cellData.color}`, dispX, dispY);
        break;
    }
  }

  /**
   * Method which draws a destroyed cell sprite
   * @param color cells color
   * @param y y position
   * @param x x position
   */
  public destroyPill(color: Cell["color"], y: number, x: number) {
    const dispX = (17 + x) * this.sizeUnit;
    const dispY = (6 + y) * this.sizeUnit;

    // temporary fix
    if(color === undefined) return;

    this.toDestroy.push({ sprite: `pill_${color}_pop`, x: dispX, y: dispY });
  }

  /**
   * Method that is used to draw the whole game board.
   * @param gameBoard 
   */
  public drawBoard(gameBoard: Cell[][]) {
    this.currentFrame++;

    // drawBackground
    this.drawFrame("bg", 0, 0);

    if (this.toDestroy.length != 0) {
      for (const el of this.toDestroy) {
        this.drawFrame(el.sprite, el.x, el.y);
      }

      this.toDestroy = [];
    }

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.drawCell(gameBoard[y][x], y, x);
      }
    }

    if (this.currentFrame % 5 === 0) this.toDraw = lensAnimation();
    for (const el of this.toDraw) {
      this.drawFrame(el.spriteName, el.pos.x, el.pos.y);
    }

    this.drawText(this.topScore, 7, 5, 5);
    this.drawText(this.score, 7, 5, 8);
    this.drawText(this.microbesLeft, 2, 35, 21);

    // this.drawFrame("hand_down_p1", 496, 96)
    // this.drawFrame("hand_down_p2", 496, 112)
    // this.drawFrame("hand_middle_p1", 480, 80)
    // this.drawFrame("hand_middle_p2", 496, 80)
    // this.drawFrame("hand_middle_p3", 480, 96)
    // this.drawFrame("hand_middle_p4", 496, 96)
    if (this.throwAnimationTime === 0) {
      this.drawFrame("hand_up_p1", 496, 64);
      this.drawFrame("hand_up_p2", 496, 80);
      this.drawFrame("hand_up_p3", 496, 96);
      this.drawFrame(`pill_${this.nextColors[0]}_3`, 480, 48);
      this.drawFrame(`pill_${this.nextColors[1]}_4`, 496, 48);
    }
  }
}
