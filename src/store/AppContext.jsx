"use client";
import { useSession } from "next-auth/react";
import { createContext, useEffect, useState } from "react";
import LoaderFullPage from "@/components/custom/LoaderFullPage";
export const AppContext = createContext({
  dark: true,
  setDark: () => {},
  page: "notes",
  setPage: () => {},
  user: null,
  setUser: () => {},
});

const ContextProvider = ({ children }) => {
  const { status } = useSession();
  const [dark, setDark] = useState(true);
  const [page, setPage] = useState("notes");
  const [user, setUser] = useState(null);

  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      (async () => {
        try {
          setWaiting(true);
          const response = await fetch("/api/fetch-user-data");
          const data = await response.json();
          if (data.success) {
            setUser(data.user);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setWaiting(false);
        }
      })();
    }
  }, [status]);

  return (
    <AppContext.Provider
      value={{
        dark,
        setDark,
        page,
        setPage,
        user,
        setUser,
      }}
    >
      {waiting && <LoaderFullPage />}
      {children}
    </AppContext.Provider>
  );
};

export default ContextProvider;
