import { exec } from "child_process";


export default function clean(items: Array<string>) {
    exec(`rm -rf ${items.join("s")}`);
  }