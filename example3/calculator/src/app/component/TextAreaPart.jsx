import {useCalculatorContext, useStoreContext} from "@/app/hooks";
import {isEnter, isEscape, isNumber, isOp} from "../util";


function ResultText() {
    const {result} = useStoreContext();

    return (
        <p className="resultText">{result}</p>
    )
}

function InputText() {
    const calculator = useCalculatorContext();
    const {input, result, setInput, setResult} = useStoreContext();

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
        setInput(0);
        setResult(0);
        calculator.clearCalculator();
    }

    function handleEqualButton() {
        if (input === "") return;
        setResult(calculator.calculate(input, "="));
        history.addHistory(result);
        setInput(0);
    }

    function handleKeyDownEvent(e) {
        if (isNumber(e)) {
            return;
        }

        e.preventDefault();

        if (isOp(e)) {
            handleOps(e);
            setInput(0);
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
