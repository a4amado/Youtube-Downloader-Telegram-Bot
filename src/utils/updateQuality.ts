import app from "../firebase/init";

export default function UpdateQulity({
  quality,
  user_id,
}: {
  quality: 360 | 720 | 1080 | 1440 | 2160 ;
  user_id: string;
}) {
  
  return new Promise(async (res, rej) => {
    app
    .firestore()
    .collection("USERS")

    .doc(user_id)
    .update({ quality:  Number(quality) })
    .then((e) => res("s"))
    .catch((e) => rej("d"))
    
  })
}
