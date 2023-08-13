import { execScript } from "./exec-script";

interface Result {
  stdout: string;
  stderr: string;
}

export async function resetDB() {
  try {
    const result = (await execScript("npm run migrate:reset:tests")) as Result;
    const { stdout, stderr } = result;
    console.log(`Reset DB ${stdout}`);
    if (stderr) {
      console.error(`Reset DB error ${stderr}`);
    }
  } catch (error: any) {
    console.error(`Reset DB error ${error.message}`);
  }
}
