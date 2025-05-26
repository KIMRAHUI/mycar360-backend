import meeting1 from '../assets/meeting1.png';
import meeting2 from '../assets/meeting2.png';
import event1 from '../assets/event1.png';
import event2 from '../assets/event2.png';
import event3 from '../assets/event3.png';
import service1 from '../assets/service1.png';
import service2 from '../assets/service2.png';
import service3 from '../assets/service3.png';

const facilityData = [
  {
    id: 'meeting-a',
    title: '프라이빗 미팅룸 A',
    description: '보안이 철저한 계약 체결 및 전략 회의 공간입니다.',
    image: meeting1,
    detail: '방음 처리와 금화 보관 금고가 구비되어 있는 하이테이블 전용 회의실. 10인 규모의 고급 집무 테이블과 감시 회피 장치 탑재.',
  },
  {
    id: 'meeting-b',
    title: '프라이빗 미팅룸 B',
    description: '하이테이블 전용 회의실. 철저한 음향차단과 감시 차단 장치 탑재.',
    image: meeting2,
    detail: '조용한 거래를 위한 소형 회의실. 내부는 감시 불가 처리 및 킬러 전용 출입로 존재.',
  },
  {
    id: 'banquet',
    title: '연회장',
    description: '글로벌 조직의 공적 발표와 연회가 진행되는 공식 장소.',
    image: event1,
    detail: '3층 높이의 천장과 홀로그램 회의 시스템이 구비된 공간. 전 세계 조직 대표들이 모여 협약을 맺는 장소로 사용됩니다.',
  },
  {
    id: 'secret-poster',
    title: '시크릿 파티 포스터',
    description: '선택받은 자만이 참석할 수 있는 가면 무도회 전용 초대장.',
    image: event2,
    detail: '정확한 장소는 초대받은 자만 알 수 있습니다. 초대장은 토큰 교환을 통해 수령 가능.',
  },
  {
    id: 'secret-ball',
    title: '실제 연회장 내부',
    description: '가면무도회와 미션 사전 미팅이 이루어지는 가장 은밀한 공간.',
    image: event3,
    detail: '고전 양식의 조명과 절제된 분위기 속에서 킬러 간의 접선과 대화가 이루어지는 장소입니다.',
  },

  //요원 전용 서비스 3종
  {
    id: 'agent-office',
    title: '프라이빗 오피스',
    description: '전용 보안 장비와 연결된 킬러 전용 데스크 공간.',
    image: service1,
    detail: '이 공간은 요원 전용 접속 허가 후 예약할 수 있습니다.',
    isSecret: true,
  },
  {
    id: 'agent-suite',
    title: '킬러 스위트룸',
    description: '야경이 보이는 고급 숙소 + 무기 보관 시설 완비.',
    image: service2,
    detail: '전용 코드 확인 후 예약이 가능합니다.',
    isSecret: true,
  },
  {
    id: 'agent-training',
    title: '트레이닝 센터',
    description: '실전 모의 훈련이 가능한 비밀 훈련 구역.',
    image: service3,
    detail: '정해진 요원만 사용할 수 있는 공간입니다.',
    isSecret: true,
  },
];

export default facilityData;
