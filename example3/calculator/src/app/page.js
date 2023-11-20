"use client"
import { useState } from 'react';
import { Calculator } from './Calculator';

const VALUE_TO_KEY = {
  "C": "Escape",
  "=": "Enter"
};

function convertToKey(value) {
  return VALUE_TO_KEY[value] || value;
}

function ResultText({resultValue}) {
  return (
    <p className="resultText">{resultValue}</p>
  )
}

function InputText({input, setResult, setInput, calculator}) {
  const OPS = ["+", "-", "*", "/"];
  const NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];

  const onChangeEventHandle = (e) => {
    console.log("!!!!!!!!!!!!!!!!!!!!!");
    const inputData = e.target.value;
    const insertKeyboard = inputData[inputData.length-1];
    e.preventDefault();

    keyHandle(inputData, convertToKey(insertKeyboard));
  }

  function keyHandle(inputData, insertKeyboard) {
    if (OPS.includes(insertKeyboard)) {
      handleOps(insertKeyboard);
      setInput("");
    } else if (NUMBERS.includes(insertKeyboard)) {
      setInput(inputData);
    } else {
      handleEtcs(inputData);
    }
  }

  const handleOps = (op) => {
    if (input === '') {
      calculator.curOperator = op;
      return;
    }
    setResult(calculator.calculate(input, op));
    //this._history.addHistory(this._resultValue);
  }

  function handleEtcs (key) {
    if (key === 'Enter') {
      equalButtonClickHandler();
      return;
    } else if (key === 'Escape') {
      clearButtonClickHandler();
      return;
    } else if (key === 'Undo') {
      // this._undoProcess();
      return;
    } else if (key === 'Redo') {
      // this._redoProcess();
      return;
    } else if (key === 'Save History') {
      // this._saveHistory();
      return;
    } else if (key === 'Load History') {
      // this._loadHistory();
      return;
    } else if (key === 'Clear History') {
      // this._clearHistory();
      return;
    }
  }

  function clearButtonClickHandler() {
    setInput('');
    setResult('');
    calculator.clearCalculator();
  }

  function equalButtonClickHandler() {
    if (input === "") return;
    console.log("Enter!!");
    setResult(calculator.calculate(input, "="));
    //this._history.addHistory(this._resultValue);
    setInput("");
  }

  function onKeyDownEvent(e) {
    if (e.key === 'Enter') {
      equalButtonClickHandler();
    }
  }

  return (
    <input className="inputText" type='text' onChange={onChangeEventHandle} onKeyDown={onKeyDownEvent} value={input}>
    </input>
  )
}

// props drilling..
function TextAreaPart({input, result, setResult, setInput, calculator}) {
  return (
    <div className="text-area">
      <ResultText resultValue={result}/>
      <InputText input={input} setResult={setResult} setInput={setInput} calculator={calculator}/>
    </div>
  )
}

function ButtonPad({item, input, itemValue, setInput, setResult}) {
  const clickEventListener = (e) => {
    const { value } = event.target;
    console.log(value);
    setInput(input+value);
  };

  return (
    <button className="item" value={itemValue} onClick={clickEventListener}>
      {itemValue}
    </button>
  )
}

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
  "C", "+", "-", "*", "/"
];

function NumPadPart({input, result, setResult, setInput, calculator}) {
  const buttonArray = numPadArray.map((item) => {
    return <ButtonPad key={item} itemValue={item} input={input} setInput={setInput} setResult={setResult}/>;
  });

  return (
    <div className="num-pad">
      {buttonArray}
    </div>
  )
}

function OpPadPart({input, result, setResult, setInput, calculator}) {
  const buttonArray = opPadArray.map((item) => {
    return <ButtonPad key={item} itemValue={item} setInput={setInput} setResult={setResult}/>;
  });

  return (
    <div className="op-pad">
      {buttonArray}
    </div>
  )
}

function PadPart({input, result, setResult, setInput, calculator}) {
  return (
    <div className="pad">
      <NumPadPart input={input} result={result} setResult={setResult} setInput={setInput} calculator={calculator}/>
      <OpPadPart input={input} result={result} setResult={setResult} setInput={setInput} calculator={calculator}/>
    </div>
  )
}

function Panel({calculator}) {
  const [result, setResult] = useState(0);
  const [input, setInput] = useState("");

  const Param = {result, setResult, input, setInput, calculator};

  return (
    <div>
      <TextAreaPart input={input} result={result} setResult={setResult} setInput={setInput} calculator={calculator}/>
      <PadPart input={input} result={result} setResult={setResult} setInput={setInput} calculator={calculator}/>
    </div>
  )
}

let calculator = new Calculator();
export default function Home() {
  return (
    <Panel calculator={calculator}/>
  )
}