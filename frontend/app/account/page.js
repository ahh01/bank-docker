"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";

 const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  console.log("BASE_URL:", BASE_URL);

export default function Account() {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  // Hämta användarens saldo från backend
  useEffect(() => {
    const fetchBalance = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        alert("Du måste logga in för att se denna sida.");
        router.push("/login");
        return;
      }
      setToken(storedToken);

      try {
        const response = await fetch(`${BASE_URL}/me/accounts`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: storedToken }),
          }
        );

        if (!response.ok) {
          throw new Error("Kunde inte hämta saldo.");
        }

        const data = await response.json();
        setBalance(data.amount); // backend returnerar {amount: ...}
      } catch (err) {
        console.error(err.message);
        setError("Ett fel uppstod vid hämtning av saldo. Försök igen senare.");
      }
    };

    fetchBalance();
  }, [router]);

  // Hantera insättning av pengar
  const handleDeposit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError("Ange ett giltigt belopp större än 0.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/me/accounts/transactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
            amount: parseFloat(amount),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Insättning misslyckades.");
      }

      const data = await response.json();
      setBalance(data.amount); // backend returnerar {amount: ...}
      setSuccess("Insättningen lyckades!");
      setAmount("");
    } catch (err) {
      console.error(err.message);
      setError("Ett fel uppstod vid insättningen. Försök igen.");
    }
  };

  // Hantera utloggning
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

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
      <div className="flex items-center justify-center flex-grow">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Välkommen till ditt konto
          </h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {success && (
            <p className="text-green-600 text-center mb-4">{success}</p>
          )}
          <p className="text-lg text-gray-700 mb-4">
            Ditt saldo: <span className="font-bold">{balance} SEK</span>
          </p>
          <form onSubmit={handleDeposit} className="space-y-4">
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700"
              >
                Belopp att sätta in
              </label>
              <input
                id="amount"
                type="number"
                placeholder="Ange belopp"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 block w-full px-4 py-2 text-black border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                min="1"
                step="1"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sätt in pengar
            </button>
          </form>
          <button
            onClick={handleLogout}
            className="w-full mt-4 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Logga ut
          </button>
        </div>
      </div>
    </div>
  );
}
