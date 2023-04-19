const unit = 16;
let colors = ["blue", "red", "yellow"];

/**
 * Function which returns animation for lens
 * @returns object with animation instructions
 */
export default function lensAnimation() {
    colors.unshift(colors.pop())
  
  return [
    {
      spriteName: `microbe_${colors[0]}_big`,
      pos: {
        x: 5 * unit,
        y: 19 * unit,
      },
    },
    {
      spriteName: `microbe_${colors[1]}_big`,
      pos: {
        x: 7 * unit,
        y: 15 * unit,
      },
    },
    {
      spriteName: `microbe_${colors[2]}_big`,
      pos: {
        x: 3 * unit,
        y: 15 * unit,
      },
    },
  ];
}
