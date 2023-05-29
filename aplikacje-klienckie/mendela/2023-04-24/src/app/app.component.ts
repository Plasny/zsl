import { Component } from '@angular/core';

type point = {
  x: number;
  y: number;
};

type player = {
  type: 'X' | 'O';
  points: number;
};

type field = {
  type: 'X' | 'O' | '';
  dontcheck: boolean;
};

type lineParams = {
  value: number;
  first?: point;
  last?: point;
};

type moveParams = {
  horizontal: lineParams;
  vertical: lineParams;
  diagonal1: lineParams;
  diagonal2: lineParams;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = '2023-03-06';
  started = false;
  playing = false;

  maxPoints: number = 3;
  boardHeight: number = 20;
  boardWidth: number = 20;
  board: field[][] = [];
  lastInserted: point = { x: -1, y: -1 };

  player: player = { type: 'O', points: 0 };
  opponent: player = { type: 'X', points: 0 };
  p = [this.player, this.opponent];
  currentPlayer: number = 0;

  start() {
    this.player.points = 0;
    this.opponent.points = 0;

    if (this.player.type === 'O') this.opponent.type = 'X';
    else this.opponent.type = 'O';

    this.board = Array(this.boardHeight)
      .fill(null)
      .map(() => Array(this.boardWidth).fill({ type: '', dontcheck: false }));

    this.started = true;
    this.playing = true;
  }

  set(x: number, y: number) {
    if (!this.playing) return;
    if (this.board[y][x].type != '') return;

    this.board[y][x] = { type: this.player.type, dontcheck: false };

    console.log('players move - x:', x, 'y:', y);
    const moveParams = this.check(x, y);

    if (!this.playing) return;

    this.aiMove(x, y, moveParams);
  }

  aiMove(pMoveX: number, pMoveY: number, moveParams: moveParams) {
    this.currentPlayer = 1;

    let key: string | boolean;
    let x: number;
    let y: number;
    let i = 1;

    if ((key = !Object.values(moveParams).every((v) => v.value === 0))) {
      key = Object.keys(moveParams).reduce((a, b) =>
        // @ts-ignore
        moveParams[a].value > moveParams[b].value ? a : b
      );
    }

    try {
      switch (key) {
        // @ts-expect-error
        case 'horizontal':
          const tileToTheLeft =
            this.board[moveParams.horizontal.first!.y][moveParams.horizontal.first!.x - 1];
          const tileToTheRight =
            this.board[moveParams.horizontal.last!.y][moveParams.horizontal.last!.x + 1];
          y = moveParams.horizontal.first!.y;

          if (tileToTheLeft !== undefined && tileToTheLeft.type === '') {
            x = moveParams.horizontal.first!.x - 1;
            console.warn('horizontal left');
            break;
          }
          if (tileToTheRight !== undefined && tileToTheRight.type === '') {
            x = moveParams.horizontal.last!.x + 1;
            console.warn('horizontal right');
            break;
          }
        // @ts-expect-error
        case 'vertical':
          const tileOnTop =
            this.board[moveParams.vertical.first!.y - 1][moveParams.vertical.first!.x];
          const tileOnBottom =
            this.board[moveParams.vertical.last!.y + 1][moveParams.vertical.last!.x];
          x = moveParams.vertical.first!.x;

          if (tileOnTop !== undefined && tileOnTop.type === '') {
            y = moveParams.vertical.first!.y - 1;
            console.warn('vertical top');
            break;
          }
          if (tileOnBottom !== undefined && tileOnBottom.type === '') {
            y = moveParams.vertical.last!.y + 1;
            console.warn('vertical bottom');
            break;
          }
        // @ts-expect-error
        case 'diagonal1':
          const begginingOfTiles1 =
            this.board[moveParams.diagonal1.first!.y - 1][moveParams.diagonal1.first!.x - 1];
          const endOfTiles1 =
            this.board[moveParams.diagonal1.last!.y + 1][moveParams.diagonal1.last!.x + 1];

          if (
            begginingOfTiles1 !== undefined &&
            begginingOfTiles1.type === ''
          ) {
            x = moveParams.diagonal1.first!.x - 1;
            y = moveParams.diagonal1.first!.y - 1;
            console.warn('diagonal1 start');
            break;
          }
          if (endOfTiles1 !== undefined && endOfTiles1.type === '') {
            x = moveParams.diagonal1.last!.x + 1;
            y = moveParams.diagonal1.last!.y + 1;
            console.warn('diagonal1 end');
            break;
          }
        // @ts-expect-error
        case 'diagonal2':
          const begginingOfTiles2 =
            this.board[moveParams.diagonal2.first!.y + 1][moveParams.diagonal2.first!.x - 1];
          const endOfTiles2 =
            this.board[moveParams.diagonal2.last!.y - 1][moveParams.diagonal2.last!.x + 1];

          if (
            begginingOfTiles2 !== undefined &&
            begginingOfTiles2.type === ''
          ) {
            x = moveParams.diagonal2.first!.x - 1;
            y = moveParams.diagonal2.first!.y + 1;
            console.warn('diagonal2 start');
            break;
          }
          if (endOfTiles2 !== undefined && endOfTiles2.type === '') {
            x = moveParams.diagonal2.last!.x + 1;
            y = moveParams.diagonal2.last!.y - 1;
            console.warn('diagonal2 end');
            break;
          }
        default:
          // todo move code from catch here
          throw "default"
      }
    } catch {
      // lazy fix -> to refactor
      while (true) {
        if (i < 10) {
          x = Math.floor(pMoveX - Math.random() * 3 + 2);
          y = Math.floor(pMoveY - Math.random() * 3 + 2);
        } else {
          x = Math.floor(Math.random() * this.boardWidth);
          y = Math.floor(Math.random() * this.boardHeight);
        }

        if (
          x >= 0 &&
          y >= 0 &&
          x < this.boardWidth &&
          y < this.boardHeight &&
          this.board[y][x].type === ''
        )
          break;
        i++;
      }
    }

    this.board[y][x] = { type: this.opponent.type, dontcheck: false };
    this.lastInserted = { x: x, y: y };

    console.log('opponents move - x:', x, 'y:', y);
    this.check(x, y);

    this.currentPlayer = 0;
  }

  check(x: number, y: number): moveParams {
    let currentType: field['type'];

    let moveParams: moveParams = {
      horizontal: { value: -1 },
      vertical: { value: -1 },
      diagonal1: { value: -1 },
      diagonal2: { value: -1 },
    };

    let i: number,
      start: number,
      end: number,
      x1: number,
      y1: number,
      count: number;

    console.groupCollapsed('check');

    // -------------------- horizontal (-) check --------------------
    console.log('(-) horizontal:');
    count = 0;
    currentType = '';
    start = x - 4 < 0 ? 0 : x - 4;
    end = x + 6 > this.boardWidth ? this.boardWidth : x + 6;

    for (i = start; i < end; i++) {
      if (this.board[y][i].dontcheck) {
        if (count >= 4) break;

        count = 0;
        currentType = '';
        continue;
      }

      if (currentType === this.board[y][i].type && currentType != '') {
        if (moveParams.horizontal.first === undefined) {
          moveParams.horizontal.first = { x: i - 1, y: y };
        }
        count++;
      } else {
        if (moveParams.horizontal.value < count) {
          moveParams.horizontal.value = count;
          moveParams.horizontal.last = { x: i - 1, y: y };
        }
        if (count >= 4) break;
        count = 0;
      }

      currentType = this.board[y][i].type;

      console.log('x:', i, 'y:', y, 'count:', count, 'type:', currentType);
    }

    if (count >= 4) {
      for (let j = i - 1; j >= i - count - 1; j--) {
        this.board[y][j].dontcheck = true;
      }
      this.p[this.currentPlayer].points++;
    }

    // -------------------- vertical (|) check --------------------
    console.log('(|) vertical:');
    count = 0;
    currentType = '';
    start = y - 4 < 0 ? 0 : y - 4;
    end = y + 6 > this.boardHeight ? this.boardHeight : y + 6;
    for (i = start; i < end; i++) {
      if (this.board[i][x].dontcheck) {
        if (count >= 4) break;

        count = 0;
        currentType = '';
        continue;
      }

      if (currentType === this.board[i][x].type && currentType != '') {
        if (moveParams.vertical.first === undefined) {
          moveParams.vertical.first = { x: x, y: i - 1 };
        }
        count++;
      } else {
        if (moveParams.vertical.value < count) {
          moveParams.vertical.value = count;
          moveParams.vertical.last = { x: x, y: i - 1 };
        }
        if (count >= 4) break;
        count = 0;
      }

      currentType = this.board[i][x].type;

      console.log('x:', x, 'y:', i, 'count:', count, 'type:', currentType);
    }

    if (count >= 4) {
      for (let j = i - 1; j >= i - count - 1; j--) {
        this.board[j][x].dontcheck = true;
      }
      this.p[this.currentPlayer].points++;
    }

    // -------------------- diagonal (\) check --------------------
    console.log('(\\) diagonal 1:');
    count = 0;
    currentType = '';
    let points: point[] = [];
    for (i = 9; i >= 0; i--) {
      let x1 = x + 4 - i;
      let y1 = y + 4 - i;

      if (x1 < 0 || y1 < 0 || x1 >= this.boardWidth || y1 >= this.boardHeight)
        continue;

      if (this.board[y1][x1].dontcheck) {
        if (count >= 4) break;

        count = 0;
        points = [{ x: x1, y: y1 }];
        currentType = '';
        continue;
      }

      if (currentType === this.board[y1][x1].type && currentType != '') {
        count++;
        points.push({ x: x1, y: y1 });
      } else {
        if (moveParams.diagonal1.value < count) {
          moveParams.diagonal1.value = count;
          moveParams.diagonal1.first = points[0];
          moveParams.diagonal1.last = points[points.length - 1];
        }
        if (count >= 4) break;
        count = 0;
        points = [{ x: x1, y: y1 }];
      }

      currentType = this.board[y1][x1].type;

      console.log('x:', x1, 'y:', y1, 'count:', count, 'type:', currentType);
    }

    if (count >= 4) {
      for (const p of points) {
        this.board[p.y][p.x].dontcheck = true;
      }

      this.p[this.currentPlayer].points++;
    }

    // -------------------- diagonal (/) check --------------------
    console.log('(/) diagonal 2:');
    count = 0;
    currentType = '';
    points = [];
    for (i = 9; i >= 0; i--) {
      x1 = x + 4 - i;
      y1 = y + i - 4;

      if (x1 < 0 || y1 < 0 || x1 >= this.boardWidth || y1 >= this.boardHeight)
        continue;

      if (this.board[y1][x1].dontcheck) {
        if (count >= 4) break;

        count = 0;
        points = [{ x: x1, y: y1 }];
        currentType = '';
        continue;
      }

      if (currentType === this.board[y1][x1].type && currentType != '') {
        count++;
        points.push({ x: x1, y: y1 });
      } else {
        if (moveParams.diagonal2.value < count) {
          moveParams.diagonal2.value = count;
          moveParams.diagonal2.first = points[0];
          moveParams.diagonal2.last = points[points.length - 1];
        }
        if (count >= 4) break;
        count = 0;
        points = [{ x: x1, y: y1 }];
      }

      currentType = this.board[y1][x1].type;

      console.log('x:', x1, 'y:', y1, 'count:', count, 'type:', currentType);
    }

    if (count >= 4) {
      for (const p of points) {
        this.board[p.y][p.x].dontcheck = true;
      }

      this.p[this.currentPlayer].points++;
    }

    console.log('summary:', moveParams);
    console.groupEnd();

    if (this.player.points >= this.maxPoints) {
      alert('You won!');
      this.playing = false;
    }
    if (this.opponent.points >= this.maxPoints) {
      alert('You lost!');
      this.playing = false;
    }

    return moveParams;
  }
}
