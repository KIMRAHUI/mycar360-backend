import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import './Location.css';

// 호텔 마커 아이콘
const hotelIcon = new L.Icon({
  iconUrl: '/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// 🔍 카카오 주소 검색 팝업 버튼
function AddressSearch({ mapRef }) {
  const handleSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        const query = `${data.address}`;
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
          .then((res) => res.json())
          .then((result) => {
            if (result && result.length > 0) {
              const { lat, lon } = result[0];
              mapRef.current.setView([parseFloat(lat), parseFloat(lon)], 16);
            } else {
              alert('❌ 위치를 찾을 수 없습니다.');
            }
          });
      },
    }).open();
  };

  return (
    <div className="search-bar">
      <button onClick={handleSearch}>주소 검색</button>
    </div>
  );
}

function Location() {
  const hotelPosition = [37.5665, 126.9780];
  const mapRef = useRef();

  const fugitives = [
    {
      name: 'Cassian',
      bounty: '₩500,000,000',
      reason: '콘티넨탈 내 무단 공격',
      position: [37.5645, 126.9770],
    },
    {
      name: 'Ares',
      bounty: '₩350,000,000',
      reason: '하이테이블 금고 침입',
      position: [37.5678, 126.9825],
    },
    {
      name: "Santino D'Antonio",
      bounty: '₩800,000,000',
      reason: '신성한 계약 위반',
      position: [37.5655, 126.9760],
    },
  ];

  return (
    <section className="location-page">
      <div className="location-header">
        <h2>Location</h2>
        <AddressSearch mapRef={mapRef} />
      </div>

      <div className="map-wrapper">
        <MapContainer
          center={hotelPosition}
          zoom={15}
          scrollWheelZoom={false}
          className="leaflet-map"
          whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          <Marker position={hotelPosition} icon={hotelIcon}>
            <Popup>
              Continental Hotel 본점<br />
              서울특별시 중구 무교로 1
            </Popup>
          </Marker>

          {fugitives.map((fugitive, index) => (
            <Marker key={index} position={fugitive.position}>
              <Popup>
                <strong>{fugitive.name}</strong><br />
                현상금: {fugitive.bounty}<br />
                이유: {fugitive.reason}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="location-info">
        <h3>호텔 위치 안내</h3>
        <p>서울특별시 중구 무교로 1</p>
        <p>콘티넨탈 본점은 모든 킬러들에게 안전지대이자 출입 허가자만 접근 가능한 중립 지점입니다.</p>
      </div>
    </section>
  );
}

export default Location;
