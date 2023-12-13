import {KEY, NUMBERS, OPS} from "../const";

export const isEnter = e => e.key === KEY.ENTER;

export const isEscape = e => e.key === KEY.ESCAPE;

export const isEqual = e => e.key === KEY.EQUAL;

export const isNumber = e => NUMBERS.includes(e.key);

export const isOp = e => OPS.includes(e.key);