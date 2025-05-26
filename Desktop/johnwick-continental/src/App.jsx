import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Reservation from './pages/Reservation';
import Support from './pages/Support';
import Location from './pages/Location';
import FacilityList from './pages/FacilityList';
import FacilityDetail from './pages/FacilityDetail';
import Payment from './pages/Payment'; 

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/support" element={<Support />} />
        <Route path="/location" element={<Location />} />
        <Route path="/facilities" element={<FacilityList />} />
        <Route path="/facilities/:id" element={<FacilityDetail />} />
        <Route path="/payment" element={<Payment />} /> 
      </Routes>
    </Router>
  );
}

export default App;
