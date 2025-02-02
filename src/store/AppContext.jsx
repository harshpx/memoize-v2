"use client";
import { createContext, useState } from "react"
export const AppContext = createContext({
    dark: true,
    setDark: () => {},
    page: "notes",
    setPage: () => {},
})

const ContextProvider = ({children}) => {
    const [dark, setDark] = useState(true);
    const [page, setPage] = useState("notes");

    return (
        <AppContext.Provider value={{dark, setDark, page, setPage}}>
            {children}
        </AppContext.Provider>
    );
}

export default ContextProvider;