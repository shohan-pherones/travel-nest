import { HotelWithRooms } from "./AddHotelForm";
import HotelCard from "./HotelCard";

interface Props {
  hotels: HotelWithRooms[];
}

const HotelList = ({ hotels }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mt-5">
      {hotels.map((hotel) => (
        <div key={hotel.id}>
          <HotelCard hotel={hotel} />
        </div>
      ))}
    </div>
  );
};

export default HotelList;
