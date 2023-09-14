/**
 * Map of the pressed keys in a given moment
 * @type {Map<number,boolean>}
 */
export let keysPressed = {};

/**
 * Function that changes hex to rgba for colors
 * @param {String} hex color in hex
 * @returns color in rgba
 */
export function hexToRgba(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: 1
    } : null;
}

/**
 * Function that loads image from a given url
 * @param {String} imgPath url for image
 * @returns image after it is loaded
 */
export async function getImg(imgPath) {
    const image = new Image();
    image.src = imgPath;

    return new Promise((resolve, reject) => {
        image.onload = () => {
            resolve(image);
        };
    });
}

/**
 * Function that gets key when button is pressed
 * @param {Event} e Event needed for setting value of key
 */
export function getKeyCode(e) {
    for (const [k, v] of Object.entries(keysPressed)) {
        if (v == true) {
            e.target.value = k;
            return;
        }
    }
}
