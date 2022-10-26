import { Expression } from './operations-queue';
import { ResultsTable } from './results-table';

/**
 * Operand is either a value or a subexpression that evaluates to a number
 */
export type Operand = number | Expression;

export class OperandsTable {
    private entries: Operand[] = [];

    push(value: Operand): number {
        const newLength = this.entries.push(value);

        //Index of `value` is new length - 1
        return newLength - 1;
    }

    toResultsTable(executeFn: (e: Expression) => number) {
        const values: number[] = [];

        for (const e of this.entries) {
            if (Array.isArray(e)) {
                const v = executeFn(e);
                values.push(v);

                continue;
            }

            values.push(e);
        }

        return new ResultsTable(values);
    }
}
