import { Expression, Operation } from "./operations-queue";

export function execute(expression: Expression): number {
    const [operationsQueue, operandsTable] = expression;
    const resultsTable = operandsTable.toResultsTable(execute);

    operationsQueue.sortByPriorityAndOrder();

    while (true) {
        const op = operationsQueue.dequeue();

        if (op === undefined) {
            return resultsTable.valueAt(0);
        }

        const result = computeResult(op);
        const indexes = getIndexes(op);

        resultsTable.redirectIndexesTo(indexes, result);
    }

    function computeResult(op: Operation) {
        const a = resultsTable.valueAt(op.aIndex);

        if (op.type === 'unary') {
            switch (op.operator) {
                case '+': return a;
                case '-': return -a;
            }
        }

        const b = resultsTable.valueAt(op.bIndex);

        switch (op.operator) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': return a / b;
            case '^': return Math.pow(a, b);
        }
    }

    function getIndexes(op: Operation) {
        switch (op.type) {
            case 'unary': return [op.aIndex];
            case 'binary': return [op.aIndex, op.bIndex];
        }
    }
}
