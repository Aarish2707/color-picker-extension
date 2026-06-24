import "./App.css";
import { useState } from "react";
import IconButton from "./components/common/IconButton";
import PopupHeader from "./components/PopupHeader";
import PopupWrapper from "./components/PopupWrapper";

import PickerIcon from "./assets/images/icons/picker-icon.svg";
import CloseIcon from "./assets/images/icons/close-icon.svg";
import ColorShower from "./components/common/ColorShower";
import { useColorPicker } from "./hooks/useColorPicker";
import { getExtensionURL } from "./hooks/useExtensionURL";
import { CopyToast } from "./components/common/Toast/CopyToast";

type ColorFormat = "hex" | "rgb" | "hsl";

interface AppProps {
  onClose?: () => void;
}

function App({ onClose }: AppProps) {
  const { pickedColor, copied, copiedValue, startColorPicking } = useColorPicker();
  const [selectedFormat, setSelectedFormat] = useState<ColorFormat>("hex");
  const [closing, setClosing] = useState(false);

  const handleFormatChange = (format: ColorFormat) => {
    setSelectedFormat(format);
    chrome.storage.session.set({ colorFormat: format });
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => onClose?.(), 1000);
  };

  return (
    <div className="flex flex-col gap-2 items-end relative">
      <CopyToast value={copiedValue} visible={copied} />
      <PopupWrapper closing={closing}>
        <PopupHeader
          selectedFormat={selectedFormat}
          onFormatChange={handleFormatChange}
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
              onClick={() => startColorPicking(selectedFormat)}
              title="Pick a color from the page"
            />
            <IconButton
              icon={getExtensionURL(CloseIcon)}
              variant="outlined"
              onClick={handleClose}
              title="Close the extension"
              className="!border-[#DBDBDB]"
            />
          </div>
        </div>
      </PopupWrapper>
    </div>
  );
}

export default App;