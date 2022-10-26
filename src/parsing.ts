import { Operand, OperandsTable } from './operands-table';
import { Expression, Operation, OperationsQueue } from "./operations-queue";

export type Token = number | Operator;
export type Operator = UnaryOperatorToken | BinaryOperatorToken;

const unaryOperators = ['+', '-'] as const;
const binaryOperators = ['+', '-', '*', '/', '^'] as const;

function isIn<T extends readonly unknown[]>(values: T, x: any): x is T[number] {
    return values.includes(x);
}

export type BinaryOperatorToken = (typeof binaryOperators)[number];
export type UnaryOperatorToken = (typeof unaryOperators)[number];

export type TokenTree = (Token | TokenTree)[];

type State = {
    type: 'none'
} | {
    type: 'inNumber',
    numberStart: number,
    hadDecimalPoint: boolean,
    wasInUnary: boolean
} | {
    type: 'afterNumber'
} | {
    type: 'inBinary'
} | {
    type: 'inUnary'
};

class TokensStack {
    private _current: TokenTree = [];
    private previousStack: TokenTree[] = [];

    get isInSubexpression() {
        return this.previousStack.length > 0;
    }

    get subexpressionDepth() {
        return this.previousStack.length;
    }

    get current(): TokenTree {
        return this._current;
    }

    enterSubexpression() {
        this.previousStack.push(this._current);
        this._current = [];
    }

    exitSubexpression() {
        if (!this.isInSubexpression) {
            throw new Error('Not in subexpression');
        }

        const parent = this.previousStack.pop()!;

        parent.push(this._current);
        this._current = parent;
    }
}

export function scan(s: string): TokenTree {
    const stack = new TokensStack();
    let state: State = { type: 'none' };

    for (let i = 0; i < s.length; ++i) {
        const c = s.charAt(i);

        if (c.trim().length === 0) {
            continue;
        }

        if (c >= '0' && c <= '9' || c === '.') {
            onReadDigitOnDot(i, c);
            continue;
        }

        exitNumberIfInIt(i);

        //Handle parantheses first
        if (c === '(') {
            stack.enterSubexpression();
            continue;
        }

        if (c === ')') {
            if (!stack.isInSubexpression) {
                throwError(i, 'unmatched closing parenthesis');
            }

            stack.exitSubexpression();
            continue;
        }

        if (c === ',') {
            throwError(i, "use '.' instead of ','");
        }

        onReadOther(i, c);
    }

    exitNumberIfInIt(s.length);

    if (stack.isInSubexpression) {
        throwError(s.length, `unmatched opening parenthesis: ${stack.subexpressionDepth}`);
    }

    return stack.current;


    function onReadDigitOnDot(i: number, c: string) {
        switch (state.type) {
            case 'none':
            case 'inBinary':
            case 'inUnary':
            case 'inNumber':
                break;

            default: 
                throwError(i, 'expected operator');
        }

        if (state.type === 'inNumber') {
            if (c === '.') {
                if (state.hadDecimalPoint) {
                    throwError(i, 'double decimal point is not allowed');
                }

                state.hadDecimalPoint = true;
            }
        }
        else {
            state = {
                type: 'inNumber',
                numberStart: i,

                hadDecimalPoint: c === '.',
                wasInUnary: state.type === 'inUnary'
            };
        }
    }

    function exitNumberIfInIt(i: number) {
        if (state.type !== 'inNumber') {
            return;
        }

        const token = s.slice(state.numberStart, i);
        const n = Number(token);

        stack.current.push(n);

        if (state.wasInUnary) {
            stack.exitSubexpression();
        }

        state = {
            type: 'afterNumber'
        };
    }

    function onReadOther(i: number, c: string) {
        switch (state.type) {
            case 'none':
            case 'inBinary':
                if (!isIn(unaryOperators, c)) {
                    throwError(i, 'expected unary operator');
                }

                stack.enterSubexpression();
                stack.current.push(c);

                state = {
                    type: 'inUnary'
                };

                break;

            case 'afterNumber':
                if (!isIn(binaryOperators, c)) {
                    throwError(i, 'expected binary operator');
                }

                stack.current.push(c);

                state = {
                    type: 'inBinary'
                };
                break;
        }
    }

    function throwError(i: number, note: string): never {
        const lines = [
            s,
            ' '.repeat(i) + '^ ' + note
        ];

        throw new Error(lines.join('\n') + '\n');
    }
}

export function parse(tokens: TokenTree): Expression {
    if (tokens.length === 0) {
        throw new Error('Should not happen: parse() got empty tokens array');
    }

    const operationsQueue = new OperationsQueue();
    const operandsTable = new OperandsTable();

    const first = tokens[0];

    if (isIn(unaryOperators, first)) {
        const a = toOperand(tokens[1]);
        
        const op: Operation = {
            type: 'unary',
            operator: first,
            aIndex: operandsTable.push(a)
        };

        operationsQueue.enqueue(op);
        return [operationsQueue, operandsTable];
    }

    const a = toOperand(first);
    let aIndex = operandsTable.push(a);

    for (let i = 1; i < tokens.length; i += 2) {
        const operator = tokens[i] as BinaryOperatorToken;

        const b = toOperand(tokens[i + 1]);
        const bIndex = operandsTable.push(b);

        const op: Operation = {
            type: 'binary',
            operator,
            aIndex,
            bIndex
        };
    
        operationsQueue.enqueue(op);
        aIndex = bIndex;
    }

    return [operationsQueue, operandsTable];
}

function toOperand(t: Token | TokenTree): Operand {
    if (Array.isArray(t)) {
        return parse(t);
    }

    return t as number;
}
