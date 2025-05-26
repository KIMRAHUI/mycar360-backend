import { useState } from 'react';
import './Support.css';

const faqData = [
  {
    question: '숙박 중 규칙 위반 시 어떻게 되나요?',
    answer: '콘티넨탈 내 모든 폭력 행위는 금지되며, 위반 시 퇴장 및 금화 몰수 조치됩니다.',
  },
  {
    question: '체크인/체크아웃 시간은 언제인가요?',
    answer: '체크인은 오후 3시, 체크아웃은 정오 12시까지입니다.',
  },
  {
    question: '비밀 요청이 가능한가요?',
    answer: '비밀 서비스는 프론트 데스크에서 전용 토큰을 통해 요청하실 수 있습니다.',
  },
  {
    question: '무기 보관이 가능한가요?',
    answer: '모든 투숙객은 입장 시 무기를 프론트 무기고에 맡기셔야 합니다.',
  },
  {
    question: '전용 차량 서비스가 제공되나요?',
    answer: '필요 시 고스트 운전기사와 차량이 대기 중이며, 추가 금화가 필요합니다.',
  },
];

function Support() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = faqData.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="support-page">
      <h2>Support</h2>

      <input
        type="text"
        placeholder="질문을 검색하세요..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="faq-search"
      />

      <div className="faq-section">
        {filteredFaqs.map((faq, index) => (
          <div
            className={`faq-card ${openIndex === index ? 'open' : ''}`}
            key={index}
            onClick={() => handleToggle(index)}
          >
            <h3>{faq.question}</h3>
            {openIndex === index && <p>{faq.answer}</p>}
          </div>
        ))}
      </div>

      <div className="contact-section">
        <h3>문의 방법</h3>
        <p>운영시간: 24시간 연중무휴</p>
        <p>이메일: contact@continentalhotel.co</p>
        <p>비상 연락: 전용 금화 호출기 사용</p>
      </div>
    </section>
  );
}

export default Support;
