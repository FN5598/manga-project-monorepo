import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@api/baseQueryWithReauth";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth", "User", "Admin"],
  endpoints: () => ({}),
});
