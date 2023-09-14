import { Cell } from "../types";
const unit = 16;
const marginLeft = 304; //0

// 1-top, 2-down, 3-left, 4-right

/**
 * Function which returns animation for doctor and pill 
 * @returns object with animation instructions
 */
export default function throwAnimation(colors: [Cell["color"], Cell["color"]]) {
  return [
    [
      {
        spriteName: `pill_${colors[0]}_3`,
        pos: {
          x: 11 * unit + marginLeft,
          y: 3 * unit,
        },
      },
      {
        spriteName: `pill_${colors[1]}_4`,
        pos: {
          x: 12 * unit + marginLeft,
          y: 3 * unit,
        },
      },
      {
        spriteName: `hand_up_p1`,
        pos: {
          x: 496,
          y: 64,
        },
      },
      {
        spriteName: `hand_up_p2`,
        pos: {
          x: 496,
          y: 80,
        },
      },
      {
        spriteName: `hand_up_p3`,
        pos: {
          x: 496,
          y: 96,
        },
      },
    ],
    [
      {
        spriteName: `pill_${colors[0]}_2`,
        pos: {
          x: 11 * unit + marginLeft,
          y: 3 * unit,
        },
      },
      {
        spriteName: `pill_${colors[1]}_1`,
        pos: {
          x: 11 * unit + marginLeft,
          y: 2 * unit,
        },
      },
      {
        spriteName: `hand_up_p1`,
        pos: {
          x: 496,
          y: 64,
        },
      },
      {
        spriteName: `hand_up_p2`,
        pos: {
          x: 496,
          y: 80,
        },
      },
      {
        spriteName: `hand_up_p3`,
        pos: {
          x: 496,
          y: 96,
        },
      },
    ],
    [
      {
        spriteName: `pill_${colors[0]}_4`,
        pos: {
          x: 11 * unit + marginLeft,
          y: 2 * unit,
        },
      },
      {
        spriteName: `pill_${colors[1]}_3`,
        pos: {
          x: 10 * unit + marginLeft,
          y: 2 * unit,
        },
      },
      {
        spriteName: `hand_up_p1`,
        pos: {
          x: 496,
          y: 64,
        },
      },
      {
        spriteName: `hand_up_p2`,
        pos: {
          x: 496,
          y: 80,
        },
      },
      {
        spriteName: `hand_up_p3`,
        pos: {
          x: 496,
          y: 96,
        },
      },
    ],
    [
      {
        spriteName: `pill_${colors[1]}_2`,
        pos: {
          x: 10 * unit + marginLeft,
          y: 2 * unit,
        },
      },
      {
        spriteName: `pill_${colors[0]}_1`,
        pos: {
          x: 10 * unit + marginLeft,
          y: 1 * unit,
        },
      },
      {
        spriteName: `hand_up_p1`,
        pos: {
          x: 496,
          y: 64,
        },
      },
      {
        spriteName: `hand_up_p2`,
        pos: {
          x: 496,
          y: 80,
        },
      },
      {
        spriteName: `hand_up_p3`,
        pos: {
          x: 496,
          y: 96,
        },
      },
    ],
    [
      {
        spriteName: `pill_${colors[1]}_4`,
        pos: {
          x: 10 * unit + marginLeft,
          y: 1 * unit,
        },
      },
      {
        spriteName: `pill_${colors[0]}_3`,
        pos: {
          x: 9 * unit + marginLeft,
          y: 1 * unit,
        },
      },
      {
        spriteName: `hand_middle_p1`,
        pos: {
          x: 480,
          y: 80,
        },
      },
      {
        spriteName: `hand_middle_p2`,
        pos: {
          x: 496,
          y: 80,
        },
      },
      {
        spriteName: `hand_middle_p3`,
        pos: {
          x: 480,
          y: 96,
        },
      },
      {
        spriteName: `hand_middle_p4`,
        pos: {
          x: 496,
          y: 96,
        },
      },
    ],
    [
      {
        spriteName: `pill_${colors[0]}_2`,
        pos: {
          x: 9 * unit + marginLeft,
          y: 1 * unit,
        },
      },
      {
        spriteName: `pill_${colors[1]}_1`,
        pos: {
          x: 9 * unit + marginLeft,
          y: 0 * unit,
        },
      },
      {
        spriteName: `hand_middle_p1`,
        pos: {
          x: 480,
          y: 80,
        },
      },
      {
        spriteName: `hand_middle_p2`,
        pos: {
          x: 496,
          y: 80,
        },
      },
      {
        spriteName: `hand_middle_p3`,
        pos: {
          x: 480,
          y: 96,
        },
      },
      {
        spriteName: `hand_middle_p4`,
        pos: {
          x: 496,
          y: 96,
        },
      },
    ],
    [
      {
        spriteName: `pill_${colors[0]}_4`,
        pos: {
          x: 9 * unit + marginLeft,
          y: 1 * unit,
        },
      },
      {
        spriteName: `pill_${colors[1]}_3`,
        pos: {
          x: 8 * unit + marginLeft,
          y: 1 * unit,
        },
      },
      {
        spriteName: `hand_middle_p1`,
        pos: {
          x: 480,
          y: 80,
        },
      },
      {
        spriteName: `hand_middle_p2`,
        pos: {
          x: 496,
          y: 80,
        },
      },
      {
        spriteName: `hand_middle_p3`,
        pos: {
          x: 480,
          y: 96,
        },
      },
      {
        spriteName: `hand_middle_p4`,
        pos: {
          x: 496,
          y: 96,
        },
      },
    ],
    [
      {
        spriteName: `pill_${colors[1]}_2`,
        pos: {
          x: 8 * unit + marginLeft,
          y: 1 * unit,
        },
      },
      {
        spriteName: `pill_${colors[0]}_1`,
        pos: {
          x: 8 * unit + marginLeft,
          y: 0 * unit,
        },
      },
      {
        spriteName: `hand_down_p1`,
        pos: {
          x: 496,
          y: 96,
        },
      },
      {
        spriteName: `hand_down_p2`,
        pos: {
          x: 496,
          y: 112,
        },
      },
    ],
    [
      {
        spriteName: `pill_${colors[1]}_4`,
        pos: {
          x: 8 * unit + marginLeft,
          y: 1 * unit,
        },
      },
      {
        spriteName: `pill_${colors[0]}_3`,
        pos: {
          x: 7 * unit + marginLeft,
          y: 1 * unit,
        },
      },
      {
        spriteName: `hand_down_p1`,
        pos: {
          x: 496,
          y: 96,
        },
      },
      {
        spriteName: `hand_down_p2`,
        pos: {
          x: 496,
          y: 112,
        },
      },
    ],
    [
      {
        spriteName: `pill_${colors[0]}_2`,
        pos: {
          x: 7 * unit + marginLeft,
          y: 1 * unit,
        },
      },
      {
        spriteName: `pill_${colors[1]}_1`,
        pos: {
          x: 7 * unit + marginLeft,
          y: 0 * unit,
        },
      },
      {
        spriteName: `hand_down_p1`,
        pos: {
          x: 496,
          y: 96,
        },
      },
      {
        spriteName: `hand_down_p2`,
        pos: {
          x: 496,
          y: 112,
        },
      },
    ],
    [
      {
        spriteName: `pill_${colors[0]}_4`,
        pos: {
          x: 7 * unit + marginLeft,
          y: 1 * unit,
        },
      },
      {
        spriteName: `pill_${colors[1]}_3`,
        pos: {
          x: 6 * unit + marginLeft,
          y: 1 * unit,
        },
      },
      {
        spriteName: `hand_down_p1`,
        pos: {
          x: 496,
          y: 96,
        },
      },
      {
        spriteName: `hand_down_p2`,
        pos: {
          x: 496,
          y: 112,
        },
      },
    ],
    [
      {
        spriteName: `pill_${colors[1]}_2`,
        pos: {
          x: 6 * unit + marginLeft,
          y: 1 * unit,
        },
      },
      {
        spriteName: `pill_${colors[0]}_1`,
        pos: {
          x: 6 * unit + marginLeft,
          y: 0 * unit,
        },
      },
      {
        spriteName: `hand_down_p1`,
        pos: {
          x: 496,
          y: 96,
        },
      },
      {
        spriteName: `hand_down_p2`,
        pos: {
          x: 496,
          y: 112,
        },
      },
    ],
    [
      {
        spriteName: `pill_${colors[1]}_4`,
        pos: {
          x: 6 * unit + marginLeft,
          y: 1 * unit,
        },
      },
      {
        spriteName: `pill_${colors[0]}_3`,
        pos: {
          x: 5 * unit + marginLeft,
          y: 1 * unit,
        },
      },
      {
        spriteName: `hand_down_p1`,
        pos: {
          x: 496,
          y: 96,
        },
      },
      {
        spriteName: `hand_down_p2`,
        pos: {
          x: 496,
          y: 112,
        },
      },
    ],
    [
      {
        spriteName: `pill_${colors[0]}_2`,
        pos: {
          x: 5 * unit + marginLeft,
          y: 1 * unit,
        },
      },
      {
        spriteName: `pill_${colors[1]}_1`,
        pos: {
          x: 5 * unit + marginLeft,
          y: 0 * unit,
        },
      },
      {
        spriteName: `hand_down_p1`,
        pos: {
          x: 496,
          y: 96,
        },
      },
      {
        spriteName: `hand_down_p2`,
        pos: {
          x: 496,
          y: 112,
        },
      },
    ],
    [
      {
        spriteName: `pill_${colors[0]}_4`,
        pos: {
          x: 5 * unit + marginLeft,
          y: 1 * unit,
        },
      },
      {
        spriteName: `pill_${colors[1]}_3`,
        pos: {
          x: 4 * unit + marginLeft,
          y: 1 * unit,
        },
      },
      {
        spriteName: `hand_down_p1`,
        pos: {
          x: 496,
          y: 96,
        },
      },
      {
        spriteName: `hand_down_p2`,
        pos: {
          x: 496,
          y: 112,
        },
      },
    ],
    [
      {
        spriteName: `pill_${colors[1]}_2`,
        pos: {
          x: 4 * unit + marginLeft,
          y: 1 * unit,
        },
      },
      {
        spriteName: `pill_${colors[0]}_1`,
        pos: {
          x: 4 * unit + marginLeft,
          y: 0 * unit,
        },
      },
      {
        spriteName: `hand_down_p1`,
        pos: {
          x: 496,
          y: 96,
        },
      },
      {
        spriteName: `hand_down_p2`,
        pos: {
          x: 496,
          y: 112,
        },
      },
    ],
    [
      {
        spriteName: `pill_${colors[1]}_4`,
        pos: {
          x: 4 * unit + marginLeft,
          y: 1 * unit,
        },
      },
      {
        spriteName: `pill_${colors[0]}_3`,
        pos: {
          x: 3 * unit + marginLeft,
          y: 1 * unit,
        },
      },
      {
        spriteName: `hand_down_p1`,
        pos: {
          x: 496,
          y: 96,
        },
      },
      {
        spriteName: `hand_down_p2`,
        pos: {
          x: 496,
          y: 112,
        },
      },
    ],
    [
      {
        spriteName: `pill_${colors[0]}_2`,
        pos: {
          x: 3 * unit + marginLeft,
          y: 1 * unit,
        },
      },
      {
        spriteName: `pill_${colors[1]}_1`,
        pos: {
          x: 3 * unit + marginLeft,
          y: 0 * unit,
        },
      },
      {
        spriteName: `hand_down_p1`,
        pos: {
          x: 496,
          y: 96,
        },
      },
      {
        spriteName: `hand_down_p2`,
        pos: {
          x: 496,
          y: 112,
        },
      },
    ],
    [
      {
        spriteName: `pill_${colors[0]}_4`,
        pos: {
          x: 3 * unit + marginLeft,
          y: 2 * unit,
        },
      },
      {
        spriteName: `pill_${colors[1]}_3`,
        pos: {
          x: 2 * unit + marginLeft,
          y: 2 * unit,
        },
      },
      {
        spriteName: `hand_down_p1`,
        pos: {
          x: 496,
          y: 96,
        },
      },
      {
        spriteName: `hand_down_p2`,
        pos: {
          x: 496,
          y: 112,
        },
      },
    ],
    [
      {
        spriteName: `pill_${colors[1]}_2`,
        pos: {
          x: 2 * unit + marginLeft,
          y: 3 * unit,
        },
      },
      {
        spriteName: `pill_${colors[0]}_1`,
        pos: {
          x: 2 * unit + marginLeft,
          y: 2 * unit,
        },
      },
      {
        spriteName: `hand_down_p1`,
        pos: {
          x: 496,
          y: 96,
        },
      },
      {
        spriteName: `hand_down_p2`,
        pos: {
          x: 496,
          y: 112,
        },
      },
    ],
    [
      {
        spriteName: `pill_${colors[1]}_4`,
        pos: {
          x: 2 * unit + marginLeft,
          y: 3 * unit,
        },
      },
      {
        spriteName: `pill_${colors[0]}_3`,
        pos: {
          x: 1 * unit + marginLeft,
          y: 3 * unit,
        },
      },
      {
        spriteName: `hand_down_p1`,
        pos: {
          x: 496,
          y: 96,
        },
      },
      {
        spriteName: `hand_down_p2`,
        pos: {
          x: 496,
          y: 112,
        },
      },
    ],
    [
      {
        spriteName: `pill_${colors[1]}_4`,
        pos: {
          x: 2 * unit + marginLeft,
          y: 4 * unit,
        },
      },
      {
        spriteName: `pill_${colors[0]}_3`,
        pos: {
          x: 1 * unit + marginLeft,
          y: 4 * unit,
        },
      },
      {
        spriteName: `hand_down_p1`,
        pos: {
          x: 496,
          y: 96,
        },
      },
      {
        spriteName: `hand_down_p2`,
        pos: {
          x: 496,
          y: 112,
        },
      },
    ],
    [
      {
        spriteName: `pill_${colors[1]}_4`,
        pos: {
          x: 2 * unit + marginLeft,
          y: 5 * unit,
        },
      },
      {
        spriteName: `pill_${colors[0]}_3`,
        pos: {
          x: 1 * unit + marginLeft,
          y: 5 * unit,
        },
      },
      {
        spriteName: `hand_down_p1`,
        pos: {
          x: 496,
          y: 96,
        },
      },
      {
        spriteName: `hand_down_p2`,
        pos: {
          x: 496,
          y: 112,
        },
      },
    ],
    [
      {
        spriteName: `pill_${colors[1]}_4`,
        pos: {
          x: 2 * unit + marginLeft,
          y: 6 * unit,
        },
      },
      {
        spriteName: `pill_${colors[0]}_3`,
        pos: {
          x: 1 * unit + marginLeft,
          y: 6 * unit,
        },
      },
      {
        spriteName: `hand_down_p1`,
        pos: {
          x: 496,
          y: 96,
        },
      },
      {
        spriteName: `hand_down_p2`,
        pos: {
          x: 496,
          y: 112,
        },
      },
    ],
  ];
}
