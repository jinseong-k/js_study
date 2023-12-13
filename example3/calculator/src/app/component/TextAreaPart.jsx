import {useStoreContext} from "@/app/hooks";
import {isEnter, isEscape, isNumber, isOp} from "../util";


function ResultText() {
    const {result} = useStoreContext();

    return (
        <p className="resultText">{result ?? 0}</p>
    )
}

function InputText() {
    const {input, setOp, calc, setInput, clear} = useStoreContext();

    const handleOnChangeEvent = (e) => {
        const inputData = e.target.value;

        setInput(+inputData);
    }

    function handleKeyDownEvent(e) {
        const {key} = e;

        if (isNumber(key)) {
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
    }

    return (
        <input className="inputText"
               type='text'
               onChange={handleOnChangeEvent}
               onKeyDown={handleKeyDownEvent}
               value={input ?? 0} />
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
