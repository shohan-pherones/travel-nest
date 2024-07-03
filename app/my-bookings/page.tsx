import { getBookingsByHotelOwnerId } from "@/actions/getBookingsByHotelOwnerId";
import { getBookingsByUserId } from "@/actions/getBookingsByUserId";
import MyBookingsClient from "@/components/booking/MyBookingsClient";

const MyBookingsPage = async () => {
  const bookingsFromVisitors = await getBookingsByHotelOwnerId();
  const bookingsIHaveMade = await getBookingsByUserId();

  if (!bookingsFromVisitors && !bookingsIHaveMade) {
    return <div>No booking found</div>;
  }

  return (
    <div className="flex flex-col gap-10">
      {!!bookingsIHaveMade?.length && (
        <div>
          <h2 className="text-xl md:text-2xl font-semibold mb-5 mt-2">
            Here are bookings you have made
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {bookingsIHaveMade.map((booking) => (
              <MyBookingsClient key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      )}
      {!!bookingsFromVisitors?.length && (
        <div>
          <h2 className="text-xl md:text-2xl font-semibold mb-5 mt-2">
            Here are bookings from the visitors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {bookingsFromVisitors.map((booking) => (
              <MyBookingsClient key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
