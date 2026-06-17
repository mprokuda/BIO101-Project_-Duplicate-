/**
 * Gets a random boolean value.
 * 
 * @returns A random boolean with an equal distribution of true of falses.
 */
export function rbool(): boolean {
    return Math.random() < 0.5;
}

/**
 * Get a Random item from an Array.
 * 
 * @param array The array of items.
 * @returns  A random element from that array.
 */
export function ritem<T>(array: T[]): T {
    return array[rindex(array)];
}

/**
 * Get a random index within the bounds of an array.
 * 
 * @param array The array to get an index within.
 * @returns A random index within the array.
 */
export function rindex<T>(array: T[]): number {
    return Math.ceil(Math.random() * (array.length - 1));
}

