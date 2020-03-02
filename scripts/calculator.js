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

const calculatorState = {
    currentCalculation: [{command: null, value: null}],
    previousCalculation: [],
    openScope: 0,
    closedScope: 0,
    updateCalculatorState(key) {
        const command = key.dataset.command;
        const lastItem = this.currentCalculation[this.currentCalculation.length - 1];

        if (doNothing(key.dataset.command, lastItem, this)) {
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
        if (!newCommand) {
            newCommand = 'number';
        }

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
        this.currentCalculation = [{command: null, value: null}];
        this.openScope = 0;
        this.closedScope = 0;
        return;
    },
}

const createItem = function(newCommand, newValue, lastItem) {
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