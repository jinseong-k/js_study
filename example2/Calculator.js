const OPS = ["+", "-", "*", "/"];
const pad = document.getElementById("pad");
const KEY_PAD_COUNT = 15;

class Calculator {

    constructor() {

    }

    _plusOp(form) {

    }

    _minusOp(form) {

    }

    _multiOp(form) {

    }

    _divOp(form) {

    }

    calculate(form) {
        let resultValue;
        let token;

        if (form.includes('+')) {
            token = form.split('+');
            resultValue = parseFloat(token[0]) + parseFloat(token[1]);
        } else if (form.includes('-')) {
            token = form.split('-');
            resultValue = parseFloat(token[0]) - parseFloat(token[1]);
        } else if (form.includes('*')) {
            token = form.split('*');
            resultValue = parseFloat(token[0]) * parseFloat(token[1]);
        } else if (form.includes('/')) {
            token = form.split('/');
            resultValue = parseFloat(token[0]) / parseFloat(token[1]);
        } else {
            resultValue = inputText.value;
        }
        return resultValue;
    }
}

class View {
    _name;
    _inputText;
    _resultText;

    constructor(name) {
        this._name = name;
    }

    createHtml(_name) {
        const numPadChar = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '.', '0', '='];
        const opPadChar = ['C', '+', '-', '*', '/'];
    
        const calcElement = document.createElement(`div`);
        calcElement.id = `calc${this._name}`;
        calcElement.className = 'calc';
    
        const container3 = document.createElement('div');
        container3.className = `container3`;
    
        const resultTextArea = document.createElement('p');
        resultTextArea.className = `resultText`;
        resultTextArea.id = `resultText${this._name}`;
        resultTextArea.style.backgroundColor = 'white';
        container3.appendChild(resultTextArea);
    
        const input = document.createElement('input');
        input.className = 'inputText';
        input.type='text';
        input.id = `inputText${this._name}`;
        container3.appendChild(input);

        const pad = document.createElement('div');
        pad.className = 'pad';
        pad.id = `pad${this._name}`;

        const container1 = document.createElement('div');
        container1.className = 'container1';
        pad.appendChild(container1);

        const numPadDiv = [];
        const numButton = [];
        for (let i = 0; i < KEY_PAD_COUNT; i++) {
            numPadDiv[i] = document.createElement('div')
            numPadDiv[i].className = 'item';
            if (i > 2) {
                numButton[i] = document.createElement('button');
                numButton[i].className = 'myButton';
                numButton[i].id = `button${i}`;
                numButton[i].innerText = numPadChar[i-3];
                numButton[i].id = `button${numPadChar[i-3]}`;
                numButton[i].value = `${numPadChar[i-3]}`;
                numPadDiv[i].appendChild(numButton[i]);
            }
            container1.appendChild(numPadDiv[i]);
        }

        const opDiv = [];
        const opButton = [];
        const container2 = document.createElement('div');
        container2.className = 'container2';

        for (let i = 0; i < 5; i++) {
            opDiv[i] = document.createElement('div');
            opDiv[i].className = 'item';
            opButton[i] = document.createElement('button');
            opButton[i].className = 'myButton';
            opButton[i].innerText = opPadChar[i];
            opButton[i].id = `button${opPadChar[i]}`;
            opButton[i].value = `${opPadChar[i]}`;

            opDiv[i].appendChild(opButton[i]);
            container2.appendChild(opDiv[i]);
        }
        pad.appendChild(container2);

        calcElement.appendChild(container3);
        calcElement.appendChild(pad);

        document.body.appendChild(calcElement);
        this._inputText = document.getElementById(`inputText${this._name}`);
        this._inputText.addEventListener('keydown', (event) => {
            inputTextKeyPress(event, this._inputText, this._resultText);
        });
        this._resultText = document.getElementById(`resultText${this._name}`);

        let elementPad = document.getElementById(`pad${this._name}`);
        elementPad.addEventListener('click', event => {
            const {value} = event.target;

            if (!value) {
                return;
            }

            if (OPS.includes(value)) {
                operatorButtonClickHandler(value, this._inputText);
            } else if (value === "C") {
                clearButtonClickHandler(this._inputText, this._resultText);
            } else if (value === "=") {
                equalButtonClickHandler(this._inputText, this._resultText);
            } else {
                buttonClickHandler(value, this._inputText);
            }
        });
    }
}

const view = new View("First");
view.createHtml();

const INSERTABLE_KEYS = ['Enter', 'Space', 'Backspace',
                        '+', '-', '/', '*', "(", ")", ".",
                        '0', '1', '2', '3', '4',
                        '5', '6', '7', '8', "9"];
const checkInputKey = key => INSERTABLE_KEYS.includes(key);

const calculator = new Calculator();

function buttonClickHandler(value, inputText) {
    inputText.value = `${inputText.value}${value}`;
}

function equalButtonClickHandler(inputText, resultText) {
    resultText.innerText = calculator.calculate(inputText.value);
    inputText.value = '';
}

function operatorButtonClickHandler(value, inputText) {
    if (inputText.value.length <= 0) return;
    inputText.value = `${inputText.value}${value}`;
}

function clearButtonClickHandler(inputText, resultText) {
    inputText.value = '';
    resultText.innerText = '';
}

function inputTextKeyPress(event, inputText, resultText) {
    const valid = checkInputKey(event.key);

    if (!valid) {
        event.preventDefault();
        return;
    }

    if (event.key === 'Enter') {
        equalButtonClickHandler(inputText, resultText);
        event.preventDefault();
        return;
    }
}

// 3.
//   - 계산기와 UI 로직 분리
// Mouse/Keyboard -> Key Checker(filtering) -> Calculator -> UI

// inputText.addEventListener('keydown', event => inputTextKeyPress(event));
