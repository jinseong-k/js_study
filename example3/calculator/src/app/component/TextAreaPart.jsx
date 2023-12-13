import {NUMBERS, Ops} from "../const";
import {useCalculatorContext, useInputContext, useResultContext} from "@/app/hooks";
import {isEnter, isEscape, isNumber, isOp} from "../util";


function ResultText() {
    let { result } = useResultContext();
    return (
        <p className="resultText">{result}</p>
    )
}

function InputText() {
    const calculator = useCalculatorContext();
    const { input, setInput } = useInputContext();
    const { result, setResult } = useResultContext();

    const handleOnChangeEvent = (e) => {
        const inputData = e.target.value;

        setInput(inputData);
    }

    const handleOps = ({key: op}) => {
        if (input === '') {
            calculator.curOperator = op;
            return;
        }
        setResult(calculator.calculate(input, op));
        history.addHistory(result);
    }

    function handleClearButton() {
        setInput('');
        setResult('');
        calculator.clearCalculator();
    }

    function handleEqualButton() {
        if (input === "") return;
        setResult(calculator.calculate(input, "="));
        history.addHistory(result);
        setInput("");
    }

    function handleKeyDownEvent(e) {
        if (isNumber(e)) {
            return;
        }

        e.preventDefault();

        if (isOp(e)) {
            handleOps(e);
            setInput('');
        } else if (isEnter(e)) {
            handleEqualButton();
        } else if (isEscape(e)) {
            handleClearButton();
        }
    }

    return (
        <input className="inputText"
               type='text'
               onChange={handleOnChangeEvent}
               onKeyDown={handleKeyDownEvent}
               value={input} />
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
