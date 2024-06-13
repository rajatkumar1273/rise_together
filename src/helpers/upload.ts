import { firebaseApp } from "@/firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadImagesToFirebase = async (files: any[]) => {
  try {
    const storage = getStorage(firebaseApp);

    const uploadImagesResponses = await Promise.all(
      files.map((file) => {
        return uploadBytes(ref(storage, `images/${file.name}`), file);
      })
    );

    const downloadUrls = await Promise.all(
      uploadImagesResponses.map((snapshot) => {
        return getDownloadURL(snapshot.ref);
      })
    );

    return downloadUrls;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
