"use client"
import { useState } from 'react';
import { Calculator } from './Calculator';
import { History } from './History';
import { useContext } from 'react';
import { CalculatorContext } from './context/CalculatorContext';
import { ResultContext } from './context/TextContext';
import { InputContext } from './context/TextContext';

// todo. History 관련 pad 나누기
const historyPadArray = [
  "clear History",
  "load History",
  "save History"];
const numPadArray = [
  "clear History", "load History", "save History",
  "7", "8", "9",
  "4", "5", "6",
  "1", "2", "3",
  ".", "0", "="];
const opPadArray = [
  "C", "+", "-", "*", "/" ];

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

function InputText({handleEqualButton}) {
  const calculator = useContext(CalculatorContext);
  const { input, setInput } = useContext(InputContext);
  const { setResult } = useContext(ResultContext);

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
    //this._history.addHistory(this._resultValue);
  }

  function handleClearButton() {
    setInput('');
    setResult('');
    calculator.clearCalculator();
  }

  function onKeyDownEvent(e) {
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
      onKeyDown={onKeyDownEvent}
      value={input} />
  )
}

function TextAreaPart({ handleEqualButton }) {
  return (
    <div className="text-area">
      <ResultText />
      <InputText handleEqualButton={handleEqualButton} />
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

function NumPadPart({ handleEqualButton }) {
  const { input, setInput } = useContext(InputContext);
  const { setResult } = useContext(ResultContext);

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
  const { setResult } = useContext(ResultContext);

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
    //this._history.addHistory(this._resultValue);
  }

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

function PadPart({ handleEqualButton }) {
  return (
    <div className="pad">
      <NumPadPart handleEqualButton={handleEqualButton} />
      <OpPadPart />
    </div>
  )
}

function Panel({ history }) {
  const [result, setResult] = useState(0);
  const [input, setInput] = useState("");

  let calculator = useContext(CalculatorContext);

  function handleEqualButton() { // handleEqual, handleEqualButton, handleEqualButtonClick
    if (input === "") return;
    console.log("Enter!!");
    setResult(calculator.calculate(input, "="));
    //this._history.addHistory(this._resultValue);
    setInput("");
  }

  return (
    <div>
      <ResultContext.Provider value={{ result, setResult }}>
        <InputContext.Provider value={{ input, setInput }}>
          <TextAreaPart handleEqualButton={handleEqualButton} />
          <PadPart handleEqualButton={handleEqualButton} />
        </InputContext.Provider>
      </ResultContext.Provider>
    </div>
  )
}

let history = new History();
export default function Home() {
  const calculator = new Calculator(0);
  return (
    <CalculatorContext.Provider value={calculator}>
      <Panel history={history} />
    </CalculatorContext.Provider>
  )
}


/**
 * Context 사용해보기
 * 1. Context 생성하기
 *    - createContext();
 * 2. 데이터가 필요한 컴포넌트에서 context를 사용하기
 * 3. 데이터를 지정하는 컴포넌트에서 context를 제공하기
 */