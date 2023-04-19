/**
 * Module which containes all things related to capturing user input 
 * @module input
 */

type keysPressed = Map<string, boolean>

/**
 * Map which containes states for keys.
 */
export let keysPressed : keysPressed = new Map();

/**
 * Function which starts listening for user input and captures it to the 
 * {@link input.keysPressed} variable.
 */
export function startListening() {
    document.addEventListener('keydown', function (e) {
        keysPressed.set(e.key, true);
    })

    document.addEventListener('keyup', function (e) {
        keysPressed.set(e.key, false);
    })
}
