import "./globals.css";
import ContextProvider from "@/store/AppContext";
import AuthProvider from "@/store/AuthProvider";

export const metadata = {
  title: "Memoize",
  description: "New memoize app built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
        <ContextProvider>
          <body className="font-poppins antialiased dark">{children}</body>
        </ContextProvider>
      </AuthProvider>
    </html>
  );
}
