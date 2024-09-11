import UserInput from "@/components/input-output/UserInput";
import Output from "@/components/input-output/UserOutput";
import { BioProvider } from "@/context/BioContext";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Bio Generator | Craft Your Perfect Bio",
  description:
    "Harness the power of AI to create a bio that captures your essenence in seconds",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
            Your Bio, Perfectly Crafted by AI.
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {/* Harness the power of AI to create a bio that captures your essence
            in seconds. */}
            Just answer a few simple questions, and let AI do the rest.
          </p>
        </div>

        <BioProvider>
          <div className="grid lg:grid-cols-2 gap-8">
            <UserInput />
            <Output />
          </div>
        </BioProvider>
      </div>
      <div className="mt-16 bg-gradient-to-br from-blue-100 to-gray-200 text-center p-10">
        <Link
          href="https://tarin-agarwal.web.app"
          target="_blank"
          className="inline-flex items-center font-bold text-xl text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          Made By Tarin Agarwal
        </Link>
      </div>
    </main>
  );
}
