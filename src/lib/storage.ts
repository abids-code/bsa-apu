import { uploadImageToCloudinary } from "./cloudinary";

export async function uploadOptimizedImage(
  file: File,
  _bucketName: string,
  folderPath: string,
): Promise<string> {
  return uploadImageToCloudinary(file, folderPath);
}
