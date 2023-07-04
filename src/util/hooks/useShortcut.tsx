import { useEffect } from "react";

interface ShortcutOptions {
  insensitive?: boolean;
  noButton?: boolean;
}

export default function useShortcut(
  key: string,
  callback: (e: KeyboardEvent) => void,
  options?: ShortcutOptions
) {
  const { insensitive, noButton } = options || {};

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const disabledTags = ["INPUT", "TEXTAREA"];
      if (noButton) disabledTags.push("BUTTON");

      if (disabledTags.includes(document.activeElement?.tagName ?? "")) {
        return;
      }

      const targetKey = insensitive ? key.toLowerCase() : key;
      const eventKey = insensitive ? e.key.toLowerCase() : e.key;

      if (targetKey === eventKey) {
        callback(e);
      }
    };

    document.addEventListener("keydown", handler);

    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, [key, callback, insensitive, noButton]);
}
