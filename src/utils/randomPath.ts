import { randomUUID } from "crypto";
import path from "path";

export default function randomPATH({ ext = ".ytd" }: { ext: string }) {
    return path.join(process.cwd(), randomUUID() + ext);
  }