import { getHotelById } from "@/actions/getHotelById";
import AddHotelForm from "@/components/hotel/AddHotelForm";
import { auth } from "@clerk/nextjs";

const HotelDetailsPage = async ({
  params,
}: {
  params: { hotelId: string };
}) => {
  const hotel = await getHotelById(params.hotelId);
  const { userId } = auth();

  if (!userId) return <div>Not authenticated!</div>;

  if (hotel && hotel.userId !== userId) return <div>Forbidden access!</div>;

  return (
    <div>
      <AddHotelForm hotel={hotel} />
    </div>
  );
};

export default HotelDetailsPage;
