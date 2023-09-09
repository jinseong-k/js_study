const OPS = ["+", "-", "*", "/"];
const OP_PAD_CHAR = ['C', '+', '-', '*', '/'];
const OP_PAD_COUNT = 5;
const NUM_PAD_CHAR = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '.', '0', '='];
const NUM_PAD_COUNT = 12;
const EMPTY_PAD_COUNT = 3;
const MAX_FORM_LEN = 1000;

// 1. calculator error fix
// 2. 일반 계산기처럼 동작하게 하기
// 3. history: undo(실행취소)/redo(다시실행)
// 4. history 저장하기/불러오기 (브라우저)

class Calculator {
    constructor() {

    }

    _getLeftOperand(form) {
        const plusIndex = form.lastIndexOf('+');
        const minusIndex = form.lastIndexOf('-');
        const multiIndex = form.indexOf('*');
        const divIndex = form.indexOf('/');

        if (plusIndex === -1 && minusIndex === -1
            && multiIndex === -1 && divIndex === -1) {
            return form;
        }

        const index = Math.max(plusIndex, minusIndex, multiIndex, divIndex);

        return form.slice(index + 1);
    }

    _getRightOperand(form) {
        let plusIndex = form.indexOf('+');
        let minusIndex = form.indexOf('-');
        let multiIndex = form.indexOf('*');
        let divIndex = form.indexOf('/');

        if (plusIndex === -1 && minusIndex === -1
            && multiIndex === -1 && divIndex === -1) {
            return form;
        }

        plusIndex = (plusIndex === -1) ? MAX_FORM_LEN : plusIndex;
        minusIndex = (minusIndex === -1) ? MAX_FORM_LEN : minusIndex;
        multiIndex = (multiIndex === -1) ? MAX_FORM_LEN : multiIndex;
        divIndex = (divIndex === -1) ? MAX_FORM_LEN : divIndex;

        const index = Math.min(plusIndex, minusIndex, multiIndex, divIndex);

        return form.slice(0, index);
    }

    calculate(form) {
        let index;
        let calcResult;

        let plusIndex = form.indexOf('+');
        let minusIndex = form.indexOf('-');
        let multiIndex = form.indexOf('*');
        let divIndex = form.indexOf('/');

        if (multiIndex !== -1) {
            if (divIndex !== -1) {
                if (multiIndex < divIndex) {
                    index = multiIndex;
                } else {
                    index = divIndex;
                }
            } else {
                index = multiIndex;
            }
        } else if (divIndex !== -1) {
            index = divIndex;
        } else if (plusIndex !== -1) {
            if (minusIndex !== -1) {
                if (plusIndex < minusIndex) {
                    index = plusIndex;
                } else {
                    index = minusIndex;
                }
            } else {
                index = plusIndex;
            }
        } else if (minusIndex !== -1) {
            index = minusIndex;
        } else {
            return form;
        }

        let left = form.slice(0, index);
        let right = form.slice(index + 1);

        let leftOperand = this._getLeftOperand(left)
        let rightOperand = this._getRightOperand(right);

        switch (index) {
            case multiIndex:
                calcResult = parseFloat(leftOperand) * parseFloat(rightOperand);
                break;
            case divIndex:
                calcResult = parseFloat(leftOperand) / parseFloat(rightOperand);
                break;
            case plusIndex:
                calcResult = parseFloat(leftOperand) + parseFloat(rightOperand);
                break;
            case minusIndex:
                calcResult = parseFloat(leftOperand) - parseFloat(rightOperand);
                break;
            default:
                break;
        }

        let newForm = `${left.slice(0, -(leftOperand.length))}${calcResult}${right.slice(rightOperand.length)}`;

        return parseFloat(this.calculate(newForm));
    }
}

class View {
    _textArea;
    _inputText;
    _resultText;
    _pad;
    _calculator;

    constructor(calculator) {
        this._calculator = calculator;
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

        return resultTextArea;
    }

    _createInputArea() {
        const input = document.createElement('input');
        input.className = 'inputText';
        input.type = 'text';

        input.addEventListener('keydown', (event) => {
            this._inputTextKeyPress(event);
        });

        return input;
    }

    _inputTextKeyPress(event) {
        const INSERTABLE_KEYS = ['Enter', 'Space', 'Backspace',
            '+', '-', '/', '*', "(", ")", ".",
            '0', '1', '2', '3', '4',
            '5', '6', '7', '8', "9"];
        const valid = INSERTABLE_KEYS.includes(event.key);

        if (!valid) {
            event.preventDefault();
            return;
        }

        if (event.key === 'Enter') {
            this._equalButtonClickHandler();
            event.preventDefault();
            return;
        }
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

        if (OPS.includes(value)) {
            this._operatorButtonClickHandler(value);
        } else if (value === "C") {
            this._clearButtonClickHandler();
        } else if (value === "=") {
            this._equalButtonClickHandler();
        } else {
            this._buttonClickHandler(value);
        }
    }

    _operatorButtonClickHandler(value) {
        if (this._inputText.value.length <= 0) return;
        this._inputText.value = `${this._inputText.value}${value}`;
    }

    _clearButtonClickHandler() {
        this._inputText.value = '';
        this._resultText.innerText = '';
    }

    _equalButtonClickHandler() {
        let result = this._calculator.calculate(this._inputText.value);
        this._resultText.innerText = isNaN(result) ? "incorrect Formular" : result;

        this._inputText.value = '';
    }

    _buttonClickHandler(value) {
        this._inputText.value = `${this._inputText.value}${value}`;
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
