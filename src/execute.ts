import { Operation, OperationsQueue } from "./operations-queue";
import { ValuesTable } from "./values-table";

export function execute(
    operationsQueue: OperationsQueue, 
    valuesTable: ValuesTable
): number {
    operationsQueue.sortByPriorityAndOrder();

    while (true) {
        const op = operationsQueue.dequeue();

        if (op === undefined) {
            return valuesTable.valueAt(0);
        }

        executeOperation(op);
    }

    function executeOperation(op: Operation) {
        const a = valuesTable.valueAt(op.valueAIndex);
        const b = valuesTable.valueAt(op.valueBIndex);

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

        valuesTable.redirectIndexesTo(
            [op.valueAIndex, op.valueBIndex], 
            result
        );
    }
}
