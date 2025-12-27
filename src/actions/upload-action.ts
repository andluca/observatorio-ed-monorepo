"use server";

import { v2 as cloudinary } from 'cloudinary';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { uploadSchema } from "@/lib/schemas";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Não autorizado" };
  }

  const file = formData.get("file");

  const validation = uploadSchema.safeParse(file);

  if (!validation.success) {
    const errorMessage = validation.error.errors[0]?.message || "Arquivo inválido";
    return { error: errorMessage };
  }

  const validFile = validation.data;

  try {
    const arrayBuffer = await validFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "observatorio_posts" }, 
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return { url: result.secure_url };
  } catch (error) {
    console.error(error);
    return { error: "Erro ao comunicar com serviço de upload" };
  }
}