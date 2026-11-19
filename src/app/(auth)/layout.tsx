"use client";

import Navbar from "@/components/home/Navbar";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      {/* ✅ Navbar শুধু একবার, উপরে */}
      <Navbar />

      {/* Background + animation wrap — form-এর জন্য */}
      <div className="relative flex flex-1 items-center justify-center px-4 py-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--primary),transparent_60%)] opacity-[0.06]"
        />
        <motion.div
          aria-hidden
          animate={{ x: [0, 28, 0], y: [0, -22, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -right-24 size-72 rounded-full bg-primary/10 blur-3xl"
        />
        <motion.div
          aria-hidden
          animate={{ x: [0, -24, 0], y: [0, 26, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-28 -left-20 size-80 rounded-full bg-primary/10 blur-3xl"
        />

        {/* Form-এর animate card */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-lg"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;