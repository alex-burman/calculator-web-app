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
        if (operator in this) {
            let temp = this[operator](a, b);
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
let testC = ['4', 'add', '2','multiply','3','divide','2','subtract','20'];
let testD = ['(','2',')','multiply','(','(','2',')',')'];
let testE = ['(','(','2',')',')'];
let testF = ['8', 'multiply', '(','2','divide','(','2','divide','2',')',')']

let testStr = '8(8*2)+2';
let testStrA = '(8+((2))*(2)/(2)+1)'
let testStrB = ['2.1','+','10','/','2']

const testEval = function (str) {
    let result = evaluate(prepLine(str));
    console.log(result);
}

const prepLine = function (arr) {
    let prepped = [];

    arr.forEach((item, index, arr) => {
        let addItem;

        if (
            index > 0 &&
            item == '(' &&
            (/[0-9]/.test(item) || arr[index - 1] == ')')
        ) {
            addItem = ['multiply',item];
        } else if (item == '+') {
            addItem = 'add';
        } else if (item == '-') {
            addItem = 'subtract';
        } else if (item == '*') {
            addItem = 'multiply';
        } else if (item == '/') {
            addItem = 'divide';
        } else {
            addItem = item;
        }
        console.log(prepped)

        prepped = prepped.concat(addItem);
    })
    return prepped;
}

const evaluate = function (arr) {
    while (arr.includes('(') && arr.includes(')')) {
        let open = 0;
        let close = 0;
        let start = arr.indexOf('(');
        let group;

        for (let i = start; i < arr.length; i++) {
            if (arr[i] == '(') {
                open++;
            }

            if (arr[i] == ')') {
                close++;
            }

            if (open == close) {
                group = arr.slice(start + 1, i);
                arr.splice(start, i - start + 1, +evaluate(group));
                break;
            }
        }
    }

    if (arr.length < 2) {
        return arr[0];
    }

    let index = 1;

    if (arr.includes('add') || arr.includes('subtract')) {
        for (let i = index; i < arr.length; i++) {
            let item = arr[i];
            if (item == 'add' || item == 'subtract') {
                index = i;
                break;
            }
        }
    }

    let left = arr.slice(0, index);
    let right = arr.slice(index + 1);
    let oper = arr[index];

    return operators.operate(oper, +evaluate(left), +evaluate(right));
}