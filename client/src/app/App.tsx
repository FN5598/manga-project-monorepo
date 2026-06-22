import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ToastContainer, Zoom } from "react-toastify";
import InitialAuth from "@app/InitialAuth";
import AdminMiddleware from "@app/AdminPages/AdminMiddleware";

const AuthPage = lazy(() => import("@app/UserPages/AuthPage"));
const DiscoverPage = lazy(() => import("@app/UserPages/DiscoverPage"));
const MangaPage = lazy(() => import("@app/UserPages/MangaPage"));
const CommunityPage = lazy(() => import("@app/UserPages/CommunityPage"));
const BrowsePage = lazy(() => import("@app/UserPages/BrowsePage/BrowsePage"));
const MyLibraryPage = lazy(() => import("@app/UserPages/MyLibraryPage"));
const ChapterPage = lazy(() => import("@app/UserPages/ChapterPage"));
const UploadChapterPage = lazy(
  () => import("@app/AdminPages/UploadChapterPage"),
);
const AnalyticsPage = lazy(() => import("@app/AdminPages/AnalyticsPage"));
const UploadMangaPage = lazy(() => import("@app/AdminPages/UploadMangaPage"));

function App() {
  return (
    <>
      {/* Container for alerts
       * source: https://fkhadra.github.io/react-toastify/introduction/
       */}
      <ToastContainer
        position="top-center"
        autoClose={1000}
        limit={3}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
        transition={Zoom}
      />

      <BrowserRouter>
        <InitialAuth>
          <Suspense>
            <Routes>
              <Route path="discover" element={<DiscoverPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/manga/:mangaId" element={<MangaPage />} />
              <Route
                path="/manga/:mangaId/chapter/:chapterId"
                element={<ChapterPage />}
              />
              <Route path="community" element={<CommunityPage />} />
              <Route path="browse" element={<BrowsePage />} />
              <Route path="my-library" element={<MyLibraryPage />} />
              <Route path="*" element={<Navigate to="/discover" replace />} />

              <Route path="/admin" element={<AdminMiddleware />}>
                <Route
                  path="/admin/upload-manga"
                  element={<UploadMangaPage />}
                />
                <Route path="/admin/analytics" element={<AnalyticsPage />} />
                <Route
                  path="/admin/upload-chapter"
                  element={<UploadChapterPage />}
                />
              </Route>
            </Routes>
          </Suspense>
        </InitialAuth>
      </BrowserRouter>
    </>
  );
}

export default App;
