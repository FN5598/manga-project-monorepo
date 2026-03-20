import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ToastContainer, Zoom } from "react-toastify";

const Login = lazy(() => import("./Pages/LoginPage"));
const Home = lazy(() => import("./Pages/HomePage"));
const MangaPage = lazy(() => import("./Pages/MangaPage"));
const AdminPage = lazy(() => import("./Pages/AdminPage"));
const CommunityPage = lazy(() => import("./Pages/CommunityPage"));
const BrowsePage = lazy(() => import("./Pages/BrowsePage"));
const MyLibraryPage = lazy(() => import("./Pages/MyLibraryPage"));

// TODO testing
const TestPage = lazy(() => import("./Pages/TestPage"));

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
        <Suspense>
          <Routes>
            <Route path="discover" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/manga/:id" element={<MangaPage />} />
            <Route path="/admin/:id" element={<AdminPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="community" element={<CommunityPage />} />
            <Route path="browse" element={<BrowsePage />} />
            <Route path="my-library" element={<MyLibraryPage />} />
            <Route path="*" element={<Navigate to="/discover" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
