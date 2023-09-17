// 3. history: undo(실행취소)/redo(다시실행)
// 4. history 저장하기/불러오기 (브라우저)

export class Calculator {
    _resultValue;
    _curOperator;

    constructor() {
        this._resultValue = 0;
        this._curOperator = null;
    }

    calculate(number, op) {
        this._resultValue = this._calculate(this._resultValue, this._curOperator, number);
        this._curOperator = op;

        return this._resultValue;
    }

    _calculate(prev, op, number) {
        switch(op) {
            case '+':
                return parseFloat(prev)+parseFloat(number);
            case '-':
                return parseFloat(prev)-parseFloat(number);
            case '*':
                return parseFloat(prev)*parseFloat(number);
            case '/':
                return parseFloat(prev)/parseFloat(number);
            case '=':
                const value = this._calculate(prev, this._curOperator, number);

                this._curOperator = null;

                return value;
            default:
                return number;
        }
    }

    clearCalculator() {
        this._resultValue = 0;
        this._curOperator = null;
    }
}
