'use strict';

function add(a, b) {
  return a + b;
};

function subtract(a, b) {
  return a - b;
};

function multiply(a, b) {
  return a * b;
};

function divide(a, b) {
  if (b === 0) return throwError();
	return a / b;
};

function operate(firstNum, secondNum, operator) {
	if (operator === '+') return add(firstNum, secondNum);
  if (operator === '-') return subtract(firstNum, secondNum);
  if (operator === '*') return multiply(firstNum, secondNum);
  if (operator === '/') return divide(firstNum, secondNum);
};

window.addEventListener('load', powerOnCalculator);

function powerOnCalculator() {
  const numberButtons = document.querySelectorAll('.number');
  numberButtons.forEach(button => button.addEventListener('click', insertNumber));
  const operatorButtons = document.querySelectorAll('.operator');
  operatorButtons.forEach(button => button.addEventListener('click', updateOperator));
};


let calcArray = [];
let isLastKeyPressOperator = false;
let isLastKeyPressEqual = false;
const resultDisplay = document.querySelector('.result-display');
const operationDisplay = document.querySelector('.operation-display');

function insertNumber(event) {
  if (isLastKeyPressEqual) {
    operationDisplay.textContent ='';
    resultDisplay.textContent ='';
    calcArray = [];
    isLastKeyPressEqual = false;
    isLastKeyPressOperator = false;
  }
  let operand = resultDisplay.textContent;
  let input = event.target.value;
  if (!isLastKeyPressOperator && input === '0' && operand === '0') return; //stop when user 1st press 0
  if (!isLastKeyPressOperator && input !== '0' && operand === '0') operand = input; //remove the 0 at the start
  else operand = operand.concat(input);
  if (isLastKeyPressOperator) {
    operand = input;
    calcArray.push(resultDisplay.currentOperator);
    isLastKeyPressOperator = false;
  } 
  resultDisplay.currentOperand = operand;
  console.log(calcArray)
  return displayNumber(operand);
};

function displayNumber(string) {
  return resultDisplay.textContent = string;
};

function updateOperator(event) {
  const operator = event.target.value;
  resultDisplay.currentOperator = operator;
  if (isLastKeyPressEqual) isLastKeyPressEqual = false;
  if (!isLastKeyPressOperator) {
    if (typeof resultDisplay.currentOperand === 'undefined') 
      resultDisplay.currentOperand = '0'; //set first operand as 0 when user 1st press is an operator
    calcArray.push(resultDisplay.currentOperand);
    if (calcArray.length === 3) parseOperation(calcArray);
  }
  operationDisplay.textContent = `${calcArray[0]} ${operator}`;
  isLastKeyPressOperator = true;
  console.log(calcArray)
};

function parseOperation(array) {
  const firstOperand = parseInt(array[0]);
  const secondOperand = parseInt(array[2]);
  const operator = array[1]
  const result = operate(firstOperand, secondOperand, operator);
  calcArray.splice(0, 3, result);
  console.log(calcArray)
  return resultDisplay.textContent = result;
};

const calculateButton = document.querySelector('.calculate');
calculateButton.addEventListener('click', function() {
  if (calcArray.length < 2) return;
  isLastKeyPressEqual = true;
  isLastKeyPressOperator = true;
  calcArray.push(resultDisplay.currentOperand);
  operationDisplay.textContent = `${calcArray[0]} ${calcArray[1]} ${calcArray[2]} =`
  const result = parseOperation(calcArray);
  console.log(calcArray)
  return displayNumber(result);
});

// function throwError() {
//   turn off buttons except number and AC
//   show error can't divide by 0
//   remove old event listeners
//   add new event listener to restart the calculator and run powerOnCalculator function
// }