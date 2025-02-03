"use client";
import { useSession } from "next-auth/react";
import { createContext, useEffect, useState } from "react";
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

  useEffect(() => {
    if (status === "authenticated") {
      (async () => {
        try {
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
        }
      })();
      console.log({ username, avatar, email, password, notes });
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
      {children}
    </AppContext.Provider>
  );
};

export default ContextProvider;
