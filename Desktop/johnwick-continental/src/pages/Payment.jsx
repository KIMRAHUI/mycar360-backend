import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Payment.css';

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedItem = location.state?.selectedRoom || location.state?.selectedFacility || '';

  const [date, setDate] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [validCode, setValidCode] = useState('');
  const [cvc, setCvc] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleConfirm = () => {
    setShowModal(false);
    navigate('/');
  };

  return (
    <section className="payment-page">
      <div className="payment-container">
        <h2>High Table Clearance</h2>
        <p className="subtext">결제 전용 보안 구역입니다. 신속하게 절차를 완료하세요.</p>

        <form onSubmit={handleSubmit} className="payment-form">
          <label>
            예약 날짜
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </label>

          <label>
            선택된 서비스 또는 객실
            <input type="text" value={selectedItem} readOnly />
          </label>

          <label>
            회원 카드 번호
            <input
              type="text"
              placeholder="1234-5678-9012-3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
            />
          </label>

          <label>
            유효 코드 (MM/YY)
            <input
              type="text"
              placeholder="12/26"
              value={validCode}
              onChange={(e) => setValidCode(e.target.value)}
              required
            />
          </label>

          <label>
            CVC
            <input
              type="text"
              placeholder="123"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="pay-btn">금화로 결제하기</button>
        </form>
      </div>

      {/* ✅ 모달 */}
      {showModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <h3>✔️ 결제 완료</h3>
            <p>안전한 중립 지점 예약이 완료되었습니다.</p>
            <button onClick={handleConfirm}>확인</button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Payment;
