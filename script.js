'use strict';

function add(a, b) {
  return roundNumber(a + b);
}

function subtract(a, b) {
  return roundNumber(a - b);
}

function multiply(a, b) {
  return roundNumber(a * b);
}

function divide(a, b) {
  return roundNumber(a / b);
}

function roundNumber(num) {
  const numString = num.toString();
  if (numString.length > 12) {
    if (numString.includes('.')) return num.toFixed(12);
    return Math.round(num);
  }
  return num;
}

function operate(firstNum, secondNum, operator) {
  if (operator === '+') return add(firstNum, secondNum);
  if (operator === '-') return subtract(firstNum, secondNum);
  if (operator === '*') return multiply(firstNum, secondNum);
  if (operator === '÷') return divide(firstNum, secondNum);
}

function calculate() {
  if (CALC_ARRAY.length < 2 || lastKeyOperator) return;
  
  lastKeyEqual = true;
  lastKeyOperator = true;
  
  CALC_ARRAY.push(resultDisplay.currentOperand);
  operationDisplay.textContent = `${CALC_ARRAY[0]} ${CALC_ARRAY[1]} ${CALC_ARRAY[2]} =`;
  if (checkDivisionByZero()) return error();
  const result = parseOperation(CALC_ARRAY);
  return displayResult(result);
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

function clearState() {
  const operatorButtons = document.querySelectorAll('.operator');
  const delButton = document.querySelector('.del');
  operatorButtons.forEach(button => button.disabled = false);
  delButton.disabled = false;
  operationDisplay.textContent = '';
  resultDisplay.textContent = '0';
  resultDisplay.currentOperand = '';
  CALC_ARRAY = [];
  lastKeyEqual = false;
  lastKeyOperator = false;
}

function deleteNumber() {
  let slicedString = resultDisplay.textContent.slice(0, -1);
  resultDisplay.currentOperand = slicedString;
  return displayResult(slicedString);
}

function checkIfInputHavePeriod(string) {
  if (string.includes('.')) return true;
  return false;
}

function powerOnCalculator() {
  const numberButtons = document.querySelectorAll('.number');
  const operatorButtons = document.querySelectorAll('.operator');
  const equalButton = document.querySelector('.calculate');
  const clearButton = document.querySelector('.reset');
  const delButton = document.querySelector('.del');
  const currentYear = new Date().getFullYear();
  
  equalButton.removeEventListener('click', ERROR_HANDLER);
  numberButtons.forEach(button => button.removeEventListener('click', ERROR_HANDLER));

  numberButtons.forEach(button => button.addEventListener('click', insertNumber));
  operatorButtons.forEach(button => button.addEventListener('click', updateOperator));
  document.addEventListener('keydown', inputByKeyboard);
  equalButton.addEventListener('click', calculate);
  clearButton.addEventListener('click', clearState);
  periodButton.addEventListener('click', insertNumber);
  delButton.addEventListener('click', deleteNumber);
  document.querySelector('.copyright').textContent += 
    `Copyright © ${currentYear} WingHaa`;
}

function inputByKeyboard(event) {
  const key = document.querySelector(`button[data-key='${event.keyCode}']`);
  if (!key) return;
  const buttonType = key.className;
  if (buttonType === 'number' || buttonType === 'dot') return insertNumber(key);
  if (buttonType === 'operator') return updateOperator(key);
  if (buttonType === 'reset') return clearState();
  if (buttonType === 'del') return deleteNumber();
  if (buttonType === 'calculate') return calculate();
}

function insertNumber(event) {
  if (lastKeyEqual) clearState();

  //!after check equal key to make sure no value is set after number press
  let operand = resultDisplay.textContent;
  const input = (event.value || event.target.value);
  
  if (!lastKeyOperator) {
    //*stop when user 1st press 0 //remove the 0 at the start
    if (input === '0' && operand === '0') return; 
    if (input !== '0' && input !== '.' && operand === '0') operand = input;
    else operand = operand.concat(input);
  };

  //*let user input fresh number after an operator
  if (lastKeyOperator) {
    if (input === '.') operand = '0.';
    else operand = input;
    CALC_ARRAY.push(resultDisplay.currentOperator);
    lastKeyOperator = false;
  };
  
  if (operand.length > 12) return;

  //!after key press check so there won't be any weird input
  if(checkIfInputHavePeriod(resultDisplay.textContent) && input === '.') return;

  resultDisplay.currentOperand = operand;
  return displayResult(operand);
}

function updateOperator(event) {
  const operator = (event.value || event.target.value);
  resultDisplay.currentOperator = operator;

  if (lastKeyEqual) lastKeyEqual = false;
  if (!lastKeyOperator) {
    if (typeof resultDisplay.currentOperand === 'undefined' ||
      resultDisplay.currentOperand === '') resultDisplay.currentOperand = '0'; //set first operand as 0 when user 1st press is an operator
    
    CALC_ARRAY.push(resultDisplay.currentOperand);
    if (CALC_ARRAY.length === 3) {
      if (checkDivisionByZero()) return error();
      parseOperation(CALC_ARRAY);
    } 
  };

  lastKeyOperator = true;
  operationDisplay.textContent = `${CALC_ARRAY[0]} ${operator}`;
}

function checkDivisionByZero() {
  if (CALC_ARRAY[1] === '÷' && CALC_ARRAY[2] === '0') return true;
}

function error() {
  //   turn off buttons except number and AC
  const numberButtons = document.querySelectorAll('.number');
  const operatorButtons = document.querySelectorAll('.operator');
  const equalButton = document.querySelector('.calculate');
  const delButton = document.querySelector('.del');
  operatorButtons.forEach(button => button.disabled = true);
  delButton.disabled = true;
  //   show error can't divide by 0
  displayResult(`Can't ÷ by 0!`);
  //   remove old event listeners
  equalButton.removeEventListener('click', calculate);
  numberButtons.forEach(button => button.removeEventListener('click', insertNumber));
  //   add new event listener to restart the calculator and run powerOnCalculator function
  equalButton.addEventListener('click', ERROR_HANDLER);
  numberButtons.forEach(button => button.addEventListener('click', ERROR_HANDLER));
}

window.addEventListener('load', powerOnCalculator);

let CALC_ARRAY = [];
let lastKeyOperator = false;
let lastKeyEqual = false;
const resultDisplay = document.querySelector('.result-display');
const operationDisplay = document.querySelector('.operation-display');
const periodButton = document.querySelector('.dot');

const ERROR_HANDLER = () => {
  clearState();
  powerOnCalculator();
}