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
  }, []);

  return (
    <main className="min-h-screen p-8 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-center dark:text-white">
        Iframe Behavior Tester
      </h1>

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
