import { getHotelsByUserId } from "@/actions/getHotelsByUserId";
import HotelList from "@/components/hotel/HotelList";

const MyHotelsPage = async () => {
  const hotels = await getHotelsByUserId();

  if (!hotels) return <div>No hotel found</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold">Here are your properties</h2>
      <HotelList hotels={hotels} />
    </div>
  );
};

export default MyHotelsPage;
