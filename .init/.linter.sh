#!/bin/bash
cd /home/kavia/workspace/code-generation/simple-calculator-web-app-86961-86979/calculator_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

