import app from "../firebase/init";


export default async function UpdateQulity({
    quality,
    user_id,
}: {
    quality: 1080 | 720 | 360;
    user_id: string;
}) {
    return await app
        .firestore()
        .collection("USERS")
        .doc(user_id)
        .update({ quality });
}