"use client"
import {Calculator} from './Calculator';
import {History} from './History';
import {CalculatorContext} from "./context";
import {Panel, ModalItem} from "@/app/component/";

export default function Home() {
    const calculator = new Calculator(0);
    const history = new History();

    return (
        <CalculatorContext.Provider value={calculator}>
            <Panel />
            <ModalItem />
        </CalculatorContext.Provider>
    )
}