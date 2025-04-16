import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase.config";
import { hotels } from "./hotels";

export const uploadMockData = async () => {
  const collectionRef = collection(db, "hotels");
  try {
    for (const hotel of hotels) {
      const docRef = doc(collectionRef, hotel.id.toString());
      await setDoc(docRef, hotel);
    }
    console.log("Mock data uploaded successfully.");
  } catch (error) {
    console.error("Error uploading mock data: ", error);
  }
}