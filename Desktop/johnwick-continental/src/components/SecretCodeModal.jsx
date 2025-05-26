import { useState } from 'react';
import './SecretCodeModal.css';

function SecretCodeModal({ onClose, onSuccess }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const validCode = 'continental42'; // 설정한 전용 코드
    if (code === validCode) {
      setError('');
      onSuccess();
    } else {
      setError('❌ 접근 코드가 일치하지 않습니다.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="secret-modal">
        <h2>🔐 전용 코드 입력</h2>
        <p>이 시설은 요원 전용입니다. 접속 코드를 입력하세요.</p>
        <input
          type="password"
          placeholder="접속 코드"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        {error && <p className="error">{error}</p>}

        <div className="modal-actions">
          <button onClick={onClose}>닫기</button>
          <button onClick={handleSubmit}>입장</button>
        </div>
      </div>
    </div>
  );
}

export default SecretCodeModal;
