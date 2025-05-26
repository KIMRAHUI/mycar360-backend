import './RoomCard.css';

function RoomCard({ title, description, price, image, onBook }) {
  return (
    <div className="room-card">
      <img src={image} alt={title} className="room-image" />
      <div className="room-info">
        <h3>{title}</h3>
        <p className="desc">{description}</p>
        <p className="price">{price}</p>
        <button className="book-button" onClick={onBook}>
          예약하기
        </button>
      </div>
    </div>
  );
}

export default RoomCard;
