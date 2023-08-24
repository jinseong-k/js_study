const NO_OPERATOR = 10;

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

        let indexOfMulti = form.indexOf('*');
        let indexOfDiv = form.indexOf('/');
        console.log(`곱셈 위치 : ${indexOfMulti}`);
        console.log(`나눗셈 위치 : ${indexOfDiv}`);

        if (form.includes('+')) {
            token = form.split('+');
            resultValue = parseInt(token[0]) + parseInt(token[1]);
        } else if (form.includes('-')) {
            token = form.split('-');
            resultValue = parseInt(token[0]) - parseInt(token[1]);
        } else if (form.includes('*')) {
            token = form.split('*');
            resultValue = parseInt(token[0]) * parseInt(token[1]);
        } else if (form.includes('/')) {
            token = form.split('/');
            resultValue = parseInt(token[0]) / parseInt(token[1]);
        } else {
            let inputText = document.getElementById("inputText");
            let resultText = document.getElementById("resultText");
            resultValue = inputText.value;
        }
        return resultValue;
    }
}

class KeyChecker {
    _insertableKey;

    constructor() {
        this._insertableKey = ['Enter', 'Space', 'Backspace',
                          '+', '-', '/', '*', "(", ")",
                          '0', '1', '2', '3', '4',
                          '5', '6', '7', '8', "9", "."];
    }

    checkInputKey(key) {
        return this._insertableKey.includes(key);
    }
}

const calculate = new Calculator();
const keyChecker = new KeyChecker();

function buttonClickHandler() {
    console.log(this.value);
    inputText = document.getElementById("inputText");
    inputText.value = `${inputText.value}${this.value}`;
}

function equalButtonClickHandler() {

    inputText = document.getElementById("inputText");
    resultText = document.getElementById("resultText");

    resultText.value = calculate.calculate(inputText.value);
    inputText.value = '';
}

function operatorButtonClickHandler() {
    console.log(this.value);
    inputText = document.getElementById("inputText");
    console.log(inputText.value.length);
    if (inputText.value.length <= 0) return;
    inputText.value = `${inputText.value}${this.value}`;
}

function clearButtonClickHandler() {
    inputText = document.getElementById("inputText");
    resultText = document.getElementById("resultText");

    inputText.value = '';
    resultText.value = '';
}

function inputTextKeyPress(event) {
    event.returnValue = keyChecker.checkInputKey(event.key);
    if (event.returnValue) {
        if (event.key === 'Enter') {
            equalButtonClickHandler();
        }
    }
}

const button1 = document.getElementById("button1");
const button2 = document.getElementById("button2");
const button3 = document.getElementById("button3");
const button4 = document.getElementById("button4");
const button5 = document.getElementById("button5");
const button6 = document.getElementById("button6");
const button7 = document.getElementById("button7");
const button8 = document.getElementById("button8");
const button9 = document.getElementById("button9");
const button0 = document.getElementById("button0");

const buttonEqual = document.getElementById("button=");

const buttonPlus = document.getElementById("buttonPlus");
const buttonMinus = document.getElementById("buttonMinus");
const buttonDiv = document.getElementById("buttonDiv");
const buttonMulti = document.getElementById("buttonMulti");
const buttonClear = document.getElementById("buttonClear");

const textarea = document.getElementById('inputText');

textarea.addEventListener('keydown', event => inputTextKeyPress(event));

button1.addEventListener('click', buttonClickHandler);
button2.addEventListener('click', buttonClickHandler);
button3.addEventListener('click', buttonClickHandler);
button4.addEventListener('click', buttonClickHandler);
button5.addEventListener('click', buttonClickHandler);
button6.addEventListener('click', buttonClickHandler);
button7.addEventListener('click', buttonClickHandler);
button8.addEventListener('click', buttonClickHandler);
button9.addEventListener('click', buttonClickHandler);
button0.addEventListener('click', buttonClickHandler);

buttonPlus.addEventListener('click', operatorButtonClickHandler);
buttonMinus.addEventListener('click', operatorButtonClickHandler);
buttonMulti.addEventListener('click', operatorButtonClickHandler);
buttonDiv.addEventListener('click', operatorButtonClickHandler);

buttonClear.addEventListener('click', clearButtonClickHandler);

buttonEqual.addEventListener('click', equalButtonClickHandler);