"use client";

import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navigering */}
      <nav className="w-full flex justify-center gap-8 py-4 bg-white shadow">
        <Link href="/" className="text-blue-700 hover:underline">
          Hem
        </Link>
        <Link href="/login" className="text-blue-700 hover:underline">
          Logga in
        </Link>
        <Link href="/newuser" className="text-blue-700 hover:underline">
          Skapa användare
        </Link>
      </nav>

      {/* Hero-section */}
      <main className="flex flex-col items-center justify-center flex-grow px-4 text-center py-20">
        <h1 className="text-5xl font-extrabold mb-6 text-gray-900">
          Välkommen till Din Bank
        </h1>
        <p className="text-lg text-gray-700 max-w-xl mb-10">
          Hantera dina pengar enkelt och säkert med vår moderna bankplattform.
          Skapa ett konto och börja spara eller sätt in pengar redan idag!
        </p>
        <Link href="/newuser">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
            Skapa användare
          </button>
        </Link>
      </main>
    </div>
  );
}
