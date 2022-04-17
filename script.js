'use strict';

function add(a, b) {
  if (!b) b = a;
  return a + b;
};

function subtract(a, b) { 
  if (!b) b = a; 
  return a - b;
};

function multiply(a, b) {
  if (!b) b = a;
  return a * b;
};

function divide(a, b) {
  if (!b) b = a; 
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
const display = document.querySelector('.display');

function insertNumber(event) {
  let operand = display.textContent;
  let input = event.target.value;
  if (!isLastKeyPressOperator && input === '0' && operand === '0') return; //stop when user 1st press 0
  if (!isLastKeyPressOperator && input !== '0' && operand === '0') operand = input; //remove the 0 at the start
  else operand = operand.concat(input);
  if (isLastKeyPressOperator) {
    operand = input;
    calcArray.push(display.currentOperator);
    isLastKeyPressOperator = false;
  } 
  display.currentOperand = operand;
  console.log(calcArray)
  return displayNumber(operand);
};

function displayNumber(string) {
  return display.textContent = string;
};

function updateOperator(event) {
  const operator = event.target.value;
  display.currentOperator = operator;
  if (isLastKeyPressOperator === false) {   
    if (typeof display.currentOperand === 'undefined') display.currentOperand = '0'; //set first operand as 0 when user 1st press is an operator
    calcArray.push(display.currentOperand);
    display.currentOperand = '0'
    if (calcArray.length === 3) {
      let result = parseOperation(calcArray);
      calcArray.splice(0, 3, result);
      display.textContent = result;
    }
    isLastKeyPressOperator = true;
  }
  console.log(calcArray)
};

function parseOperation(array) {
  let firstOperand = parseInt(array[0]);
  let secondOperand = parseInt(array[2]);
  return operate(firstOperand, secondOperand, array[1]);
};