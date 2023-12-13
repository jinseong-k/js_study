"use client"
import { useState, useMemo } from 'react';
import { Calculator } from './Calculator';
import { History } from './History';
import { useContext } from 'react';
import { CalculatorContext } from './context/CalculatorContext';
import { ResultContext } from './context/TextContext';
import { InputContext } from './context/TextContext';

const historyPadArray = [
  "clear History",
  "load History",
  "save History"];
const historyList = {
  "clear":"clear History",
  "load":"load History",
  "save":"save History"
};
const actionHistoryArray = [
  "undo", "redo", ""];
const actionList = {
  "undo":"undo", "redo":"redo"
};
const numPadArray = [
  "7", "8", "9",
  "4", "5", "6",
  "1", "2", "3",
  ".", "0", "="];
const opPadArray = [
  "", "C", "+", "-", "*", "/" ];

const VALUE_TO_KEY = {
  "C": "Escape",
  "=": "Enter"
};

const OPS = ["+", "-", "*", "/"];
const NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];

function convertToKey(value) {
  return VALUE_TO_KEY[value] || value;
}

function ResultText() {
  let { result } = useContext(ResultContext);
  return (
      <p className="resultText">{result}</p>
  )
}

function InputText() {
  const calculator = useContext(CalculatorContext);
  const { input, setInput } = useContext(InputContext);
  const { result, setResult } = useContext(ResultContext);

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

function TextAreaPart() {
  return (
      <div className="text-area">
        <ResultText />
        <InputText />
      </div>
  )
}

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

function PadPart() {
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

function Panel() {
  const [result, setResult] = useState(0);
  const [input, setInput] = useState("");

  const calculator = useContext(CalculatorContext);

  function handleEqualButton() {
    if (input === "") return;
    setResult(calculator.calculate(input, "="));
    history.addHistory(result);
    setInput("");
  }

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

export default function Home() {
  const calculator = new Calculator(0);
  const history = new History();

  return (
      <CalculatorContext.Provider value={calculator}>
        <Panel />
        <ModalItem />
      </CalculatorContext.Provider>
  )
}

function ModalItem() {
  return (
      <div className="modal-overlay">
        <ModalElement />
      </div>
  );
}

function ModalElement() {
  return (
      <div className="modal-window">
        <ModalContents />
      </div>
  );
}

function ModalContents() {
  return (
      <div className="modal-contents">
      </div>
  );
}

/**
 * Context 사용
 * 1. Context 생성하기
 *    - createContext();
 * 2. 데이터가 필요한 컴포넌트에서 context를 사용하기
 *    - useContext();
 * 3. 데이터를 지정하는 컴포넌트에서 context를 제공하기
 *    - <Context.Provider> <ChildrenComponent /> </Context.Provider>
 */