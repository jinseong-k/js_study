import {useContext, useMemo, useState} from "react";
import {CalculatorContext, InputContext, ResultContext} from "../context";
import {TextAreaPart, PadPart} from "./";

export function Panel() {
    const [result, setResult] = useState(0);
    const [input, setInput] = useState("");
    const calculator = useContext(CalculatorContext);

    const resultValue = useMemo(() => ({result, setResult}), [result, setResult]);
    const inputValue = useMemo(() => ({input, setInput}), [input, setInput]);

    return (
        <div>
            <ResultContext.Provider value={resultValue}>
                <InputContext.Provider value={inputValue}>
                    <TextAreaPart />
                    <PadPart />
                </InputContext.Provider>
            </ResultContext.Provider>
        </div>
    )
}

