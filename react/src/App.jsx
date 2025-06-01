import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './design/Devices.jsx';
import AddDevice from './design/AddDevice.jsx';
import Device from './design/Device.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/devices" element={<Main />} />
        <Route path="/devices/create" element={<AddDevice />} />
        <Route path="/devices/:deviceId" element={<Device />} />
      </Routes>
    </Router>
  );
}
export default App;