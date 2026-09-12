import { type Metadata } from "next";

import { PeriodicTable } from "@/features/periodic-table";

export const metadata: Metadata = {
  title: "元素展览 · The Periodic Table",
  description:
    "走进由 118 种元素组成的玻璃标本展览。放大观察元素，探索它们的性质、发现故事与日常应用。",
};

export default function PeriodicTablePage() {
  return <PeriodicTable />;
}
