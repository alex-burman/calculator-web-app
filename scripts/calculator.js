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
            let floatCorrection = 1;
            while (a%1 > 0 || b%1 > 0) {
                a *= 10;
                b *= 10;
                floatCorrection *= 10;
            }
            let temp = this[operator](a, b);
            temp = temp/floatCorrection;
            return temp;
        } else {
            console.log('invalid operator');
        }
    },
}

const calculatorState = {
    currentCalculation: [{command: null, value: null}],
    previousCalculation: [],
    openScope: 0,
    closedScope: 0,
    updateCalculatorState(key) {
        const lastItem = this.currentCalculation[this.currentCalculation.length - 1];

        let command = key.dataset.command;

        if (!command) {
            command = 'number';
        }

        if (doNothing(command, lastItem, this)) {
            return;
        }
        
        if (command == 'clearEntry') {
            this.clearLastEntry(lastItem);
            return;
        }
        
        if (command == 'clear') {
            this.clear();
            return;
        }
        
        if (command == 'calculate') {
            this.calculate(this.currentCalculation.slice(0));
            return;
        }

        this.currentCalculation = this.updateCurrentCalculation(
            command,
            key.textContent,
            lastItem, 
            this.currentCalculation.slice(0)
        );

        if (command == 'open') {
            this.openScope += 1;
        }
        if (command == 'close') {
            this.closedScope += 1;
        }
    },
    updateCurrentCalculation(newCommand, newValue, lastItem, currentCalc) {
        // if (!newCommand) {
        //     newCommand = 'number';
        // }

        let newItem = createItem(newCommand, newValue, lastItem);

        if (newCommand == 'operator' && lastItem.command == null) {
            currentCalc.push({command: 'number', value: '0'});
        }

        if (newItem.command == 'number' && lastItem.command == 'close') {
            currentCalc.push({command: 'operator', value: '*'});
        }

        if (doReplace(newItem, lastItem) == true) {
            currentCalc[currentCalc.length - 1] = newItem;
        } else {
            currentCalc.push(newItem);
        }

        return currentCalc;
    },
    calculate(calculation) {
        const ans = evaluate(prepForEval(calculation));

        this.previousCalculation.push({calculation, ans})
        this.currentCalculation = [{command: null, value: null}];
        this.currentCalculation.push({command: 'ans', value: `${ans}`})
        return;
    },
    clearLastEntry(lastItem) {

        // removes the last entry from the current calculation. If last entry is a
        // number with a length > 2, last entry is modifed

        if (lastItem.command == 'number' && lastItem.value.length > 1) {
            lastItem.value = lastItem.value.slice(0, lastItem.value.length - 1);
            return;
        } else {
            this.currentCalculation.pop();
        }

        if (lastItem.command == 'open') {
            this.openScope -= 1;
        }
        if (lastItem.command == 'close') {
            this.closedScope -= 1;
        }
    },
    clear() {

        // resets current calculation and open/closed scope properties

        this.currentCalculation = [{command: null, value: null}];
        this.openScope = 0;
        this.closedScope = 0;
        return;
    },
}

const createItem = function(newCommand, newValue, lastItem) {

    // creates a new item to be added to the calculation.

    if (newCommand == 'number') {
        if (lastItem.command == 'number') {
            newValue = lastItem.value + newValue;
        }
    }

    if (newCommand == 'decimal') {
        if (lastItem.command == 'number') {
            newValue = lastItem.value + newValue;
        } else {
            newValue = '0.';
        }

        newCommand = 'number';
    }

    return {command: newCommand, value: newValue};
}

const doNothing = function (newCommand, lastItem, state) {

    // returns true if conditions are met, returns false otherwise

    if (newCommand == 'calculate') {
        return !(lastItem.command == 'number' || lastItem.command == 'close')
    }

    if (newCommand == 'clearEntry' && lastItem.command == null) {
        return true;
    }

    if (newCommand == 'operator') {
        return lastItem.command == 'open';
    }
    
    if (newCommand == 'decimal') {
        console.log(lastItem.command && lastItem.value)
        return !(lastItem.command == null) && lastItem.value.includes('.')
    }

    if (newCommand == 'close') {
        return (
            state.openScope <= state.closedScope
            || !(lastItem.command == 'number' || lastItem.command == 'close')
        )
    }

    return false;
}

const doReplace = function (newItem, lastItem) {

    // returns true if conditions are met, otherwise returns false

    if (lastItem.command == 'ans') {
        return !(newItem.command == 'operator');
    }

    if (newItem.command == 'number' || newItem.command == 'decimal') {
        return lastItem.command == 'number';
    }

    if (newItem.command == 'operator') {
        return lastItem.command == 'operator';
    }

    return false;
}

const calcToString = function(calc) {

    // takes an array of objects and converts it into an string using 
    // the 'value' property of those objects

    if (calc.length == 1) {
        return '0';
    }

    return calc.reduce((string, item, index, arr) => {
        if (item.command == null) {
            return string;
        }

        const lastItem = arr[index - 1];

        let next = item.value;
        
        if (
            item.command == 'operator'
            || lastItem.command == 'operator'
        ) {
            next = ' ' + next;
        }
        return string + next;
    }, '')
}

const prepForEval = function(arr) {

    // takes an array of objects and creates an array of numbers, operations,
    // and parens based on the 'value' property of each object

    let prepped = arr.reduce((newArr, item, index, arr) => {
        if (item.value == null) {
            return newArr;
        }
        if (item.value == '+') {
            newArr.push('add');
        } else if (item.value == '-') {
            newArr.push('subtract');
        } else if (item.value == '*') {
            newArr.push('multiply');
        } else if (item.value == '/') {
            newArr.push('divide');
        } else if (
            item.value == '('
            && index > 1
            && arr[index - 1].command != 'operator'
            && arr[index - 1].command != 'open'
        ) {
            newArr.push('multiply');
            newArr.push(item.value);
        } else {
            newArr.push(item.value);
        }
        return newArr;
    }, []);

    while (calculatorState.closedScope < calculatorState.openScope) {
        prepped.push(')');
        calculatorState.closedScope += 1;
    }

    return prepped;
}

const evaluate = function(arr) {

    // recursively evaluates an array of numbers and operations (all srings) and returns the answer

    while (arr.includes('(') && arr.includes(')')) {
        let open = 0;
        let close = 0;
        let start = arr.indexOf('(');
        let group;

        for (let i = start; i < arr.length; i++) {
            if (arr[i] == '(') {
                open++;
            } else if (arr[i] == ')') {
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

    return operators.operate(
        arr[index],
        +evaluate(arr.slice(0, index)),
        +evaluate(arr.slice(index + 1))
    );
}

const updateCalcDisplay = function (state) {

    // updates the calculator display on the page using the calculator state

    const display = document.querySelector('.calculator__display');

    let displayContent = calcToString(state.currentCalculation);

    display.textContent = displayContent;
}

const keys = document.querySelector('.calculator__keys');

keys.addEventListener('click', (e) => {
    if (e.target.matches('button')) {
        calculatorState.updateCalculatorState(e.target);
        updateCalcDisplay(calculatorState);
    }
});