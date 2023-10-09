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
  _textArea;
  _inputText;
  _resultText;
  _pad;
  _calculator;
  _history;

  constructor(calculator, history) {
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

  /**
   * 
   * @param {*} data 
   * Browser 저장 방식 공부
   * [ Cookie ]
   * - name=value 쌍은 4KB를 넘을 수 없다.
   * - 도메인 하나당 저장할 수 있는 쿠키의 개수는 20여개 정도. 브라우저마다 조금씩 다름.
   * - share data with Server
   * 
   * [ localStroage & session Storage 공통 ]
   * - 2MB 이상의 데이터를 저장할 수 있도록 해준다.
   * - HTTP 헤더를 통해 스토리지 객체를 조작할 수 없다.
   * - origin에 의존하여, 프로토콜과 서브 도메인이 다르면 데이터에 접근 불가
   * [ localStorage ] 
   * - 브라우저를 다시 실행해도 데이터가 사라지지 않음 
   * - origin 이 동일할 경우, 모든 탭과 창에서 공유됨
   * [ sessionStorage ]
   * - 현재 있는 탭에서만 유지
   * - 페이지를 새로고침 해도 데이터가 사라지지 않음
   * - 탭을 닫고 새로 열때는 사라짐
   * - 제한 용량은 대충 5MB정도인듯
   * 
   * [ IndexedDB ]
   * - localStroage 보다 강력한 Browser built in DB
   * - Alomost any kind of values by keys, multiple key types.
   * - Support transaction.
   * - Support key range queries, indexes.
   * - bigger volume than localStorage
   * - async/await 사용 가능
   * 
   * [ origin 이란 ]
   * - Protocol, Domain, Port
   * 
   * [ 결론 ]
   * - localStorage 사용해보기
   *  
   * [ 기능 명세 ]
   * - save : 현재 history를 저장
   * - load : 현재 저장된 history들을 확인하고, 불러오기
   */
  _saveHistory() {
    const saveData = this._history.getSaveData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData)); // '{"index": "1", "historyData": 100}'
  }

  _loadHistory() {
    const data = localStorage.getItem(STORAGE_KEY); // null or '{...}'

    if (data === null) {
      return;
    }

    const {index, historyData} = JSON.parse(data); // {...}

    this._history.setLoadData({index, historyData});
    this._resultValue = historyData[index];
  }

  _clearHistory() {
    localStorage.clear();
  }

  // todo. 히스토리 창 띄우기
  _drawModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
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

  createHtml(id) {
    this._createTextAreaPart();
    this._createPadPart();
    this._createCalcPart();

    document.getElementById(id).appendChild(this._calcElement);
  }
}


const calculator = new Calculator(0);
const history = new History();
const view = new View(calculator, history);
view.createHtml("first")