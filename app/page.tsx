import type { Metadata } from "next";
import { HomeDashboard } from "./components/HomeDashboard";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Start Here",
};

export default function Home() {
  return <HomeDashboard />;
}
