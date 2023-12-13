import {useContext} from "react";
import {CalculatorContext, InputContext, ResultContext} from "../context";

const opPadArray = ["", "C", "+", "-", "*", "/" ];
const numPadArray = [
    "7", "8", "9",
    "4", "5", "6",
    "1", "2", "3",
    ".", "0", "="
];
const actionList = {
    "undo":"undo", "redo":"redo"
};
const historyList = {
    "clear":"clear History",
    "load":"load History",
    "save":"save History"
};
const historyPadArray = [
    "clear History",
    "load History",
    "save History"
];

function ButtonPad({ itemValue, handleEvent}) {
    return (
        <button className="item" value={itemValue} onClick={handleEvent}>
            {itemValue}
        </button>
    )
}

function NumPadPart() {
    const { input, setInput } = useContext(InputContext);

    function handleNumPadEvent(e) {
        const key = e.target.value;
        if (NUMBERS.includes(key)) {
            if (!input && key === ".") return;
            setInput(input + key);
        } else if (key === '=' || key === 'Enter') {
            handleEqualButton();
        }
    }

    const buttonArray = numPadArray.map((item) => {
        return <ButtonPad key={item}
                          itemValue={item}
                          handleEvent={handleNumPadEvent} />;
    });

    return (
        <div className="num-pad">
            {buttonArray}
        </div>
    )
}

function OpPadPart() {
    const calculator = useContext(CalculatorContext);
    const { input, setInput } = useContext(InputContext);
    const { result, setResult } = useContext(ResultContext);

    function handleOpPadEvent(e) {
        const op = e.target.value;
        setInput("");

        if (op === "C") {
            setResult("0");
            return;
        }

        if (input === '') {
            calculator.curOperator = op;
            return;
        }
        setResult(calculator.calculate(input, op));
        history.addHistory(result);
    };

    const buttonArray = opPadArray.map((item) => {
        return <ButtonPad key={item}
                          itemValue={item}
                          handleEvent={handleOpPadEvent} />;
    });

    return (
        <div className="op-pad">
            {buttonArray}
        </div>
    )
}

function HistoryPadPart() {
    const { setResult } = useContext(ResultContext);

    function handleHistoryPadEvent(e) {
        const key = e.target.value;
        console.log(key);
        switch (key) {
            case historyList["save"]:
                history.handleSaveHistoryButton();
                break;
            case historyList["load"]:
                history.handleLoadHistoryButton();
                break;
            case historyList["clear"]:
                history.handleClearHistoryButton();
                break;
            default:
                console.log("Invalid key");
                break;
        }
    }

    return (
        <div className="history-pad">
            {historyPadArray.map((item) => {
                return <ButtonPad key={item}
                                  itemValue={item}
                                  handleEvent={handleHistoryPadEvent} />;
            })}
        </div>
    );
}

const actionHistoryArray = ["undo", "redo", ""];

function ActionPadPart() {
    const {input, setInput} = useContext(InputContext);
    const {result, setResult} = useContext(ResultContext);
    const calculator = useContext(CalculatorContext);

    function handleActionButton(e) {
        switch (e.target.value) {
            case actionList.redo:
                processRedo();
                return;
            case actionList.undo:
                processUndo();
                return;
            default:
                return;
        }
    }

    function processUndo() {
        setResult(history.undo());
        calculator.setValue(result);
        setInput("0");
    }

    function processRedo() {
        setResult(history.redo());
        setInput("0");
    }

    return (
        <div className="action-pad">
            {actionHistoryArray.map((item) => {
                return <ButtonPad key={item}
                                  itemValue={item}
                                  handleEvent={handleActionButton} />;
            })}
        </div>
    );
}

export function PadPart() {
    return (
        <div className="pad">
            <div>
                <HistoryPadPart />
                <ActionPadPart />
                <NumPadPart />
            </div>
            <div>
                <OpPadPart />
            </div>
        </div>
    )
}
