interface Redirect {
    value: number;
}

type Entry = number | Redirect;

export class ValuesTable {
    private entries: Entry[] = [];

    push(value: number): number {
        const newLength = this.entries.push(value);

        //Index of `value` is new length - 1
        return newLength - 1;
    }

    valueAt(index: number) {
        const e = this.entries[index];

        if (typeof e === 'number') {
            return e;
        }

        return e.value;
    }

    redirectIndexesTo(indexes: number[], value: number) {
        let redirect = this.getExistingRedirectAtAnyIndex(indexes);

        if (redirect === undefined) {
            redirect = { value };
        }
        else {
            redirect.value = value;
        }

        for (const i of indexes) {
            this.entries[i] = redirect;
        }
    }

    private getExistingRedirectAtAnyIndex(indexes: number[]): Redirect | undefined {
        for (const i of indexes) {
            const e = this.entries[i];

            if (typeof e !== 'number') {
                return e;
            }
        }

        return undefined;
    }
}
