import { OperandsTable } from './operands-table';
import { BinaryOperatorToken, UnaryOperatorToken } from "./parsing";

export type Expression = [OperationsQueue, OperandsTable];

export type Operation = UnaryOperation | BinaryOperation;

interface UnaryOperation {
    type: 'unary';
    operator: UnaryOperatorToken;
    aIndex: number;
}

interface BinaryOperation {
    type: 'binary';
    operator: BinaryOperatorToken;
    aIndex: number;
    bIndex: number;
}

interface OperationWrapper {
    operation: Operation;
    priority: number;
    index: number;
}

type PriorityTable = {
    [operator in BinaryOperatorToken]: number;
}

const priorityTable: PriorityTable = {
    '+': 0,
    '-': 0,
    '*': 1,
    '/': 1,
    '^': 2
} as const;

export class OperationsQueue {
    private items: OperationWrapper[] = [];
    private nextOperationIndex = 0;

    enqueue(operation: Operation) {
        const index = this.nextOperationIndex;
        ++this.nextOperationIndex;

        this.items.push({
            priority: priorityTable[operation.operator],
            index,
            operation
        });
    }

    dequeue(): Operation | undefined {
        const wrapper = this.items.shift();

        if (wrapper === undefined) {
            return undefined;
        }

        return wrapper.operation;
    }

    sortByPriorityAndOrder() {
        this.items.sort((a, b) => {
            //Sort in descending order by priorty -- operation with
            //higher priority should appear earlier in the queue.
            //If operations have same priorty, sort by index
            //in ascending order -- the earlier operation appeared in 
            //expression, the earlier it should be in the queue.
            
            if (a.priority === b.priority) {
                return a.index - b.index;
            }

            return b.priority - a.priority;
        });
    }
}
