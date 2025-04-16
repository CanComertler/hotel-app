import { db } from "firebase.config";
import { collection, getDocs, QueryDocumentSnapshot } from "firebase/firestore";


export const getCollection = async () => {
    const snapshot = await getDocs(collection(db, "hotels"));
    return snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
        id: doc.id,
        ...doc.data(),
    }));
}
