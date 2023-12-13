"use client"
import {useMemo, useState} from "react";
import {Calculator} from './Calculator';
import {History} from './History';
import {StoreContext} from "./context";
import {TextAreaPart, PadPart} from "./component";

export default function Home() {
    const history = new History();
    const [result, setResult] = useState(null);
    const [input, setInput] = useState(null);
    const [op, setOp] = useState(null);
    const store = useMemo(() => ({
        op,
        setOp(op) {
            store.calc();
            setOp(op);
        },
        calc() {
            if (input === null) {
                return;
            }

            if (!store.op) {
                store.setResult(input);

                return;
            }

            store.setResult(Calculator.calculate(result ?? 0, input, store.op));
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
            {/* todo <ModalItem /> */}
        </StoreContext.Provider>
    )
}