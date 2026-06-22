export const BASE_URL = import.meta.env.VITE_BASE_URL;

// Basic REST requests used throuhgout the app for consistency
export const appUrl = {
  UPLOAD_MANGA_CHAPTER: "manga/upload-chapter",
  SIGN_S3_UPLOAD_URL: "/uploads/sign-url",
  GET_ALL_GENRES: "/api/genres",
  UPDATE_MANGA: "manga/update-manga",
  GET_CURRENT_USER: "/user/me",
  CREATE_CHAPTER: "/api/chapter/create-chapter",
  SIGN_UP: "api/auth/sign-up",
  LOGIN: "api/auth/login",
  LOGOUT: "api/auth/logout",
};
