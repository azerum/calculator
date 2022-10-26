import exp = require('constants');
import path = require('path');
import readline = require('readline');
import { execute } from './execute';
import { scan, parse } from './parsing';

const expression = process.argv[2];

if (expression !== undefined) {
    const ok = evalAndPrint(expression);
    process.exit(ok ? 0 : 1);
}

const arg0 = path.basename(process.argv[0]);
const arg1 = path.basename(process.argv[1]);

console.log(`To execute one command, use: ${arg0} ${arg1} <expression-in-quotes>`);

const rl = readline.createInterface(process.stdin, process.stdout);

process.once('SIGINT', () => {
    //Write new line after '^C' not to mess up user's terminal
    console.log()
});

const loop = () => {
    rl.question('> ', (answer) => {
        evalAndPrint(answer);
        loop();
    });
};

loop();

function evalAndPrint(expression: string): boolean {
    try {
        const tokens = scan(expression);
        const [operationsQueue, valuesTable] = parse(tokens);
        const result = execute(operationsQueue, valuesTable);
        
        console.log(result);
        return true;
    }
    catch (e) {
        console.log(e instanceof Error ? e.message : e);
        return false;
    }
}
