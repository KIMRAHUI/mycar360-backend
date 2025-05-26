import './Hero.css';
import { useNavigate } from 'react-router-dom';

function Hero() {
  const navigate = useNavigate();

  return (
    <>
      {/* 상단 히어로 배경 영역 */}
      <section className="hero">
        <div className="hero-content">
          <h1>The Continental</h1>
          <p>오직 금화로만 입장 가능한 킬러들의 마지막 안식처</p>
          <button className="hero-link" onClick={() => navigate('/reservation')}>
            예약하기
          </button>
        </div>
      </section>

      {/* 아래 glass-card 소개 카드 섹션 */}
      <section className="glass-card-wrapper">
        <div className="glass-card">
          <div className="glass-section">
            <h2>호텔 소개</h2>
            <p>
              콘티넨탈 호텔은 킬러들을 위한 중립 지대입니다.<br />
              전 세계 지점 모두가 동일한 규칙과 품격을 유지하며,<br />
              금화로만 운영되고 모든 고객의 프라이버시를 보장합니다.
            </p>
          </div>

          <div className="glass-section">
            <h2>운영 철학</h2>
            <p>
              콘티넨탈은 단순한 숙소가 아닙니다.<br />
              의뢰, 정보, 무기 거래까지 가능한 종합 거점이며,<br />
              내부 질서와 신뢰를 최우선으로 운영됩니다.
            </p>
          </div>

          <div className="glass-section">
            <h2>보안 규정</h2>
            <p>
              호텔 내 모든 폭력은 금지되며 위반 시 강력한 제재가 따릅니다.<br />
              출입은 생체 인증과 토큰 기반으로 관리되며,<br />
              철저한 감시 시스템이 24시간 작동합니다.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;
