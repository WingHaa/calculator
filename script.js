'use strict';

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) return throwError();
	return a / b;
}

function operate(firstNum, secondNum, operator) {
	if (operator === '+') return add(firstNum, secondNum);
  if (operator === '-') return subtract(firstNum, secondNum);
  if (operator === '*') return multiply(firstNum, secondNum);
  if (operator === '÷') return divide(firstNum, secondNum);
}

function displayResult(string) {
  return resultDisplay.textContent = string;
}

function displayOperation(string) {
  return operationDisplay.textContent = string;
}

function parseOperation(array) {
  const firstOperand = parseFloat(array[0]);
  const secondOperand = parseFloat(array[2]);
  const operator = array[1]
  const result = operate(firstOperand, secondOperand, operator);
  CALC_ARRAY.splice(0, 3, result);
  return displayResult(result);
}

window.addEventListener('load', powerOnCalculator);

function powerOnCalculator() {
  const numberButtons = document.querySelectorAll('.number');
  numberButtons.forEach(button => button.addEventListener('click', insertNumber));

  const operatorButtons = document.querySelectorAll('.operator');
  operatorButtons.forEach(button => button.addEventListener('click', updateOperator));
  
  const calculateButton = document.querySelector('.calculate');
  calculateButton.addEventListener('click', calculate);
  
  const clearButton = document.querySelector('.reset');
  clearButton.addEventListener('click', clearState);

  periodButton.addEventListener('click', insertNumber);
}

function clearState() {
  operationDisplay.textContent ='';
  resultDisplay.textContent ='0';
  resultDisplay.currentOperand = '';
  periodButton.disabled = false;
  CALC_ARRAY = [];
  isLastKeyPressEqual = false;
  isLastKeyPressOperator = false;
}

let CALC_ARRAY = [];
let isLastKeyPressOperator = false;
let isLastKeyPressEqual = false;
const resultDisplay = document.querySelector('.result-display');
const operationDisplay = document.querySelector('.operation-display');
const periodButton = document.querySelector('.dot');

function insertNumber(event) {
  if (isLastKeyPressEqual) clearState();
  
  let operand = resultDisplay.textContent; //declare after check equal key to make sure no value is set after number press
  let input = event.target.value;
  
  if (!isLastKeyPressOperator && input === '0' && operand === '0') return; //stop when user 1st press 0
  if (!isLastKeyPressOperator && input !== '.' && input !== '0' && operand === '0') operand = input; //remove the 0 at the start
  else operand = operand.concat(input);
  
  if (isLastKeyPressOperator) {//let user input fresh number after an operator
    if (input === '.') operand = '0.';
    else operand = input;
    CALC_ARRAY.push(resultDisplay.currentOperator);
    isLastKeyPressOperator = false;
  };

  if (operand.includes('.')) periodButton.disabled = true;
  else periodButton.disabled = false;

  resultDisplay.currentOperand = operand;
  return displayResult(operand);
}

function updateOperator(event) {
  const operator = event.target.value;
  resultDisplay.currentOperator = operator;

  if (isLastKeyPressEqual) isLastKeyPressEqual = false;
  if (!isLastKeyPressOperator) {
    if (typeof resultDisplay.currentOperand === 'undefined' ||
      resultDisplay.currentOperand === '') resultDisplay.currentOperand = '0'; //set first operand as 0 when user 1st press is an operator
    
    CALC_ARRAY.push(resultDisplay.currentOperand);
    if (CALC_ARRAY.length === 3) parseOperation(CALC_ARRAY);
  };

  isLastKeyPressOperator = true;
  operationDisplay.textContent = `${CALC_ARRAY[0]} ${operator}`;

  if (periodButton.disabled = true) periodButton.disabled = false;
}

function calculate() {
  if (CALC_ARRAY.length < 2 || isLastKeyPressOperator) return;
  if (periodButton.disabled = true) periodButton.disabled = false;
  
  isLastKeyPressEqual = true;
  isLastKeyPressOperator = true;

  CALC_ARRAY.push(resultDisplay.currentOperand);
  operationDisplay.textContent = `${CALC_ARRAY[0]} ${CALC_ARRAY[1]} ${CALC_ARRAY[2]} =`
  const result = parseOperation(CALC_ARRAY);
  return displayResult(result);
}
// function throwError() {
//   turn off buttons except number and AC
//   show error can't divide by 0
//   remove old event listeners
//   add new event listener to restart the calculator and run powerOnCalculator function
// }