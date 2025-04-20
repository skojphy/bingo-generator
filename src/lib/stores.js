import { writable } from 'svelte/store';

export const bingoData = writable([]);
export const bingoState = writable(Array(25).fill(false));
export const bingoCount = writable(0);
