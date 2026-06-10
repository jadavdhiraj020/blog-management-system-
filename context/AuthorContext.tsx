"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Author } from "@/types/blog";
import { authors } from "@/lib/authors";

interface AuthorContextValue {
  currentAuthor: Author | null;
  setCurrentAuthor: (author: Author | null) => void;
  isLoggedIn: boolean;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const AuthorContext = createContext<AuthorContextValue | undefined>(undefined);

export function AuthorProvider({ children }: { children: ReactNode }) {
  const [currentAuthor, setCurrentAuthorState] = useState<Author | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let storedAuthorId = localStorage.getItem("blog_author_id");
    const storedTheme = localStorage.getItem("blog_theme") as "light" | "dark" | null;

    if (!storedAuthorId) {
      const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith("blog_author="))
        ?.split("=")[1];
      if (cookieValue) {
        storedAuthorId = cookieValue;
        localStorage.setItem("blog_author_id", cookieValue);
      }
    }

    if (storedAuthorId) {
      const found = authors.find((a) => a.id === storedAuthorId);
      if (found) {
        setCurrentAuthorState(found);
        document.cookie = `blog_author=${found.id}; path=/; max-age=31536000; SameSite=Lax`;
      }
    }
    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme, mounted]);

  const setCurrentAuthor = useCallback((author: Author | null) => {
    setCurrentAuthorState(author);
    if (author) {
      localStorage.setItem("blog_author_id", author.id);
      document.cookie = `blog_author=${author.id}; path=/; max-age=31536000; SameSite=Lax`;
    } else {
      localStorage.removeItem("blog_author_id");
      document.cookie = "blog_author=; path=/; max-age=0; SameSite=Lax";
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("blog_theme", next);
      return next;
    });
  }, []);

  return (
    <AuthorContext.Provider
      value={{
        currentAuthor,
        setCurrentAuthor,
        isLoggedIn: currentAuthor !== null,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </AuthorContext.Provider>
  );
}

export function useAuthor(): AuthorContextValue {
  const context = useContext(AuthorContext);
  if (!context) {
    throw new Error("useAuthor must be used within AuthorProvider");
  }
  return context;
}
