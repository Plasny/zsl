/**
 * Module which containes storage related functions
 * @module storage
 */

/**
 * Function which stores top score in local storage
 * @param score 
 */
export function setBestScore(score: number) {
    localStorage.setItem('bestScore', JSON.stringify(score))
}

/**
 * Function that gets score from the local storage or returns 0
 * @returns score or 0
 */
export function getBestScore(): number {
    const score = JSON.parse(localStorage.getItem('bestScore')) | 0;
    return score;
}
