import { appUrl } from "@api/routes";
import { FileType } from "@appTypes/Manga";
import { apiSlice } from "@api/apiSlice";
import type { AllowedImageUploadTypes } from "@appTypes/index";

export type SignBody = {
  mode: "manga" | "chapter";
  body: {
    mangaId: string;
    fileName?: string; // optional for chapter creation
    contentType?: string; // optional for chapter creation
    mangaChapter: number;
    type?: FileType; // optional for chapter creation
    size?: number; // optional for chapter creation
    chapters: {
      fileName: string;
      contentType: string;
      type: FileType;
      size: number;
    }[];
  };
};

export type SignS3UploadResponse = {
  message: string;
  preview?: {
    fileName: string;
    key: string;
    uploadUrl: string;
    contentType: AllowedImageUploadTypes;
  };
  chapters: {
    fileName: string;
    key: string;
    uploadUrl: string;
    contentType: AllowedImageUploadTypes;
    size: number;
  }[];
};

type UploadDataBody = {
  uploadUrl: string;
  previewFileData: File;
};

export const awsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signS3BucketUploadUrl: builder.mutation<SignS3UploadResponse, SignBody>({
      query: (payload) => ({
        url: appUrl.SIGN_S3_UPLOAD_URL,
        method: "POST",
        body: payload.body,
        params: payload.mode === "manga" ? { manga: true } : { chapter: true },
      }),
    }),
    uploadDataToS3: builder.mutation<unknown, UploadDataBody>({
      query: (body) => ({
        url: body.uploadUrl,
        method: "PUT",
        body: body.previewFileData,
        contentType: body.previewFileData.type,
      }),
    }),
  }),
});

export const { useSignS3BucketUploadUrlMutation, useUploadDataToS3Mutation } =
  awsApi;
