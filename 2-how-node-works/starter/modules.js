console.log(arguments);
console.log(require('module').wrapper);

const C = require('./test-module-1');

const calc1 = new C();
const calc2 = require('./test-module-2');
const { add, divide } = require('./test-module-2');
console.log(add(2, 5));
require('./test-module-3')();