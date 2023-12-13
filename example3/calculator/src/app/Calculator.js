
// Store..
import {OP} from "./const";

export class Calculator {
    static calculate(result, input, op) {
        switch(op) {
            case OP.ADD:
                return parseFloat(result) + parseFloat(input);
            case OP.SUB:
                return parseFloat(result) - parseFloat(input);
            case OP.MUL:
                return parseFloat(result) * parseFloat(input);
            case OP.DIV:
                return parseFloat(result) / parseFloat(input);
        }
    }
}
