import app from "../firebase/init";

export default async function getUser(id: string) {
  return await app
    .firestore()
    .collection("USERS")
  .doc(id)
  .get()
}
