import IconButton from "./components/common/IconButton";
import PopupHeader from "./components/PopupHeader";
import PopupWrapper from "./components/PopupWrapper";

import PickerIcon from "./assets/images/icons/picker-icon.svg";
import CopyIcon from "./assets/images/icons/copy-icon.svg";

function App() {
  return (
    <>
      <PopupWrapper>
        <PopupHeader />
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center justify-center gap-3">
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
