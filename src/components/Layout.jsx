import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Layout() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
