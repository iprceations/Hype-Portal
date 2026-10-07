import type { Metadata } from "next";
import ChatGptInterface from "@/components/ChatGptInterface";

export const metadata: Metadata = {
  title: "HYPE AI & ROAST AI — Full Mode Immersive Lounge & Vision",
  description:
    "Full-screen ChatGPT-style AI chat with real-time ephemeral chat history. Switch between Hype AI problem solving and Roast AI savage roasts with multimodal vision and photo enhancement.",
};

export default function AIPage() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)] flex flex-col transition-colors duration-200">
      {/* Full-Mode Immersive Chat Interface */}
      <main className="h-full w-full overflow-hidden flex flex-col">
        <ChatGptInterface />
      </main>
    </div>
  );
}
