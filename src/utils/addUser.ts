import app from "../firebase/init";

export default function addUser(id: string) {
  return new Promise((res, rej) => {
    app.firestore().collection("USERS").doc(id).create({quality: 720})
    .then(e => {
      res("Welcome")
    })
    .catch(e => {
      rej("Welcome")
    })
  })
}
