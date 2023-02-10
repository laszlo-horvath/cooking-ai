import { AnimatePresence, motion } from "framer-motion";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import FoodIntoleranceDropdown, { VibeType } from "../components/FoodIntoleranceDropDown";
import DailyMealDropdown, { DailyMeal } from "../components/DailyMealDropDown";
import Footer from "../components/Footer";
import Github from "../components/GitHub";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import ResizablePanel from "../components/ResizablePanel";
import { getPrompt } from "../utils/OpenAIPrompt";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [dailyMeal, setDailyMeal] = useState<DailyMeal>('Breakfast');
  const [vibe, setVibe] = useState<VibeType>("Lactose");
  const [generatedBios, setGeneratedBios] = useState<String>("");

  console.log("Streamed response: ", generatedBios);

  const prompt = getPrompt(dailyMeal, vibe);

  const generateBio = async (e: any) => {
    console.log('--- e', e, prompt);
    e.preventDefault();

    setGeneratedBios("");
    setLoading(true);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });
    console.log('--- response', response);
    console.log("Edge function returned.");

    if (!response.ok) {
      console.error('--- response not ok', response);
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    console.log('--- data?', data);
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedBios((prev) => prev + chunkValue);
    }

    setLoading(false);
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Twitter Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        {/* <a
          className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-md transition-colors hover:bg-gray-100 mb-5"
          href="https://github.com/Nutlope/twitterbio"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github />
          <p>Star on GitHub</p>
        </a> */}
        <h1 className="sm:text-6xl text-4xl max-w-2xl font-bold text-slate-900">
          Find out what to eat<br />in seconds
        </h1>
        <p className="text-slate-500 mt-5">674 foods ideas generated so far.</p>
        <div className="max-w-xl w-full">
          <div className="flex mt-10 mb-5 items-center space-x-3">
            <Image
              src="/1-black.png"
              width={30}
              height={30}
              alt="1 icon"
              className="mb-5 sm:mb-0"
            />
            <p className="text-left font-medium">
              Select your daily meal.
            </p>
          </div>
          <div className="block mb-10">
            <DailyMealDropdown vibe={dailyMeal} setVibe={(newDailyMeal) => setDailyMeal(newDailyMeal)} />
          </div>

          <div className="mb-10">
            <div className="flex mb-5 items-center space-x-3">
              <Image src="/2-black.png" width={30} height={30} alt="2 icon" />
              <p className="text-left font-medium">Select your food intolarence.</p>
            </div>
            <div className="block">
              <FoodIntoleranceDropdown vibe={vibe} setVibe={(newVibe) => setVibe(newVibe)} />
            </div>
          </div>

          {!loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              onClick={(e) => generateBio(e)}
            >
              Get your food ideas &rarr;
            </button>
          )}
          {loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )}
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <ResizablePanel>
          <AnimatePresence mode="wait">
            <motion.div className="space-y-10 my-10">
              {generatedBios && (
                <>
                  <div>
                    <h2 className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto">
                      Your generated food ideas
                    </h2>
                  </div>
                  <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                    {generatedBios
                      // .substring(generatedBios.indexOf("1") + 3)
                      .split("---")
                      .map((generatedBio) => {
                        if (generatedBio.length === 0) return null;

                        return (
                          <div
                            className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                            onClick={() => {
                              navigator.clipboard.writeText(generatedBio);
                              toast("Food idea copied to clipboard", {
                                icon: "✂️",
                              });
                            }}
                            key={generatedBio}
                          >
                            <p>{generatedBio}</p>
                          </div>
                        );
                      })}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
