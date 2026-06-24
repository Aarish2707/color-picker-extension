import { useState, useEffect, useCallback, useRef } from "react";
import { useColorFormat } from "./useColorFormat";

type ColorFormat = "hex" | "rgb" | "hsl";

interface UseColorPickerReturn {
  pickedColor: string | null;
  isPickingActive: boolean;
  copied: boolean;
  copiedValue: string | null;
  startColorPicking: (format: ColorFormat) => void;
  copyColor: (format: ColorFormat) => Promise<boolean>;
}

interface EyeDropperResult {
  sRGBHex: string;
}

interface EyeDropperConstructor {
  new (): {
    open: () => Promise<EyeDropperResult>;
  };
}

export const useColorPicker = (): UseColorPickerReturn => {
  const [pickedColor, setPickedColor] = useState<string | null>(null);
  const [isPickingActive, setIsPickingActive] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { formatColor } = useColorFormat();

  const flashCopied = useCallback((value: string) => {
    if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    setCopied(true);
    setCopiedValue(value);
    copiedTimerRef.current = setTimeout(() => {
      setCopied(false);
      setCopiedValue(null);
    }, 2000);
  }, []);

  useEffect(() => {
    chrome.storage.session.get("lastPick", (data: { lastPick?: { hex: string } }) => {
      if (data.lastPick?.hex) {
        setPickedColor(data.lastPick.hex);
      }
    });
  }, []);

  const writeToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      el.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
  }, []);

  const startColorPicking = useCallback((format: ColorFormat) => {
    const EyeDropper = (window as unknown as Record<string, unknown>).EyeDropper as
      | EyeDropperConstructor
      | undefined;

    if (!EyeDropper) return;

    setIsPickingActive(true);
    const dropper = new EyeDropper();
    dropper
      .open()
      .then((result) => {
        const hex = result.sRGBHex.toUpperCase();
        setPickedColor(hex);
        chrome.storage.session.set({ lastPick: { hex, at: Date.now() } });
        const formatted = formatColor(hex, format);
        writeToClipboard(formatted).then(() => flashCopied(formatted));
      })
      .catch(() => {})
      .finally(() => setIsPickingActive(false));
  }, [writeToClipboard, formatColor, flashCopied]);

  const copyColor = useCallback(
    async (format: ColorFormat): Promise<boolean> => {
      if (!pickedColor) return false;
      try {
        const formatted = formatColor(pickedColor, format);
        await writeToClipboard(formatted);
        flashCopied(formatted);
        return true;
      } catch {
        return false;
      }
    },
    [pickedColor, formatColor, writeToClipboard, flashCopied]
  );

  return { pickedColor, isPickingActive, copied, copiedValue, startColorPicking, copyColor };
};
