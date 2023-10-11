import { Calculator } from "./Calculator.js"; // default
import { History } from "./History.js";

const OPS = ["+", "-", "*", "/"];
const NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
const ETCS = ["(", ")", "Enter", "Backspace", "Escape", "=", "Undo", "Redo", "History"];

const OP_PAD_CHAR = ['C', '+', '-', '*', '/'];
const OP_PAD_COUNT = 5;
const EMPTY_OP_PAD_COUNT = 1;

const UTIL_PAD_CHAR = ['Clear History', 'Save History', 'Load History'];
const UTIL_PAD_COUNT = 3;
const EMPTY_UTIL_PAD_COUNT = 0;

const NUM_PAD_CHAR = ['Undo', 'Redo', '7', '8', '9', '4', '5', '6', '1', '2', '3', '.', '0', '='];
const NUM_PAD_COUNT = 14;
const EMPTY_NUM_PAD_COUNT = 1;

const STORAGE_KEY = "js_history";

const VALUE_TO_KEY = {
  "C": "Escape",
  "=": "Enter"
};

class View {
  _id;
  _textArea;
  _inputText;
  _resultText;
  _pad;
  _calculator;
  _history;
  _modalOverlay;
  _modalContents;
  _modalItem;

  constructor(id, calculator, history) {
    this._id = id;
    this._calculator = calculator;
    this._history = history;
    this._history.addHistory(this._calculator.initValue); // todo this._history.addHistory(this._calculator.initValue);
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
    this._history.addHistory(this._resultValue);
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
      this._undoProcess();
      return;
    } else if (key === 'Redo') {
      this._redoProcess();
      return;
    } else if (key === 'Save History') {
      this._saveHistory();
      return;
    } else if (key === 'Load History') {
      this._loadHistory();
      return;
    } else if (key === 'Clear History') {
      this._clearHistory();
      return;
    }
  }

  _clearHistory() {
    localStorage.clear();
  }

  _undoProcess() {
    this._resultValue = this._history.undo();

    this._calculator.setValue(this._resultValue);

    this._inputValue = '';
  }

  _redoProcess() {
    this._resultValue = this._history.redo();
    this._inputValue = '';
  }

  _makeStorageKey(index) {
    return `${STORAGE_KEY}_${index}`;
  }

  _saveHistory() {
    const saveData = this._history.getSaveData();

    const storageData = JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];

    storageData.push(saveData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
  }

  _loadHistory() {
    this._refreshModalItem();
  }

  _clearHistory() {
    localStorage.clear();
  }

  _createModalOverlay() {
    this._modalOverlay = document.createElement('div');
    this._modalOverlay.className = 'modalOverlay';

    let modalWindow = this._createModalElement();
    this._modalOverlay.appendChild(modalWindow);

    document.getElementById(this._id).appendChild(this._modalOverlay);
  }

  _createModalElement() {
    const modalWindow = document.createElement('div');
    modalWindow.className = "modalWindow";

    const modalCloseButton = this._createModalCloseButton();
    modalWindow.appendChild(modalCloseButton);

    this._modalContents = this._createModalContents();
    modalWindow.appendChild(this._modalContents);

    return modalWindow;
  }

  _modalCloseEventListener = () => {
    this._modalOverlay.style.display = "none";
  }

  _modalItemClickEventListener = (item) => {
    const { index, historyData } = item;
    this._history.setLoadData({index, historyData});
    this._resultValue = historyData[index];
    this._modalCloseEventListener();
  }

  _createModalCloseButton() {
    const modalCloseButton = document.createElement('button');
    modalCloseButton.innerText = "x";
    modalCloseButton.addEventListener("click", this._modalCloseEventListener);
    return modalCloseButton;
  }

  _createModalContents() {
    const modalContents = document.createElement('div');
    modalContents.className = "modalContents";

    return modalContents;
  }

  _refreshModalItem() {
    const storageData = JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];

    const items = storageData.map((data) => {
      const item = document.createElement("button");
      item.innerText = `${data["index"]} : ${data["historyData"]}`;
      item.addEventListener("click", () => this._modalItemClickEventListener(data));
      return item;
    });

    this._modalContents.replaceChildren(...items);
    this._modalOverlay.style.display = 'flex';
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
    this._history.addHistory(this._resultValue);
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

  _createUtilPadDiv(index) {
    const numPadDiv = document.createElement('div')
    numPadDiv.className = 'item';
    const numButton = document.createElement('button');
    numButton.className = 'myButton';
    numButton.innerText = UTIL_PAD_CHAR[index];
    numButton.value = `${UTIL_PAD_CHAR[index]}`;
    numPadDiv.appendChild(numButton);

    return numPadDiv;
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

    /* Util pad */
    for (let i = 0; i < EMPTY_UTIL_PAD_COUNT; i++) {
      const emptyUtilPadDiv = this._createEmptyPadDiv();
      numPad.appendChild(emptyUtilPadDiv);
    }

    for (let i = 0; i < UTIL_PAD_COUNT; i++) {
        const utilPadDiv = this._createUtilPadDiv(i);
        numPad.appendChild(utilPadDiv);
    }

    /* Num pad */
    for (let i = 0; i < EMPTY_NUM_PAD_COUNT; i++) {
      const emptyPadDiv = this._createEmptyPadDiv();
      numPad.appendChild(emptyPadDiv);
    }

    for (let i = 0; i < NUM_PAD_COUNT; i++) {
      const numPadDiv = this._createNumPadDiv(i);
      numPad.appendChild(numPadDiv);
    }

    /* Op pad */
    const opPad = this._createOpPad();

    for (let i = 0; i < EMPTY_OP_PAD_COUNT; i++) {
      const emptyOpPadDiv = this._createEmptyPadDiv();
      opPad.appendChild(emptyOpPadDiv);
    }

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

  createHtml() {
    this._createTextAreaPart();
    this._createPadPart();
    this._createCalcPart();

    document.getElementById(this._id).appendChild(this._calcElement);

    this._createModalOverlay();
  }
}

const id = "first";
const initValue = 0;
const calculator = new Calculator(initValue);
const history = new History();
const view = new View(id, calculator, history);
view.createHtml();