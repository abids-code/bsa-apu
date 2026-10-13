import imageCompression from "browser-image-compression";

const CLOUD_NAME = import.meta.env["VITE_CLOUDINARY_CLOUD_NAME"] ?? "h0ie7lrb";
const UPLOAD_PRESET = import.meta.env["VITE_CLOUDINARY_UPLOAD_PRESET"] ?? "bsa-uploads";

type CloudinaryUploadResponse = {
  secure_url?: string;
  error?: { message?: string };
};

export async function uploadImageToCloudinary(file: File, folder: string): Promise<string> {
  const compressedFile = await imageCompression(file, {
    maxSizeMB: 0.2,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  });

  const formData = new FormData();
  formData.append("file", compressedFile);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", `bsa-apu/${folder}`);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });
  const result = (await response.json()) as CloudinaryUploadResponse;

  if (!response.ok || !result.secure_url) {
    throw new Error(result.error?.message ?? "Cloudinary image upload failed.");
  }

  return result.secure_url;
}
