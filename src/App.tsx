import "./App.css";
import { useState } from "react";
import IconButton from "./components/common/IconButton";
import PopupHeader from "./components/PopupHeader";
import PopupWrapper from "./components/PopupWrapper";

import PickerIcon from "./assets/images/icons/picker-icon.svg";
import CopyIcon from "./assets/images/icons/copy-icon.svg";
import CloseIcon from "./assets/images/icons/close-icon.svg";
import ColorShower from "./components/common/ColorShower";
import { useColorPicker } from "./hooks/useColorPicker";
import { getExtensionURL } from "./hooks/useExtensionURL";

type ColorFormat = "hex" | "rgb" | "hsl";

interface AppProps {
  onClose?: () => void;
}

function App({ onClose }: AppProps) {
  const { pickedColor, startColorPicking, copyColor } = useColorPicker();
  const [selectedFormat, setSelectedFormat] = useState<ColorFormat>("hex");

  return (
    <div className="flex flex-col gap-2 items-end">
      <IconButton
        icon={getExtensionURL(CloseIcon)}
        variant="outlined"
        onClick={onClose}
        title="To close the extension"
        className="!border-[#DBDBDB]"
      />
      <PopupWrapper>
        <PopupHeader
          selectedFormat={selectedFormat}
          onFormatChange={setSelectedFormat}
        />
        <div className="h-1"></div>
        <div className="flex justify-center gap-3">
          <ColorShower
            color={pickedColor || undefined}
            showQuestion={!pickedColor}
          />
          <div className="flex justify-center gap-3 pt-2!">
            <IconButton
              icon={getExtensionURL(PickerIcon)}
              variant="contained"
              onClick={startColorPicking}
              title="Pick a color from the page"
            />
            <IconButton
              icon={getExtensionURL(CopyIcon)}
              variant="outlined"
              onClick={async () => {
                const success = await copyColor(selectedFormat);
                if (success && onClose) {
                  setTimeout(onClose, 200);
                }
              }}
              disabled={!pickedColor}
              title="Copy color to clipboard"
            />
          </div>
        </div>
      </PopupWrapper>
    </div>
  );
}

export default App;
