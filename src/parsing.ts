import { Operation, OperationsQueue } from "./operations-queue";
import { ValuesTable } from "./values-table";

export type Token = number | BinaryOperatorToken;
export type BinaryOperatorToken = '+' | '-' | '*' | '/' | '^';

/**
 * Scans tokens from string `s`. Resulting array is guranteed to be in the form
 * `[number, BinaryOperatorToken, number, BinaryOperatorToken, number...]`
 */
export function scan(s: string): Token[] {
    const results: Token[] = [];

    let lastNumberStart: number | null = null;
    let hadDecimalPoint = false;

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

        switch (c) {
            case '+':
            case '-':
            case '*':
            case '/':
            case '^':
                if (results.length === 0) {
                    throwError(
                        i, 
                        'expression cannot start with an operation\n' + 
                        '(unary operations are not supported)'
                    );
                }

                results.push(c);
                break;

            case ',':
                throwError(i, "use '.' instead of ','");

            default:
                throwError(i, `unknown character ${c}`);
        }
    }

    endNumberIfAny(s.length);

    return results;

    function endNumberIfAny(i: number) {
        if (lastNumberStart !== null) {
            const token = s.slice(lastNumberStart, i);
            const n = Number(token);

            results.push(n);

            lastNumberStart = null;
            hadDecimalPoint = false;
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

export function parse(tokens: Token[]): [OperationsQueue, ValuesTable] {
    const operationsQueue = new OperationsQueue();
    const valuesTable = new ValuesTable();

    if (tokens.length === 0) {
        return [operationsQueue, valuesTable];   
    }

    const a = tokens[0] as number;
    let aIndex = valuesTable.push(a);

    for (let i = 1; i < tokens.length; i += 2) {
        const operator = tokens[i] as BinaryOperatorToken;
        const b = tokens[i + 1] as number;

        const bIndex = valuesTable.push(b);

        const op: Operation = {
            valueAIndex: aIndex,
            valueBIndex: bIndex,
            operator
        };

        operationsQueue.enqueue(op);

        aIndex = bIndex;
    }

    return [operationsQueue, valuesTable];
}
