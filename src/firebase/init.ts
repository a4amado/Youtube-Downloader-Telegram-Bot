import admin, { apps } from "firebase-admin";

// @ts-ignore
import * as serviceAccount from "../../yt-downloader-bot-f6eb7-firebase-adminsdk-dldgi-3d0c1918e1.json";

const app =
  apps[0] ||
  admin.initializeApp({
    // @ts-ignore
    credential: admin.credential.cert(serviceAccount),
  });

export default app;
