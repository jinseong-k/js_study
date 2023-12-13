import {useCallback} from "react";
import {useStoreContext} from "@/app/hooks";
import {isDot, isEnter, isEscape, isNumber, isOp} from "../util";


function ResultText() {
    const {result} = useStoreContext();

    return (
        <p className="resultText">{result ?? 0}</p>
    )
}

const countDot = str => str.match(/\./g).length;

const parseNumber = str => {
    if (isDot(str.at(-1))) {
        if (countDot(str) > 1) {
            return str.slice(0, -1);
        }

        return str;
    }

    return `${+str}`;
};

function InputText() {
    const {input, setOp, calc, setInput, clear} = useStoreContext();
    const handleChange = useCallback((e) => {
        setInput(parseNumber(e.target.value));
    }, [setInput]);
    const handleKeyDown = useCallback((e) => {
        const {key} = e;

        if (isNumber(key) || isDot(key)) {
            return;
        }

        e.preventDefault();

        if (isOp(key)) {
            setOp(key);

            return;
        }

        if (isEnter(key)) {
            calc();

            return;
        }

        if (isEscape(key)) {
            clear();

            return;
        }
    }, [setOp, calc, clear]);

    return (
        <input className="inputText" type='text' onChange={handleChange} onKeyDown={handleKeyDown} value={input ?? 0} />
    )
}

export function TextAreaPart() {
    return (
        <div className="text-area">
            <ResultText />
            <InputText />
        </div>
    )
}
