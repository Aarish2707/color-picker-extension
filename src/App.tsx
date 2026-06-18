import "./App.css";
import IconButton from "./components/common/IconButton";
import PopupHeader from "./components/PopupHeader";
import PopupWrapper from "./components/PopupWrapper";

import PickerIcon from "./assets/images/icons/picker-icon.svg";
import CopyIcon from "./assets/images/icons/copy-icon.svg";
import ColorShower from "./components/common/ColorShower";
import { useColorPicker } from "./hooks/useColorPicker";

function App() {
  const { pickedColor, startColorPicking, copyColor } = useColorPicker();

  return (
    <>
      <PopupWrapper>
        <PopupHeader />
        <div className="h-1"></div>
        <div className="flex justify-center gap-3">
          <ColorShower
            color={pickedColor || undefined}
            showQuestion={!pickedColor}
          />
          <div className="flex justify-center gap-3 pt-2!">
            <IconButton
              icon={PickerIcon}
              variant="contained"
              onClick={startColorPicking}
              title="Pick a color from the page"
            />
            <IconButton
              icon={CopyIcon}
              variant="outlined"
              onClick={copyColor}
              disabled={!pickedColor}
              title="Copy color to clipboard"
            />
          </div>
        </div>
      </PopupWrapper>
    </>
  );
}

export default App;
