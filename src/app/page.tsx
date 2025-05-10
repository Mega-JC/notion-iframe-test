"use client";

import { useEffect, useState } from "react";

interface WindowDetails {
  innerWidth?: number;
  innerHeight?: number;
  outerWidth?: number;
  outerHeight?: number;
  screenWidth?: number;
  screenHeight?: number;
  devicePixelRatio?: number;
  isSecureContext?: boolean;
  origin?: string;
  userAgent?: string;
  language?: string;
  languages?: readonly string[];
  platform?: string;
  cookieEnabled?: boolean;
}

interface ParentDetails {
  referrer?: string;
  parentOrigin?: string;
  parentLocationHref?: string;
}

export default function Home() {
  const [isIframe, setIsIframe] = useState(false);
  const [windowDetails, setWindowDetails] = useState<WindowDetails>({});
  const [parentDetails, setParentDetails] = useState<ParentDetails>({});
  const [button1Count, setButton1Count] = useState(0);
  const [button2Count, setButton2Count] = useState(0);
  const [button3Count, setButton3Count] = useState(0);
  const [isMouseOverPage, setIsMouseOverPage] = useState(false);

  useEffect(() => {
    // Check if running in an iframe
    const inIframe = window.self !== window.top;
    setIsIframe(inIframe);

    // Get window details
    setWindowDetails({
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      outerWidth: window.outerWidth,
      outerHeight: window.outerHeight,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      devicePixelRatio: window.devicePixelRatio,
      isSecureContext: window.isSecureContext,
      origin: window.origin,
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
    });

    // Get parent window details (if accessible)
    if (inIframe) {
      try {
        // Accessing window.parent.origin can throw a cross-origin error
        // if the parent and child have different origins.
        setParentDetails({
          referrer: document.referrer,
          parentOrigin: window.parent.origin,
          parentLocationHref: window.parent.location.href, // May also be restricted
        });
      } catch (error) {
        console.error("Error accessing parent window details:", error);
        setParentDetails({
          referrer: document.referrer,
          parentOrigin: "Error: Cross-origin restriction",
          parentLocationHref: "Error: Cross-origin restriction",
        });
      }
    } else {
      setParentDetails({
        referrer: document.referrer,
      });
    }

    // Mouse enter/leave detection
    const handleMouseEnter = () => {
      setIsMouseOverPage(true);
    };

    const handleMouseLeave = () => {
      setIsMouseOverPage(false);
    };

    const docElement = document.documentElement;

    docElement.addEventListener("mouseenter", handleMouseEnter);
    docElement.addEventListener("mouseleave", handleMouseLeave);

    // Removed initial check using document.hasFocus()
    // isMouseOverPage will start as false and rely on events.

    return () => {
      docElement.removeEventListener("mouseenter", handleMouseEnter);
      docElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <main className="min-h-screen p-8 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-center dark:text-white">
        Iframe Behavior Tester
      </h1>

      <section className="mb-8 bg-slate-100 dark:bg-slate-800 p-6 rounded-lg shadow">
        <h2 className="text-xl text-black dark:text-white font-semibold mb-4 border-b dark:border-gray-600 pb-2">
          Test Buttons
        </h2>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => setButton1Count((count) => count + 1)}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400"
          >
            Test Button 1: ({button1Count})
          </button>
          <button
            onClick={() => setButton2Count((count) => count + 1)}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400"
          >
            Test Button 2: ({button2Count})
          </button>
          <button
            onClick={() => setButton3Count((count) => count + 1)}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400"
          >
            Test Button 3: ({button3Count})
          </button>
        </div>
      </section>

      <section className="mb-8 bg-slate-100 dark:bg-slate-800 p-6 rounded-lg shadow">
        <h2 className="text-xl text-black dark:text-white font-semibold mb-4 border-b dark:border-gray-600 pb-2">
          Interaction Status
        </h2>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <strong>Mouse over page:</strong>{" "}
          <span
            className={
              isMouseOverPage
                ? "text-blue-600 dark:text-blue-400 font-bold"
                : "text-gray-500 dark:text-gray-400 font-bold"
            }
          >
            {isMouseOverPage ? "Yes" : "No"}
          </span>
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        <section className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg shadow">
          <h2 className="text-xl text-black dark:text-white font-semibold mb-4 border-b dark:border-gray-600 pb-2">
            Current Window Details
          </h2>
          <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
            <strong>Embedded in an iframe:</strong>{" "}
            <span
              className={
                isIframe
                  ? "text-green-600 dark:text-green-400 font-bold"
                  : "text-red-600 dark:text-red-400 font-bold"
              }
            >
              {isIframe ? "Yes" : "No"}
            </span>
          </p>
          <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
            {Object.entries(windowDetails).map(([key, value]) => (
              <li key={key}>
                <strong className="text-gray-900 dark:text-gray-100">
                  {key}:
                </strong>{" "}
                {Array.isArray(value) ? value.join(", ") : String(value)}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg shadow">
          <h2 className="text-xl text-black dark:text-white font-semibold mb-4 border-b dark:border-gray-600 pb-2">
            Parent Context
          </h2>
          <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
            {Object.entries(parentDetails).map(([key, value]) => (
              <li key={key}>
                <strong className="text-gray-900 dark:text-gray-100">
                  {key}:
                </strong>{" "}
                {String(value)}
              </li>
            ))}
          </ul>
          {isIframe && (
            <p className="mt-4 text-xs text-gray-600 dark:text-gray-400">
              Note: Access to parent window properties might be restricted by
              browser security policies (cross-origin).
            </p>
          )}
        </section>
      </div>

      <footer className="mt-12 text-center text-xs text-gray-600 dark:text-gray-400">
        <p>Reload the page to see updated values if window size changes.</p>
        <p>Deployed on Vercel, for testing in Notion.</p>
      </footer>
    </main>
  );
}
