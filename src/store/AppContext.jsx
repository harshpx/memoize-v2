"use client";
import { createContext, useEffect, useState } from "react";
import LoaderFullPage from "@/components/custom/LoaderFullPage";
import { deleteCookie, getCookie } from "@/lib/utils";
import { fetchUser } from "@/lib/features";

export const AppContext = createContext({
  dark: true,
  setDark: () => {},
  page: "notes",
  setPage: () => {},
  user: null,
  setUser: () => {},
  authenticated: false,
  setAuthenticated: () => {},
});

const ContextProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [dark, setDark] = useState(true);
  const [page, setPage] = useState("notes");
  const [user, setUser] = useState(null);

  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    if (!getCookie("token")) {
      setAuthenticated(false);
    } else {
      (async () => {
        setWaiting(true);
        try {
          const data = await fetchUser();
          if (data.success) {
            setUser(data.user);
            setAuthenticated(true);
          } else {
            deleteCookie("token");
            setAuthenticated(false);
          }
        } catch (error) {
          deleteCookie("token");
          setAuthenticated(false);
        } finally {
          setWaiting(false);
        }
      })();
    }
  }, []);

  // useEffect(() => {
  //   if (status === "authenticated") {
  //     (async () => {
  //       try {
  //         setWaiting(true);
  //         const response = await fetch("/api/fetch-user-data");
  //         const data = await response.json();
  //         if (data.success) {
  //           setUser(data.user);
  //         } else {
  //           signOut();
  //         }
  //       } catch (error) {
  //         console.error(error);
  //         signOut();
  //       } finally {
  //         setWaiting(false);
  //       }
  //     })();
  //   }
  // }, [status]);

  return (
    <AppContext.Provider
      value={{
        dark,
        setDark,
        page,
        setPage,
        user,
        setUser,
        authenticated,
        setAuthenticated,
      }}
    >
      {waiting && <LoaderFullPage />}
      {children}
    </AppContext.Provider>
  );
};

export default ContextProvider;
