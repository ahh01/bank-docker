"use client";
// Denna komponent låter en ny användare skapa ett konto.

import { useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";

export default function NewUser() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter();

 const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !password) {
        alert("Användarnamn och lösenord får inte vara tomma.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Lösenorden matchar inte. Försök igen.");
        return;
    }

    try {
        const response = await fetch(
          "http://ec2-16-170-166-17.eu-north-1.compute.amazonaws.com/users",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
          }
        );

        if (!response.ok) {
            console.error("Registration failed:", response.statusText);
            alert("Registreringen misslyckades. Kontrollera dina uppgifter och försök igen.");
            return;
        }

        alert("Registreringen lyckades! Du kan nu logga in.");
        router.push("/login");
    } catch (error) {
        console.error("Ett fel uppstod:", error);
        alert("Ett oväntat fel uppstod. Försök igen senare.");
    }
};

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Skapa ett konto
          </h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Användarnamn
              </label>
              <input
                id="username"
                type="text"
                placeholder="Användarnamn"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-4 py-2 text-black border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Lösenord
              </label>
              <input
                id="password"
                type="password"
                placeholder="Lösenord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 text-black border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Bekräfta lösenord
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Bekräfta lösenord"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border text-black border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Registrera
            </button>
          </form>
          <button
            onClick={() => router.push("/login")}
            className="w-full mt-4 bg-gray-200 text-black py-2 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Tillbaka till inloggning
          </button>
        </div>
      </div>
    );
}