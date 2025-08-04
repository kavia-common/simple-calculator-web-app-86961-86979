import React, { useState, useRef, useEffect } from 'react';
import './Calculator.css';

// PUBLIC_INTERFACE
/**
 * A modern, minimalistic calculator supporting basic arithmetic operations.
 * Features: input validation, keyboard input, responsive layout, and clear/reset.
 */
function Calculator() {
  const [display, setDisplay] = useState('0');
  const [operator, setOperator] = useState(null);
  const [operand, setOperand] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [error, setError] = useState('');
  const displayRef = useRef(null);

  // Keyboard input handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Map keyboard keys to calculator functionality
      if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        e.preventDefault();
        inputDigit(e.key);
      } else if (['+', '-', '*', '/'].includes(e.key)) {
        e.preventDefault();
        inputOperator(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        backspace();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        e.preventDefault();
        clearAll();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line
  }, [display, operator, operand, waitingForOperand]);

  // PUBLIC_INTERFACE
  // Input digit, appends to current display or replaces if waiting for next operand
  function inputDigit(digit) {
    if (error) setError('');
    if (waitingForOperand) {
      setDisplay(digit === '.' ? '0.' : digit);
      setWaitingForOperand(false);
    } else {
      // Prevent multiple decimals
      if (digit === '.' && display.includes('.')) return;
      setDisplay(display === '0' && digit !== '.' ? digit : display + digit);
    }
  }

  // PUBLIC_INTERFACE
  // Input operator, stores operand and operator, prepares for next input
  function inputOperator(nextOperator) {
    if (error) setError('');
    const inputValue = parseFloat(display);
    if (operator && waitingForOperand) {
      setOperator(nextOperator);
      return;
    }
    if (operand == null) {
      setOperand(inputValue);
    } else if (operator) {
      const result = performCalculation(operand, inputValue, operator);
      if (result === undefined) return; // error already set
      setOperand(result);
      setDisplay(result.toString());
    }
    setOperator(nextOperator);
    setWaitingForOperand(true);
  }

  // PUBLIC_INTERFACE
  // Performs the calculation based on the operator and updates state
  function calculate() {
    if (operator == null || waitingForOperand) return;
    const inputValue = parseFloat(display);
    const result = performCalculation(operand, inputValue, operator);
    if (result === undefined) return; // error already set
    setDisplay(result.toString());
    setOperand(null);
    setOperator(null);
    setWaitingForOperand(true);
  }

  function performCalculation(left, right, op) {
    // Input validation
    if (isNaN(left) || isNaN(right)) {
      setError('Invalid input');
      return undefined;
    }
    let result;
    switch (op) {
      case '+': result = left + right; break;
      case '-': result = left - right; break;
      case '*': result = left * right; break;
      case '/':
        if (right === 0) {
          setError('Cannot divide by zero');
          return undefined;
        }
        result = left / right;
        break;
      default:
        setError('Unknown operator');
        return undefined;
    }
    // Limit to 12 digits, remove excess decimals
    const resultStr = Number(result.toPrecision(12)).toString();
    return parseFloat(resultStr);
  }

  // PUBLIC_INTERFACE
  // Clears all state to default values
  function clearAll() {
    setDisplay('0');
    setOperator(null);
    setOperand(null);
    setWaitingForOperand(false);
    setError('');
  }

  // Delete last character (backspace)
  function backspace() {
    if (error) {
      clearAll();
      return;
    }
    if (!waitingForOperand && display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  }

  // Utility: determines if a button should appear highlighted as active
  function isOperatorActive(value) {
    return operator === value && waitingForOperand;
  }

  // Button layout definition
  const buttons = [
    { label: 'C', onClick: clearAll, className: 'action', 'aria-label': 'Clear calculator' },
    { label: '÷', onClick: () => inputOperator('/'), className: isOperatorActive('/') ? 'op active' : 'op', 'aria-label': 'Divide' },
    { label: '×', onClick: () => inputOperator('*'), className: isOperatorActive('*') ? 'op active' : 'op', 'aria-label': 'Multiply' },
    { label: '⌫', onClick: backspace, className: 'action', 'aria-label': 'Backspace' },

    { label: '7', onClick: () => inputDigit('7'), className: 'digit', 'aria-label': 'Seven' },
    { label: '8', onClick: () => inputDigit('8'), className: 'digit', 'aria-label': 'Eight' },
    { label: '9', onClick: () => inputDigit('9'), className: 'digit', 'aria-label': 'Nine' },
    { label: '−', onClick: () => inputOperator('-'), className: isOperatorActive('-') ? 'op active' : 'op', 'aria-label': 'Subtract' },

    { label: '4', onClick: () => inputDigit('4'), className: 'digit', 'aria-label': 'Four' },
    { label: '5', onClick: () => inputDigit('5'), className: 'digit', 'aria-label': 'Five' },
    { label: '6', onClick: () => inputDigit('6'), className: 'digit', 'aria-label': 'Six' },
    { label: '+', onClick: () => inputOperator('+'), className: isOperatorActive('+') ? 'op active' : 'op', 'aria-label': 'Add' },

    { label: '1', onClick: () => inputDigit('1'), className: 'digit', 'aria-label': 'One' },
    { label: '2', onClick: () => inputDigit('2'), className: 'digit', 'aria-label': 'Two' },
    { label: '3', onClick: () => inputDigit('3'), className: 'digit', 'aria-label': 'Three' },
    { label: '=', onClick: calculate, className: 'equals', 'aria-label': 'Equals', large: true },

    { label: '0', onClick: () => inputDigit('0'), className: 'digit zero', 'aria-label': 'Zero' },
    { label: '.', onClick: () => inputDigit('.'), className: 'digit', 'aria-label': 'Decimal point' }
  ];

  // Grid layout for rendering: rows of 4 with 4th row having a large '=' and bottom row with '0', '.'
  return (
    <div className="calc-root" tabIndex={-1}>
      <div className="calc-panel">
        <div className="calc-display" ref={displayRef} aria-live="polite">
          {error ? <span className="calc-error">{error}</span> : display}
        </div>
        <div className="calc-buttons">
          {buttons.map((btn, idx) => {
            // Large equals – make it two-rows tall
            if (btn.large) {
              return (
                <button
                  key={btn.label}
                  className={`calc-btn ${btn.className} tall`}
                  onClick={btn.onClick}
                  aria-label={btn['aria-label']}
                  tabIndex={0}
                >
                  {btn.label}
                </button>
              );
            }
            return (
              <button
                key={btn.label + idx}
                className={`calc-btn ${btn.className || ''}`}
                onClick={btn.onClick}
                aria-label={btn['aria-label']}
                tabIndex={0}
              >
                {btn.label}
              </button>
            );
          })}
        </div>
        <div className="calc-footer">
          <span>Modern Minimal Calculator</span>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
