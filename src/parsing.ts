import { Operand, OperandsTable } from './operands-table';
import { Expression, Operation, OperationsQueue } from "./operations-queue";

export type Token = number | BinaryOperatorToken;
export type BinaryOperatorToken = '+' | '-' | '*' | '/' | '^';

export type TokenTree = (Token | TokenTree)[];

/**
 * Scans tokens from string `s`. Returns a nested array (tree) in form
 * `T = [number, BinaryOperatorToken, T, BinaryOperatorToken, number...]`
 * 
 * That is, first token is always a number or a subexpression, second token
 * is always a binary operator token, third token is always a number or a
 * subexpression, fourth token is always binary operator token and so on
 */
export function scan(s: string): TokenTree {
    let current: TokenTree = [];
    const previousStack: TokenTree[] = [];

    let lastNumberStart: number | null = null;
    let hadDecimalPoint = false;
    let inBinaryOperator = false;

    for (let i = 0; i < s.length; ++i) {
        const c = s.charAt(i);

        if (c.trim().length === 0) {
            continue;
        }

        if (c >= '0' && c <= '9') {
            if (lastNumberStart === null) {
                lastNumberStart = i;
            }

            continue;
        }

        if (c === '.') {
            if (hadDecimalPoint) {
                throwError(i, 'double decimal point is not allowed');
            }

            hadDecimalPoint = true;

            if (lastNumberStart === null) {
                lastNumberStart = i;
            }

            continue;
        }

        endNumberIfAny(i);

        if (c === '(') {
            previousStack.push(current);
            current = [];

            continue;
        }

        if (c === ')') {
            const parent = previousStack.pop();

            if (parent === undefined) {
                throwError(i, 'unmatched closing parenthesis');
            }

            parent.push(current);
            current = parent;

            continue;
        }

        switch (c) {
            case '+':
            case '-':
            case '*':
            case '/':
            case '^':
                if (current.length === 0) {
                    throwError(
                        i, 
                        'expression cannot start with an operation\n' + 
                        '(unary operations are not supported)'
                    );
                }

                if (inBinaryOperator) {
                    throwError(i, 'expected value');
                }

                inBinaryOperator = true;
                current.push(c);
                break;

            case ',':
                throwError(i, "use '.' instead of ','");

            default:
                throwError(i, `unknown character ${c}`);
        }
    }

    endNumberIfAny(s.length);

    if (inBinaryOperator) {
        throwError(s.length, 'expected value');
    }

    if (previousStack.length > 0) {
        throwError(s.length, `unmatched opening parenthesis: ${previousStack.length}`);
    }

    return current;

    function endNumberIfAny(i: number) {
        if (lastNumberStart !== null) {
            const token = s.slice(lastNumberStart, i);
            const n = Number(token);

            current.push(n);

            lastNumberStart = null;
            hadDecimalPoint = false;
            inBinaryOperator = false;
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

    const a = toOperand(tokens[0]);
    let aIndex = operandsTable.push(a);

    for (let i = 1; i < tokens.length; i += 2) {
        const operator = tokens[i] as BinaryOperatorToken;

        const b = toOperand(tokens[i + 1]);
        const bIndex = operandsTable.push(b);

        const op: Operation = { 
            aIndex,
            bIndex,
            operator
        };

        operationsQueue.enqueue(op);
        aIndex = bIndex;
    }

    function toOperand(t: Token | TokenTree): Operand {
        if (Array.isArray(t)) {
            return parse(t);
        }

        return t as number;
    }

    return [operationsQueue, operandsTable];
}
