import imageCompression from "browser-image-compression";

import { supabase } from "./supabase";

export async function uploadOptimizedImage(
  file: File,
  bucketName: string,
  folderPath: string,
): Promise<string> {
  try {
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    });

    const extension = file.name.includes(".")
      ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase()
      : ".jpg";
    const storagePath = `${folderPath.replace(/\/+$/, "")}/${Date.now()}${extension}`;

    if (!supabase) {
      throw new Error("Supabase is not configured.");
    }

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(storagePath, compressedFile, {
        contentType: compressedFile.type || "image/jpeg",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucketName).getPublicUrl(storagePath);
    if (!data.publicUrl) throw new Error("Supabase did not return a public image URL.");

    return data.publicUrl;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Image upload failed.");
  }
}
