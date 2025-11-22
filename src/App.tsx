import AdminDashboard from './components/AdminDashboard'

function App() {
  return (
    <AdminDashboard
      onExport={(json) => {
        console.log('Exported state:', json);
      }}
      onImport={(json) => {
        console.log('Imported state:', json);
      }}
    />
  )
}

export default App
