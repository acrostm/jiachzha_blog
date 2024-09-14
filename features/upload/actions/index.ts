"use server";

import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import imageType from "image-type";
import path from "node:path";
import sharp from "sharp";

import { R2_BUCKET, R2_UPLOAD_DIR } from "@/config";

import { ERROR_NO_PERMISSION } from "@/constants";
import { noPermission } from "@/features/user";
import { createCuid } from "@/lib/cuid";
import { s3 } from "@/lib/r2-storage";

const getImageInfo = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const typeInfo = await imageType(new Uint8Array(buffer));

  return {
    info: typeInfo,
    isImage: Boolean(typeInfo),
    isGif: typeInfo ? typeInfo.ext === "gif" : false,
    isWebp: typeInfo ? typeInfo.ext === "webp" : false,
  };
};

// 如果不是图片，原样返回，是图片返回压缩后的图片路径
const compressImage = async (file: File): Promise<Buffer> => {
  const buffer = await file.arrayBuffer();
  const { isGif, isImage, isWebp } = await getImageInfo(file);

  if (!isImage || isWebp) {
    return Buffer.from(buffer);
  }

  let animated = false;
  if (isGif) {
    animated = true;
  }

  return sharp(Buffer.from(buffer), { animated, limitInputPixels: false })
    .webp({ lossless: true })
    .toBuffer();
};

const uploadToR2 = async (file: File, compressedFile: Buffer) => {
  const key = `${R2_UPLOAD_DIR}${createCuid()}-${file.name}`;

  const uploadParams = {
    Bucket: R2_BUCKET,
    Key: key,
    Body: compressedFile,
    ContentType: getContentType(file.name),
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);

    // Generate a signed URL that's valid for 1 hour (3600 seconds)
    const getObjectParams = { Bucket: R2_BUCKET, Key: key };
    const getCommand = new GetObjectCommand(getObjectParams);
    const signedUrl = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });

    // Otherwise, return the signed URL
    return signedUrl;
  } catch (error) {
    console.error("Error uploading file to R2:", error);
    throw error;
  }
};

const getContentType = (fileName: string): string => {
  const ext = path.extname(fileName).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    default:
      return "application/octet-stream";
  }
};

export const uploadFile = async (
  formData: FormData,
): Promise<{ error?: string; url?: string }> => {
  if (await noPermission()) {
    return { error: ERROR_NO_PERMISSION.message };
  }

  // Get file from formData
  const file = formData.get("file") as File;
  if (!file) {
    return { error: "No file found" };
  }

  const { isImage } = await getImageInfo(file);
  if (!isImage) {
    return { error: "Uploaded file is not an image" };
  }

  const fileSize = file.size;
  const sizeLimit = 1024 * 1024 * 10; // 10MB

  if (fileSize > sizeLimit) {
    return { error: "File size too large" };
  }

  try {
    const compressedFile = await compressImage(file);
    const signedUrl = await uploadToR2(file, compressedFile);
    return { url: signedUrl };
  } catch (error) {
    return { error: "Upload failed" };
  }
};
