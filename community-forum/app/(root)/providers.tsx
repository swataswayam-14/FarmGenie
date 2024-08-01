"use client";
import * as React from "react";
import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import "react-toastify/dist/ReactToastify.css";

export const Providers = ({ children }: { children: ReactNode }) => {
  const contextClass = {
    success: "bg-blue-600",
    error: "bg-red-600",
    info: "bg-gray-600",
    warning: "bg-orange-400",
    default: "bg-indigo-600",
    dark: "bg-white-600 font-gray-300",
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
      />
      {children}
    </>
  );
};

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}