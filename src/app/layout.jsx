import "./globals.css";
import ContextProvider from "@/store/AppContext";

export const metadata = {
  title: "Memoize",
  description: "New memoize app built with Next.js",
  icons: {
    icon: "/memoize.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-poppins antialiased dark">
        <ContextProvider>{children}</ContextProvider>
      </body>
    </html>
  );
}
