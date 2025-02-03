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
      <body className="font-poppins antialiased dark">
        <AuthProvider>
          <ContextProvider>{children}</ContextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
