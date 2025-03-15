import Appbar from "@/components/blocks/Appbar";
import { SessionProvider } from "next-auth/react";

export default function Home() {
  return (
    <main>
      <Appbar />
    </main>
  );
}