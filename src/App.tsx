import ColorPickerTool from './ColorPickerTool'

const colors = [
  { bg: '#e74c3c', label: 'Red' },
  { bg: '#e67e22', label: 'Orange' },
  { bg: '#f1c40f', label: 'Yellow' },
  { bg: '#2ecc71', label: 'Green' },
  { bg: '#1abc9c', label: 'Teal' },
  { bg: '#3498db', label: 'Blue' },
  { bg: '#9b59b6', label: 'Purple' },
  { bg: '#e91e63', label: 'Pink' },
  { bg: '#1a1a2e', label: 'Dark' },
]

function App() {
  return (
    <>
      <ColorPickerTool />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', padding: '32px' }}>
        {colors.map(({ bg, label }) => (
          <div key={label} style={{ backgroundColor: bg, height: '120px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
            {label}
          </div>
        ))}
      </div>
    </>
  )
}

export default App
