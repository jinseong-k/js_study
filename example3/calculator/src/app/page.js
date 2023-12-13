"use client"
import {useMemo, useState} from "react";
import {Calculator} from './Calculator';
import {History} from './History';
import {CalculatorContext, InputContext, ResultContext} from "./context";
import {ModalItem, TextAreaPart, PadPart} from "@/app/component/";

export default function Home() {
    const calculator = new Calculator(0);
    const history = new History();
    const [result, setResult] = useState(0);
    const [input, setInput] = useState("");
    const resultValue = useMemo(() => ({result, setResult}), [result, setResult]);
    const inputValue = useMemo(() => ({input, setInput}), [input, setInput]);

    return (
        <CalculatorContext.Provider value={calculator}>
            <ResultContext.Provider value={resultValue}>
                <InputContext.Provider value={inputValue}>
                    <TextAreaPart />
                    <PadPart />
                    <ModalItem />
                </InputContext.Provider>
            </ResultContext.Provider>
        </CalculatorContext.Provider>
    )
}