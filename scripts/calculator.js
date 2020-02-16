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

const keys = document.querySelector('.calculator__keys');
const display = document.querySelector('.calculator__display');

keys.addEventListener('click', e => {
    if (e.target.matches('button')) {
        const key = e.target;
        const action = key.dataset.action;
        const keyContent = key.textContent;
        const displayedNum = display.textContent;

        if (!action) {
            console.log('number key!');
            console.log(displayedNum)
            if (displayedNum == '0') {
                display.textContent = keyContent;
            } else {
                display.textContent = displayedNum + keyContent;
            }
        }
        if (
            action == 'add' ||
            action == 'subtract' ||
            action == 'multiply' ||
            action == 'divide'
        ) {
            console.log('operator key!');
        }
    }
})