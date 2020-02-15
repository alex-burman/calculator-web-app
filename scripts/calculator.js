// const add = function (a, b) {
//     return a + b;
// }

// const subtract = function (a, b) {
//     return a - b;
// }

// const multiply = function (a, b) {
//     return a * b;
// }

// const divide = function (a, b) {
//     return a / b;
// }

// const operate = function (operator, a, b) {
//     if (operator == 'add') {
//         return add(a, b);
//     } else if (operator == 'subtract') {
//         return subtract(a, b);
//     } else if (operator == 'multiply') {
//         return multiply(a, b);
//     } else if (operator == 'divide') {
//         return divide(a, b);
//     } else {
//         console.log('invalid operator');
//     }
// }

const operators = {
    add(a, b) {
        return a + b;
    },
    subtract(a, b) {
        return a + b;
    },
    multiply(a, b) {
        return a * b;
    },
    divide(a, b) {
        return a / b;
    },
    operate(operator, a, b) {
        if (operator in this) {
            return this[operator](a, b);
        } else {
            console.log('invalid operator');
        }
    },
}