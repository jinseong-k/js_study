"use client"
import { useState } from 'react';
import { Calculator } from './Calculator';

function ResultText({resultValue}) {
  return (
    <p className="resultText">{resultValue}</p>
  )
}


function InputText({input, setResult, setInput, calculator}) {
  const OPS = ["+", "-", "*", "/"];
  const NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];

  const keyDownEvent = (e) => {
    keyHandle(e.key);
  }

  const handleOps = (op) => {
    if ({op} === '') {
      // this._calculator.curOperator = op;
      return;
    }
    let calcResult=1;
    setResult(calcResult);
    //this._history.addHistory(this._resultValue);
    setInput("0");
  }

  const keyHandle = (value) => {
    if (OPS.includes(value)) {
      handleOps(value);
    } else if (NUMBERS.includes(value)) {
      setInput(value);
    } else {
      //this._handleEtcs(value);
    }
  }

  return (
    <input className="inputText" type='text' defaultValue="0" onKeyDown={keyDownEvent} value={input}>
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

function ButtonPad({itemValue}) {
  return (
    <button className="item" value={itemValue} >
      {itemValue}
    </button>
  )
}

// todo. History 관련 pad 나누기
const numPadArray = [
  "clear History", "load History", "save History",
  "7", "8", "9",
  "4", "5", "6",
  "1", "2", "3",
  ".", "0", "="];
const opPadArray = [
  "C", "+", "-", "*", "/"
];

function NumPadPart() {
  const buttonArray = numPadArray.map((item) => {
    return <ButtonPad key={item} itemValue={item}/>;
  });

  return (
    <div className="num-pad">
      {buttonArray}
    </div>
  )
}

function OpPadPart() {
  const buttonArray = opPadArray.map((item) => {
    return <ButtonPad key={item} itemValue={item}/>;
  });

  return (
    <div className="op-pad">
      {buttonArray}
    </div>
  )
}

function PadPart() {
  return (
    <div className="pad">
      <NumPadPart />
      <OpPadPart />
    </div>
  )
}

function Panel({calculator}) {
  const [result, setResult] = useState(0);
  const [input, setInput] = useState(0);

  return (
    <div>
      <TextAreaPart input={input} result={result} setResult={setResult} setInput={setInput} calculator={calculator}/>
      <PadPart />
    </div>
  )
}

let calculator = new Calculator();
export default function Home() {
  return (
    <Panel calculator={calculator}/>
  )
}