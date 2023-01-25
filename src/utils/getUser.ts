import app from "../firebase/init";
import { DocumentReference } from "@google-cloud/firestore";

const getUser = async (id: string) => {
  try {
    const user = await app.firestore().collection("USERS").doc(id).get();
    if (user.exists) return user;
    return false;
  } catch (error) {
    return false;
  }
};

export default getUser;
