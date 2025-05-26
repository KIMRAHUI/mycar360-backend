import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import facilityData from '../data/facilityData';
import './FacilityList.css';
import SecretCodeModal from '../components/SecretCodeModal';

function FacilityList() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [targetId, setTargetId] = useState(null);

  const handleCardClick = (facility) => {
    if (facility.isSecret) {
      setTargetId(facility.id);
      setShowModal(true);
    } else {
      navigate(`/facilities/${facility.id}`);
    }
  };

  return (
    <section className="facility-section">
      <h2>Facilities</h2>
      <div className="facility-grid">
        {facilityData.map((facility) => (
          <div
            key={facility.id}
            className="facility-card"
            onClick={() => handleCardClick(facility)}
          >
            <img src={facility.image} alt={facility.title} />
            <h3>{facility.title}</h3>
            <p>{facility.description}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <SecretCodeModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            navigate(`/facilities/${targetId}`);
          }}
        />
      )}
    </section>
  );
}

export default FacilityList;
