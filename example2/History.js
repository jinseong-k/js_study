export class History {
    _resultHistory;
    _index;

    constructor() {
        this._resultHistory = [];
        this._index = -1;
    }

    // [a, b*, c, e, f, g] -> add d -> [a, b, d*]
    addHistory(data) {
      this._resultHistory[++this._index] = data;
      this._resultHistory.length = this._index + 1;
    }

    undo() {
        if (this._index === -1) {
          return null;
        }

        if (this._index > 0) {
            // snapshot
            return this._resultHistory[--this._index]; // [{op: "+", input: 3}, {op: "+", input: 4}, {op: "+", input: 5}] -> 12
        }
        return this._resultHistory[0];
    }

    redo() {
        if (this._index === -1) {
            return null;
        }
       
        if (this._resultHistory[this._index+1]) {
            return this._resultHistory[++this._index];
        }
        return this._resultHistory[this._index];
    }

    clearHistory() {
        this._resultHistory = [];
        this._index = -1;
    }

    getSaveData() {
        return {index: this._index, historyData: this._resultHistory};
    }

    setLoadData(data) {
        const { index, historyData } = data;

        this._index = index;
        this._resultHistory = historyData;
    }
}