import { S3Client } from "@aws-sdk/client-s3";

import {
  NODE_ENV,
  R2_ACCESS_KEY_ID,
  R2_BUCKET_REGION,
  R2_ENDPOINT,
  R2_SECRET_ACCESS_KEY,
} from "@/config";

const globalForS3 = global as unknown as { s3Client: S3Client | undefined };

export const s3 =
  globalForS3.s3Client ??
  new S3Client({
    region: R2_BUCKET_REGION ?? "auto", // Cloudflare R2 uses 'auto' as the region
    endpoint: R2_ENDPOINT ?? "",
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID ?? "",
      secretAccessKey: R2_SECRET_ACCESS_KEY ?? "",
    },
    forcePathStyle: true,
  });

if (NODE_ENV !== "production") globalForS3.s3Client = s3;
