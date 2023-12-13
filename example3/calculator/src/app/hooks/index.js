import {useContext} from "react";
import {CalculatorContext, InputContext, ResultContext} from "../context";

export const useCalculatorContext = () => useContext(CalculatorContext);

export const useInputContext = () => useContext(InputContext);

export const useResultContext = () => useContext(ResultContext);