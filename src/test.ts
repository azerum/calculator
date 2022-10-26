import { scan } from './parsing';

const s = '1 + +1 + (1 + 1 + +1 - -1 ^ 2)';

try {
    console.dir(scan(s));
}
catch (e) {
    console.log(e.message);
}
