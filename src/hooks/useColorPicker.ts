import { useState, useEffect, useCallback } from "react";
import { useColorFormat } from "./useColorFormat";

type ColorFormat = "hex" | "rgb" | "hsl";

interface UseColorPickerReturn {
  pickedColor: string | null;
  isPickingActive: boolean;
  startColorPicking: () => void;
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
  const { formatColor } = useColorFormat();

  useEffect(() => {
    chrome.storage.session.get("lastPick", (data: { lastPick?: { hex: string } }) => {
      if (data.lastPick?.hex) {
        setPickedColor(data.lastPick.hex);
      }
    });
  }, []);

  const startColorPicking = useCallback(() => {
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
      })
      .catch(() => {})
      .finally(() => setIsPickingActive(false));
  }, []);

  const copyColor = useCallback(
    async (format: ColorFormat): Promise<boolean> => {
      if (!pickedColor) return false;
      try {
        const formattedColor = formatColor(pickedColor, format);
        await navigator.clipboard.writeText(formattedColor);
        return true;
      } catch {
        return false;
      }
    },
    [pickedColor, formatColor]
  );

  return { pickedColor, isPickingActive, startColorPicking, copyColor };
};
