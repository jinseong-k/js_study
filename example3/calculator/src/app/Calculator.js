
// Store..
export class Calculator {
    static calculate(result, input, op) {
        switch(op) {
            case '+':
                return parseFloat(result) + parseFloat(input);
            case '-':
                return parseFloat(result) - parseFloat(input);
            case '*':
                return parseFloat(result) * parseFloat(input);
            case '/':
                return parseFloat(result) / parseFloat(input);
        }
    }
}
