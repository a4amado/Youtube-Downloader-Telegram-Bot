import app from "../firebase/init";


export default async function addUser(id: string) {
    return await app.firestore().collection("USERS").add({
        id: id,
        joind: new Date(),
        quality: 720,
      });
}