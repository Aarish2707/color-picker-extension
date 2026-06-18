import "./App.css";
import IconButton from "./components/common/IconButton";
import PopupHeader from "./components/PopupHeader";
import PopupWrapper from "./components/PopupWrapper";

import PickerIcon from "./assets/images/icons/picker-icon.svg";
import CopyIcon from "./assets/images/icons/copy-icon.svg";
import ColorShower from "./components/common/ColorShower";

function App() {
  return (
    <>
      <PopupWrapper>
        <PopupHeader />
        <div className="h-1"></div>
        <div className="flex justify-center gap-3">
          <ColorShower
            // color="#FF5733"
            showQuestion
          />
          <div className="flex justify-center gap-3 pt-2!">
            <IconButton icon={PickerIcon} variant="contained" />
            <IconButton icon={CopyIcon} variant="outlined" />
          </div>
        </div>
      </PopupWrapper>
      {/* <ColorPickerTool />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', padding: '32px' }}>
        {colors.map(({ bg, label }) => (
          <div key={label} style={{ backgroundColor: bg, height: '120px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
            {label}
          </div>
        ))}
      </div> */}
    </>
  );
}

export default App;
