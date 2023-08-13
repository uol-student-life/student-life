const { exec, ExecException } = require("child_process");

interface Result {
  stdout: string;
  stderr: string;
}

export function execScript(script: string): Promise<Result> {
  return new Promise((resolve, reject) => {
    exec(
      script,
      (error: typeof ExecException | null, stdout: string, stderr: string) => {
        if (error) {
          reject(error);
        } else {
          resolve({ stdout, stderr });
        }
      }
    );
  });
}
