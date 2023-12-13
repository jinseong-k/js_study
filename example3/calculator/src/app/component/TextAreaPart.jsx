import {NUMBERS} from "@/const";
import {useCalculatorContext, useInputContext, useResultContext} from "@/app/hooks";

const OPS = ["+", "-", "*", "/"];

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

    const handleOps = (op) => {
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
        const {key} = e;

        if (NUMBERS.includes(key)) {
            return;
        }

        e.preventDefault();

        if (OPS.includes(key)) {
            handleOps(key);
            setInput('');
        } else if (key === 'Enter') {
            handleEqualButton();
        } else if (key === 'Escape') {
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
