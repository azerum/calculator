import path = require('path');
import readline = require('readline');
import { evalAndPrint } from './eval-and-print';

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
