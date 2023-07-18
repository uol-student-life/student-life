import { execScript } from "./exec-script";

export async function resetDB() {
  try {
    const { stdout, stderr } = await execScript("npm run migrate:reset:tests");
    console.log(`Reset DB ${stdout}`);
    if (stderr) {
      console.error(`Reset DB error ${stderr}`);
    }
  } catch (error) {
    console.error(`Reset DB error ${error.message}`);
  }
}
