import {DOT, KEY, NUMBERS, OPS} from "../const";

export const isEnter = val => val === KEY.ENTER;

export const isEscape = val => val === KEY.ESCAPE;

export const isEqual = val => val === KEY.EQUAL;

export const isNumber = val => NUMBERS.includes(val);

export const isDot = val => val === DOT;

export const isOp = val => OPS.includes(val);

export const isClear = val => val === KEY.CLEAR;