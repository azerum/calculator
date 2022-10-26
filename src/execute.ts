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

        executeOperation(op);
    }

    function executeOperation(op: Operation) {
        const a = resultsTable.valueAt(op.aIndex);
        const b = resultsTable.valueAt(op.bIndex);

        let result: number;

        switch (op.operator) {
            case '+':
                result = a + b;
                break;

            case '-':
                result = a - b;
                break;

            case '*':
                result = a * b;
                break;

            case '/':
                result = a / b;
                break;

            case '^':
                result = Math.pow(a, b);
                break;
        }

        resultsTable.redirectIndexesTo(
            [op.aIndex, op.bIndex],
            result
        );
    }
}
