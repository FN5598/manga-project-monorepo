import { BASE_URL, SIGN_S3_UPLOAD_URL } from "../routes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { FileType } from "../Components/AdminComponents/manga.utils";

type AllowedImageUploadTypes = "image/jpeg" | "image/png" | "image/webp";

type SignBody = {
  fileName: string;
  contentType: string;
  mangaTitle: string;
  mangaChapter: number;
  type: FileType;
  size: number;
  chapters: {
    fileName: string;
    contentType: string;
    type: FileType;
    size: number;
  }[];
};

type SignS3UploadResponse = {
  message: string;
  preview: {
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
  }[];
};

type UploadDataBody = {
  uploadUrl: string;
  previewFileData: File;
};

export const awsApi = createApi({
  reducerPath: "awsApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}api`,
  }),

  endpoints: (builder) => ({
    signS3BucketUploadUrl: builder.mutation<SignS3UploadResponse, SignBody>({
      query: (body) => ({
        url: SIGN_S3_UPLOAD_URL,
        method: "POST",
        body,
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
