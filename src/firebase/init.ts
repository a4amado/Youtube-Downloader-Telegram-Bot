import admin, { apps } from "firebase-admin";

import * as serviceAccount from "./yt-downloader-bot-f6eb7-firebase-adminsdk-dldgi-ee7993ed5e.json";

const app =
  apps[0] ||
  admin.initializeApp({
    // @ts-ignore
    credential: admin.credential.cert(serviceAccount),
  });

export default app;
