import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./config";
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads a receipt image to Firebase Storage.
 * @param file The image file to upload.
 * @param userId The ID of the user uploading the file.
 * @param expenseId The ID of the expense this receipt is associated with.
 * @returns A promise that resolves with the download URL and the storage path of the uploaded file.
 */
export async function uploadReceipt(file: File, userId: string, expenseId: string): Promise<{ downloadURL: string, storagePath: string }> {
  if (!storage) {
    throw new Error("Firebase Storage is not initialized.");
  }
  
  const fileExtension = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`;
  const storagePath = `expense-receipts/${userId}/${expenseId}/${fileName}`;
  const storageRef = ref(storage, storagePath);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return { downloadURL, storagePath };
  } catch (error) {
    console.error("Error uploading receipt:", error);
    throw new Error("Failed to upload receipt image.");
  }
}

/**
 * Uploads a savings screenshot to Firebase Storage.
 * @param file The image file to upload.
 * @param userId The ID of the user uploading the file.
 * @param savingsRecordId The ID of the savings record this screenshot is associated with.
 * @returns A promise that resolves with the download URL and the storage path of the uploaded file.
 */
export async function uploadScreenshot(file: File, userId: string, savingsRecordId: string): Promise<{ downloadURL: string, storagePath: string }> {
  if (!storage) {
    throw new Error("Firebase Storage is not initialized.");
  }
  
  const fileExtension = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`;
  const storagePath = `savings-screenshots/${userId}/${savingsRecordId}/${fileName}`;
  const storageRef = ref(storage, storagePath);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return { downloadURL, storagePath };
  } catch (error) {
    console.error("Error uploading screenshot:", error);
    throw new Error("Failed to upload screenshot image.");
  }
}

/**
 * Deletes a file from Firebase Storage.
 * @param path The full path to the file in Firebase Storage.
 */
export async function deleteFileFromStorage(path: string) {
    if (!storage) {
        console.warn("Firebase Storage is not initialized. Skipping file deletion.");
        return;
    }
    if (!path) {
        console.warn("No storage path provided. Skipping file deletion.");
        return;
    }

    const storageRef = ref(storage, path);
    try {
        await deleteObject(storageRef);
    } catch (error: any) {
        // It's okay if the file doesn't exist, we can ignore that error.
        if (error.code !== 'storage/object-not-found') {
            console.error("Error deleting file from storage:", error);
            // Optionally, re-throw if you want to handle other errors specifically
            // throw new Error("Failed to delete file from storage.");
        }
    }
}
