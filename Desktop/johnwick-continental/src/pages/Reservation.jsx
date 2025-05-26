import { useNavigate } from 'react-router-dom';
import RoomCard from '../components/RoomCard';
import deluxe from '../assets/deluxe.png';
import assassin from '../assets/assassin.png';
import blackroom from '../assets/blackroom.png';
import bunker from '../assets/bunker.png';
import penthouse from '../assets/penthouse.png';
import silentRoom from '../assets/silent-room.png';
import './Reservation.css';

function Reservation() {
  const navigate = useNavigate();

  // 결제 페이지로 이동하는 함수
  const handleBook = (roomName) => {
    navigate('/payment', { state: { selectedRoom: roomName } });
  };

  return (
    <section className="reservation-page">
      <div className="room-list">
        <RoomCard
          title="디럭스 스위트"
          description={`음향 차단 공간\n신분 세탁 출구`}
          price="₩300,000 / 1박"
          image={deluxe}
          onBook={() => handleBook('디럭스 스위트')}
        />
        <RoomCard
          title="암살자 은신처"
          description={`최대 프라이버시\n무기 보관함 접근 가능`}
          price="₩500,000 / 1박"
          image={assassin}
          onBook={() => handleBook('암살자 은신처')}
        />
        <RoomCard
          title="블랙 룸"
          description={`VIP 전용\n전담 집사 서비스`}
          price="₩1,000,000 / 문의 필요"
          image={blackroom}
          onBook={() => handleBook('블랙 룸')}
        />
        <RoomCard
          title="콘티넨탈 벙커"
          description={`지하 금고\n완전한 은폐 보장`}
          price="₩800,000 / 1박"
          image={bunker}
          onBook={() => handleBook('콘티넨탈 벙커')}
        />
        <RoomCard
          title="하이 테이블 펜트하우스"
          description={`도시 전경 전망\n하이 테이블 멤버 전용`}
          price="₩1,500,000 / 문의 필요"
          image={penthouse}
          onBook={() => handleBook('하이 테이블 펜트하우스')}
        />
        <RoomCard
          title="사일런트 쿼터스"
          description={`방음 보호소\n접촉 금지, 완전 격리`}
          price="₩380,000 / 1박"
          image={silentRoom}
          onBook={() => handleBook('사일런트 쿼터스')}
        />
      </div>
    </section>
  );
}

export default Reservation;
