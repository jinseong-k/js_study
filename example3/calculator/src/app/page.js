"use client"
import {useMemo, useState} from "react";
import {Calculator} from './Calculator';
import {History} from './History';
import {CalculatorContext, StoreContext} from "./context";
import {ModalItem, TextAreaPart, PadPart} from "@/app/component/";

export default function Home() {
    const calculator = new Calculator(0);
    const history = new History();
    const [result, setResult] = useState(0);
    const [input, setInput] = useState(0);
    const store = useMemo(() => ({
        input,
        result,
        setInput,
        setResult,
    }), [input, result, setInput, setResult]);

    return (
        <CalculatorContext.Provider value={calculator}>
            <StoreContext.Provider value={store}>
                <TextAreaPart />
                <PadPart />
                <ModalItem />
            </StoreContext.Provider>
        </CalculatorContext.Provider>
    )
}