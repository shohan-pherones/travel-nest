import { getHotels } from "@/actions/getHotels";
import HotelList from "@/components/hotel/HotelList";

interface Props {
  searchParams: {
    title: string;
    country: string;
    state: string;
    city: string;
  };
}

const HomePage = async ({ searchParams }: Props) => {
  const hotels = await getHotels(searchParams);

  if (!hotels) {
    return <div>No hotel found...</div>;
  }

  return <HotelList hotels={hotels} />;
};

export default HomePage;
