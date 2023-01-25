import app from "../firebase/init";

interface UpdateQualityType {
  quality: 360 | 720 | 1080 | 1440 | 2160;
  user_id: string;
}

const UpdateQulity = async ({ quality, user_id }: UpdateQualityType) => {
  try {
    await app
      .firestore()
      .collection("USERS")
      .doc(user_id)
      .update({ quality: Number(quality) });

    return true;
  } catch (error) {
    return false;
  }
};

export default UpdateQulity;
