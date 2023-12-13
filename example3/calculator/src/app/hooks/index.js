import {useContext} from "react";
import {CalculatorContext, StoreContext} from "../context";

export const useCalculatorContext = () => useContext(CalculatorContext);

export const useStoreContext = () => useContext(StoreContext);