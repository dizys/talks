import * as ChildProcess from 'child_process';

export interface ProcessResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export class ProcessError extends Error {
  constructor(message: string, public out: ProcessResult) {
    super(message);
  }
}

export function $(
  pieces: TemplateStringsArray,
  ...args: (string | number | boolean)[]
): Promise<ProcessResult> {
  let newPieces = [...pieces].reverse();
  let newArgs = [...args].reverse();

  let nowPiece = newPieces.pop();
  let nowArg = newArgs.pop();

  let command = '';

  while (newPieces.length > 0 || newArgs.length > 0) {
    command += nowPiece + nowArg;
    if (newPieces.length > 0) {
      nowPiece = newPieces.pop();
    }
    if (newArgs.length > 0) {
      nowArg = newArgs.pop();
    }
  }

  console.info(`$ ${command}`);

  return new Promise((resolve, reject) => {
    let childProcess = ChildProcess.exec(
      command,
      {env: {...process.env, FORCE_COLOR: '1'}},
      (error, stdout, stderr) => {
        let result: ProcessResult = {
          stdout,
          stderr,
          exitCode: childProcess.exitCode,
        };
        if (error) {
          reject(new ProcessError(error.message, result));
          return;
        }
        resolve(result);
      },
    );

    childProcess.stdout.pipe(process.stdout);
    childProcess.stderr.pipe(process.stderr);
  });
}
