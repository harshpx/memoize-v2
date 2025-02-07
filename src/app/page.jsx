"use client";
import { useSession } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import Register from "@/components/custom/auth/Register";
import Dashboard from "@/components/custom/Dashboard";
import LoaderFullPage from "@/components/custom/LoaderFullPage";
import useMediaQuery from "@/hooks/useMediaQuery";
const Home = () => {
  const { status } = useSession();
  const isMobile = useMediaQuery("(max-width: 640px)");
  return (
    <div>
      {status === "loading" ? (
        <LoaderFullPage />
      ) : status === "authenticated" ? (
        <Dashboard />
      ) : (
        <Register />
      )}
      <ToastContainer
        position={isMobile ? "top-left" : "bottom-center"}
        autoClose={2500}
        limit={2}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        draggable
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        theme="dark"
      />
    </div>
  );
};

export default Home;
