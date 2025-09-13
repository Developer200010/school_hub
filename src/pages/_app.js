// pages/_app.js
import { AuthProvider } from "@/context/AuthContext";
import "../app/globals.css"; // keep if you’re importing global styles here

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
