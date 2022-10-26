import { execute } from './execute';
import { parse, scan } from './parsing';

export function evalAndPrint(s: string): boolean {
    try {
        const tokens = scan(s);

        if (tokens.length === 0) {
            return true;
        }
        
        const expression = parse(tokens);
        const result = execute(expression);
        
        console.log(result);
        return true;
    }
    catch (e) {
        console.log(e instanceof Error ? e.message : e);
        return false;
    }
}
