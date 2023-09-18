import { Calculator } from "./Calculator.js"; // default

const OPS = ["+", "-", "*", "/"];
const NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
const ETCS = ["(", ")", "Enter", "Backspace", "Escape", "=", "Undo", "Redo"];
const OP_PAD_CHAR = ['C', '+', '-', '*', '/'];
const OP_PAD_COUNT = 5;
const NUM_PAD_CHAR = ['Undo', 'Redo', '7', '8', '9', '4', '5', '6', '1', '2', '3', '.', '0', '='];
const NUM_PAD_COUNT = 14;
const EMPTY_PAD_COUNT = 1;

const VALUE_TO_KEY = {
  "C": "Escape",
  "=": "Enter"
};

class View {
  _textArea;
  _inputText;
  _resultText;
  _pad;
  _calculator;

  constructor(calculator) {
    this._calculator = calculator;
  }

  get _inputValue() {
    return this._inputText.value;
  }

  set _inputValue(value) {
    this._inputText.value = value;
  }

  get _resultValue() {
    return this._resultText.innerText;
  }

  set _resultValue(value) {
    this._resultText.innerText = value;
  }

  _createCalcElement() {
    const calcElement = document.createElement(`div`);
    calcElement.className = 'calc';

    return calcElement;
  }

  _createTextArea() {
    const textArea = document.createElement('div');
    textArea.className = `text-area`;

    return textArea;
  }

  _createResultArea() {
    const resultTextArea = document.createElement('p');
    resultTextArea.className = `resultText`;
    resultTextArea.style.backgroundColor = 'white';
    resultTextArea.innerText = '0'; 

    return resultTextArea;
  }

  _createInputArea() {
    const input = document.createElement('input');
    input.className = 'inputText';
    input.type = 'text';

    input.addEventListener('keydown', this._inputTextKeyPress);

    return input;
  }

  _inputTextKeyPress = (event) => {
    const { key } = event;

    this._keyHandle(key);

    event.preventDefault();
  };

  _keyHandle(value) {
    if (OPS.includes(value)) {
      this._handleOps(value);
    } else if (NUMBERS.includes(value)) {
      this._handleNumbers(value);
    } else {
      this._handleEtcs(value);
    }
  }

  _handleOps(op) {
    if (this._inputValue === '') {
      this._calculator.curOperator = op;

      return;
    }

    this._resultValue = this._calculator.calculate(this._inputValue, op);
    this._inputValue = '';
  }

  _handleNumbers(number) {
    this._inputValue += number;
  }

  _handleEtcs(key) {
    if (key === 'Enter') {
      this._equalButtonClickHandler();
      return;
    } else if (key === 'Escape') {
      this._clearButtonClickHandler();
      return;
    } else if (key === 'Undo') {
      console.log("AAAAAAAAA");
      this._undoProcess();
      return;
    } else if (key === 'Redo') {
      console.log("BBBBBB");
      this._redoProcess();
      return;
    }
  }

  _undoProcess() {
    this._resultValue = this._calculator.undo();
    this._inputValue = '';
  }

  _redoProcess() {
    this._resultValue = this._calculator.redo();
    this._inputValue = '';
  }

  _createPad() {
    const pad = document.createElement('div');
    pad.className = 'pad';

    pad.addEventListener('click', this._clickEventListener);

    return pad;
  }

  _clickEventListener = (event) => {
    const { value } = event.target;

    if (!value) {
      return;
    }

    this._keyHandle(this._convertToKey(value));
  };

  // 상수처리하기 (C, =, Enter, ...)
  _convertToKey(value) {
    return VALUE_TO_KEY[value] || value;
  }

  _clearButtonClickHandler() {
    this._inputValue = '';
    this._resultValue = '';
    this._calculator.clearCalculator();
  }

  _equalButtonClickHandler() {
    this._resultValue = this._calculator.calculate(this._inputValue, "=");
    this._inputValue = '';
  }

  _createNumPad() {
    const numPad = document.createElement('div');
    numPad.className = 'num-pad';

    return numPad;
  }

  _createEmptyPadDiv() {
    const emptyPadDiv = document.createElement('div');
    emptyPadDiv.className = 'item';

    return emptyPadDiv;
  }

  _createNumPadDiv(index) {
    const numPadDiv = document.createElement('div')
    numPadDiv.className = 'item';
    const numButton = document.createElement('button');
    numButton.className = 'myButton';
    numButton.innerText = NUM_PAD_CHAR[index];
    numButton.value = `${NUM_PAD_CHAR[index]}`;
    numPadDiv.appendChild(numButton);

    return numPadDiv;
  }

  _createOpPad() {
    const opPad = document.createElement('div');
    opPad.className = 'op-pad';

    return opPad;
  }

  _createOpPadDiv(index) {
    const opDiv = document.createElement('div');
    opDiv.className = 'item';
    const opButton = document.createElement('button');
    opButton.className = 'myButton';
    opButton.innerText = OP_PAD_CHAR[index];
    opButton.value = `${OP_PAD_CHAR[index]}`;

    opDiv.appendChild(opButton);

    return opDiv
  }

  _createTextAreaPart() {
    this._textArea = this._createTextArea();

    this._resultText = this._createResultArea();
    this._textArea.appendChild(this._resultText);

    this._inputText = this._createInputArea();
    this._textArea.appendChild(this._inputText);

  }

  _createPadPart() {
    this._pad = this._createPad();

    const numPad = this._createNumPad();
    this._pad.appendChild(numPad);

    for (let i = 0; i < EMPTY_PAD_COUNT; i++) {
      const emptyPadDiv = this._createEmptyPadDiv();
      numPad.appendChild(emptyPadDiv);
    }

    for (let i = 0; i < NUM_PAD_COUNT; i++) {
      const numPadDiv = this._createNumPadDiv(i);
      numPad.appendChild(numPadDiv);
    }

    const opPad = this._createOpPad();

    for (let i = 0; i < OP_PAD_COUNT; i++) {
      const opDiv = this._createOpPadDiv(i);
      opPad.appendChild(opDiv);
    }
    this._pad.appendChild(opPad);

  }

  _createCalcPart() {
    this._calcElement = this._createCalcElement();
    this._calcElement.appendChild(this._textArea);
    this._calcElement.appendChild(this._pad);
  }

  createHtml(id) {
    this._createTextAreaPart();
    this._createPadPart();
    this._createCalcPart();

    document.getElementById(id).appendChild(this._calcElement);
  }
}

const calculator = new Calculator();
const view = new View(calculator);
view.createHtml("first")