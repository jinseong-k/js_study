
// Store..
import {OP} from "./const";

export class Calculator {
    static calculate(result, input, op) {
        result = Number(result);
        input = Number(input);

        switch(op) {
            case OP.ADD:
                return result + input;
            case OP.SUB:
                return result - input;
            case OP.MUL:
                return result * input;
            case OP.DIV:
                return result / input;
        }
    }
}
