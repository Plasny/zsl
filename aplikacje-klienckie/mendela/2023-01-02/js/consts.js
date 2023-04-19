/**
 * Width of the game board
 * @type {Number}
 */
export const width = 1200;

/**
 * Height of the game board
 * @type {Number}
 */
export const height = 600;

/**
 * Id of canvas to draw game on
 * @type {String}
 */
export const canvasId = 'c1';

/**
 * List with paths to player models
 * @type {String[]}
 */
export const modelPaths = [
    "./img/blackMotor.webp",
    "./img/redMotor.webp",
    "./img/yellowMotor.webp",
    "./img/greenMotor.webp",
];

/**
 * Timeout in milliseconds for stopping players getting additional points when crossing lap line in short span of time
 * @type {Number} 
 */
export const timeout = 500;
