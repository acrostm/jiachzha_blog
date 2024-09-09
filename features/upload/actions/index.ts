"use server";

import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import imageType, { minimumBytes } from "image-type";
import fs from "node:fs";
import path from "node:path";
import { readChunk } from "read-chunk";
import sharp from "sharp";

import { R2_BUCKET, R2_UPLOAD_DIR } from "@/config";

import { isProduction } from "@/utils/env";

import { ERROR_NO_PERMISSION } from "@/constants";
import { noPermission } from "@/features/user";
import { createCuid } from "@/lib/cuid";
import { s3 } from "@/lib/r2-storage";

const UPLOAD_DIR = "uploads";
const PUBLIC_DIR = "public";

const getFilePath = (input: string) => {
  return path.join(process.cwd(), PUBLIC_DIR, input);
};

const saveFile = async (file: File) => {
  const fileArrayBuffer = await file.arrayBuffer();
  const fileExtension = path.extname(file.name);
  const fileNameWithoutExtension = file.name.replace(fileExtension, "");
  const baseURL = `/${UPLOAD_DIR}/${fileNameWithoutExtension}-${createCuid()}${fileExtension}`;
  const filePath = getFilePath(baseURL);

  fs.writeFileSync(filePath, Buffer.from(fileArrayBuffer));

  return baseURL;
};

const deleteFile = async (input: string) => {
  const filePath = getFilePath(input);

  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (error) => {
      if (error) {
        reject(error.message);
      }
      resolve("");
    });
  });
};

const getImageInfo = async (filePath: string) => {
  const buffer = await readChunk(filePath, { length: minimumBytes });

  const typeInfo = await imageType(buffer);

  return {
    info: typeInfo,
    isImage: Boolean(typeInfo),
    isGif: typeInfo ? typeInfo.ext === "gif" : false,
    isWebp: typeInfo ? typeInfo.ext === "webp" : false,
  };
};

// 如果不是图片，原样返回，是图片返回压缩后的图片路径
const compressImage = async (input: string): Promise<string> => {
  const inputFilePath = getFilePath(input);
  const { isGif, isImage, isWebp } = await getImageInfo(inputFilePath);

  if (!isImage || isWebp) {
    return input;
  }
  let animated = false;
  if (isGif) {
    animated = true;
  }

  const fileName = path.basename(inputFilePath);
  const fileExtension = path.extname(fileName);
  const fileNameWithouExtension = fileName.replace(fileExtension, "");

  const newFileName = `${fileNameWithouExtension}.webp`;
  const output = `/${UPLOAD_DIR}/${newFileName}`;
  const outputFilePath = getFilePath(output);

  return new Promise((resolve, reject) => {
    // 加载图片
    sharp(inputFilePath, { animated, limitInputPixels: false })
      .webp({ lossless: true })
      .toFile(outputFilePath, (error) => {
        if (error) {
          // TODO: 记录日志
          reject(error.message);
        } else {
          resolve(output);
        }
      });
  });
};

const uploadToR2 = async (input: string) => {
  const inputFilePath = getFilePath(input);
  const fileName = path.basename(inputFilePath);
  const buffer = fs.readFileSync(inputFilePath);

  const key = `${R2_UPLOAD_DIR}${fileName}`;

  const uploadParams = {
    Bucket: R2_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: getContentType(fileName),
  };
  try {
    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);

    // Generate a signed URL that's valid for 1 hour (3600 seconds)
    const getObjectParams = { Bucket: R2_BUCKET, Key: key };
    const getCommand = new GetObjectCommand(getObjectParams);
    const signedUrl = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });

    // If R2_PUBLIC_URL is set, use it to construct a public URL
    // if (R2_PUBLIC_URL) {
    //   return `${R2_PUBLIC_URL}/${key}`;
    // }

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
    // throw ERROR_NO_PERMISSION;
    return { error: ERROR_NO_PERMISSION.message };
  }
  // Get file from formData
  const file = formData.get("file") as File;

  let url = await saveFile(file);
  const localFileUrl = url;
  url = await compressImage(url);

  if (isProduction()) {
    const signedUrl = await uploadToR2(url);

    // const signedUrl = "https://r2.zj.cyou/Hannya_shingyo.png";
    // 删除本地的压缩过后的图片文件
    const result = await deleteFile(url);
    if (result) {
      // TODO: 记录日志, 删除文件失败
    }
    return { url: signedUrl };
  }

  // 如果是图片且已经被压缩过
  if (localFileUrl !== url) {
    // 删除旧的图片文件
    const result = await deleteFile(localFileUrl);
    if (result) {
      // TODO: 记录日志, 删除文件失败
    }
  }

  return { url };
};
