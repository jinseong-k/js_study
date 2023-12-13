"use client"
import {useMemo, useState} from "react";
import {Calculator} from './Calculator';
import {History} from './History';
import {StoreContext} from "./context";
import {ModalItem, TextAreaPart, PadPart} from "@/app/component/";

export default function Home() {
    const history = new History();
    const [result, setResult] = useState(null);
    const [input, setInput] = useState(null);
    const store = useMemo(() => ({
        _op: null,
        setOp(op) {
            store.calc();

            store._op = op;
        },
        calc() {
            if (input === null) {
                return;
            }

            store.setResult(Calculator.calculate(result, input, store._op));
        },
        input,
        result,
        setInput,
        setResult(value) {
            setInput(null);
            setResult(value);
            history.addHistory(value);
        },
        clear() {
            setInput(null);
            setResult(null);
        }
    }), [input, result, setInput, setResult]);

    return (
        <StoreContext.Provider value={store}>
            <TextAreaPart />
            <PadPart />
            <ModalItem />
        </StoreContext.Provider>
    )
}