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
    this.check(x, y);

    if (!this.playing) return;

    this.aiMove(x, y);
  }

  // to upgrade
  aiMove(pMoveX: number, pMoveY: number) {
    this.currentPlayer = 1;

    let x: number;
    let y: number;
    let i = 1;

    while (true) {
      if (i < 5) {
        x = Math.floor(pMoveX - Math.random() * 3 + 2);
        y = Math.floor(pMoveY - Math.random() * 3 + 2);
      } else {
        x = Math.floor(Math.random() * this.boardWidth);
        y = Math.floor(Math.random() * this.boardHeight);
      }

      if (this.board[y][x].type === '') break;
      i++;
    }

    this.board[y][x] = { type: this.opponent.type, dontcheck: false };
    this.lastInserted = { x: x, y: y };

    console.log('opponents move - x:', x, 'y:', y);
    this.check(x, y);

    this.currentPlayer = 0;
  }

  check(x: number, y: number) {
    console.groupCollapsed('check');
    let i: number, start: number, end: number, x1: number, y1: number;
    let count: number;
    let currentType: field['type'];

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
        count++;
      } else {
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
        count++;
      } else {
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
        if (count >= 4) {
          break;
        }
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

    console.groupEnd();

    if (this.player.points >= this.maxPoints) {
      alert('You won!');
      this.playing = false;
    }
    if (this.opponent.points >= this.maxPoints) {
      alert('You lost!');
      this.playing = false;
    }
  }
}
