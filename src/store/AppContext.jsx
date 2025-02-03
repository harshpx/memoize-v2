"use client";
import { useSession } from "next-auth/react";
import { createContext, useEffect, useState } from "react";
import LoaderFullPage from "@/components/custom/LoaderFullPage";
export const AppContext = createContext({
  dark: true,
  setDark: () => {},
  page: "notes",
  setPage: () => {},
  username: "",
  setUsername: () => {},
  avatar: "",
  setAvatar: () => {},
  email: "",
  setEmail: () => {},
  password: "",
  setPassword: () => {},
  notes: [],
  setNotes: () => {},
});

const ContextProvider = ({ children }) => {
  const { status } = useSession();
  const [dark, setDark] = useState(true);
  const [page, setPage] = useState("notes");

  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notes, setNotes] = useState([]);

  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      (async () => {
        try {
          setWaiting(true);
          const response = await fetch("/api/fetch-user-data");
          const data = await response.json();
          if (data.success) {
            setUsername(data.user.username);
            setAvatar(data.user.avatar);
            setEmail(data.user.email);
            setPassword(data.user.password);
            setNotes(data.user.notes);
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
        username,
        setUsername,
        avatar,
        setAvatar,
        email,
        setEmail,
        password,
        setPassword,
        notes,
        setNotes,
      }}
    >
      {waiting && <LoaderFullPage />}
      {children}
    </AppContext.Provider>
  );
};

export default ContextProvider;
