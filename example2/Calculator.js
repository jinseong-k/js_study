const OPS = ["+", "-", "*", "/"];
const pad = document.getElementById("pad");
const inputText = document.getElementById("inputText");
const resultText = document.getElementById("resultText");

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

const INSERTABLE_KEYS = ['Enter', 'Space', 'Backspace',
                        '+', '-', '/', '*', "(", ")", ".",
                        '0', '1', '2', '3', '4',
                        '5', '6', '7', '8', "9"];
const checkInputKey = key => INSERTABLE_KEYS.includes(key);

const calculate = new Calculator();

function buttonClickHandler(value) {
    inputText.value = `${inputText.value}${value}`;
}

function equalButtonClickHandler() {
    resultText.value = calculate.calculate(inputText.value);
    inputText.value = '';
}

function operatorButtonClickHandler(value) {
    if (inputText.value.length <= 0) return;
    inputText.value = `${inputText.value}${value}`;
}

function clearButtonClickHandler() {
    inputText.value = '';
    resultText.value = '';
}

function inputTextKeyPress(event) {
    const valid = checkInputKey(event.key);

    if (!valid) {
        event.preventDefault();
        return;
    }

    if (event.key === 'Enter') {
        equalButtonClickHandler();
        event.preventDefault();

        return;
    }
}

// 3.
//   - 계산기와 UI 로직 분리
// Mouse/Keyboard -> Key Checker(filtering) -> Calculator -> UI

// 2. event delegation(이벤트 위임)
pad.addEventListener('click', event => {
    const {value} = event.target;

    if (!value) {
        return;
    }

    if (OPS.includes(value)) {
        operatorButtonClickHandler(value);
    } else if (value === "C") {
        clearButtonClickHandler(value);
    } else if (value === "=") {
        equalButtonClickHandler(value);
    } else {
        // todo "." 처리 필요함
        buttonClickHandler(value);
    }
});

inputText.addEventListener('keydown', event => inputTextKeyPress(event));
