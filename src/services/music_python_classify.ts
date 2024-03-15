import express from 'express';
import { exec } from 'child_process';

const runPythonScript = (pythonScriptPath: string, fileName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(`python3 ${pythonScriptPath} ${fileName}`, (error, stdout, stderr) => {
      if (error) {
        reject(`Error executing Python script: ${error.message}`);
        return;
      }

      resolve(stdout);
    });
  });
};

export default runPythonScript;
