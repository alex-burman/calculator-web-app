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
        return a - b;
    },
    multiply(a, b) {
        return a * b;
    },
    divide(a, b) {
        return a / b;
    },
    operate(operator, a, b) {
        console.log('test',operator, a, b);
        if (operator in this) {
            let temp = this[operator](a, b);
            console.log('This is the operate function result', temp)
            return temp;
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



let testA = ['2', 'multiply', '2', 'add', '3', 'multiply', '4']
let testB = ['2','add','2','add','2','divide','2'];
let testC = ['4', 'add', '2','multiply','3'];


const evaluate= function (arr) {
    if (arr.length < 2) return arr[0];

    let opIndex = arr.length - 2;

    if (arr.includes('add') || arr.includes('subtract')) {
        for (let i = (arr.length - 1); i >= 0; i--) {
            let item = arr[i];
            if (item == 'add' || item == 'subtract') {
                opIndex = i;
                break;
            }
        }
    }

    let left = arr.slice(0, opIndex);
    let right = arr.slice(opIndex + 1);
    let oper = arr[opIndex];

    return operators.operate(oper, +eval2(left), +eval2(right));
}

const test2 = function (func) {
    console.log(func);
}