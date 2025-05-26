import { useParams, useNavigate } from 'react-router-dom';
import facilityData from '../data/facilityData';
import './FacilityDetail.css';

function FacilityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const facility = facilityData.find((item) => item.id === id);

  if (!facility) {
    return (
      <div className="facility-detail not-found">
        <h2>존재하지 않는 시설입니다.</h2>
        <p>이 공간은 하이테이블의 비밀에 의해 봉인되어 있습니다.</p>
      </div>
    );
  }

  const isSecret = facility.isSecret === true;

  const handleSecretPayment = () => {
    navigate('/payment', { state: { selectedFacility: facility.title } });
  };

  return (
    <section className="facility-detail">
      <div className="image-wrapper">
        <img src={facility.image} alt={facility.title} className="detail-image" />
        <button className="back-top-btn" onClick={() => navigate('/facilities')}>
          ← 목록
        </button>
      </div>
      <div className="detail-content">
        <h2>{facility.title}</h2>
        <p>{facility.detail}</p>

        {isSecret ? (
          <button className="pay-btn" onClick={handleSecretPayment}>
            💳 지금 결제하기
          </button>
        ) : (
          <p className="reservation-info">🔒 예약은 결제 페이지에서 진행할 수 있습니다.</p>
        )}
      </div>
    </section>
  );
}

export default FacilityDetail;
