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
        if (isNumber(e)) {
            return;
        }

        e.preventDefault();

        if (isOp(e)) {
            setOp(e.key);

            return;
        }

        if (isEnter(e)) {
            calc();

            return;
        }

        if (isEscape(e)) {
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
