// 4. history 저장하기/불러오기 (브라우저)

export class Calculator {
    _resultHistory;
    _resultValue;
    _curOperator;
    _index;

    constructor() {
        this._resultValue = 0;
        this._resultHistory = [];
        this._curOperator = null;
        this._index = -1;
    }

    /**
     * JSDoc (JavaScript Documentation)
     * @param {"+"|"-"|"*"|"/"} op
     */
    set curOperator(op) {
        this._curOperator = op;
    }

    get getHistory() {
        return this._resultHistory;
    }

    set setHistory(data) {
        this._resultHistory = data;
    }

    undo() {
        if (this._index > 0) {
            // snapshot
            this._resultValue = this._resultHistory[--this._index]; // [{op: "+", input: 3}, {op: "+", input: 4}, {op: "+", input: 5}] -> 12
        }
        this._curOperator = null;

        return this._resultValue;
    }

    redo() {
        if (this._resultHistory[this._index+1]) {
            this._resultValue = this._resultHistory[this._index+1];
            this._index++;
        }
        this._curOperator = null;

        return this._resultValue;
    }

    calculate(number, op) {
        this._resultValue = this._calculate(this._resultValue, this._curOperator, number);
        this._curOperator = op;

        this._resultHistory[++this._index] = this._resultValue;
        // this._resultHistory.length = this._index;
        this._resultHistory[this._index+1] = null;

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
        this._resultHistory = [];
        this._index = -1;
    }

    getSaveData() {
        return {"index": this._index, "historyData": this._resultHistory};
    }

    setLoadData(data) {
        this._index = data["index"];
        this._resultHistory = data["historyData"].split(',');
        this._resultValue = this._resultHistory[this._index];
        return this._resultValue;
    }
}
