"use client";
import { ToastContainer } from "react-toastify";
import Register from "@/components/custom/auth/Register";
import Dashboard from "@/components/custom/Dashboard";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useContext } from "react";
import { AppContext } from "@/store/AppContext";
const Home = () => {
  // const { status } = useSession();
  const { authenticated } = useContext(AppContext);
  const isMobile = useMediaQuery("(max-width: 640px)");
  return (
    <div>
      {authenticated ? <Dashboard /> : <Register />}
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
