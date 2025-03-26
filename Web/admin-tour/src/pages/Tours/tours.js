import { useEffect, useState } from "react";
import tourService from "../../services/tourService";

function Tours() {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    tourService.getAllTours().then((res) => {
      setTours(res.data);
    }).catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Quản lý Tour</h1>
      <ul>
        {tours.map((tour) => (
          <li key={tour.id}>{tour.name} - {tour.price} VND</li>
        ))}
      </ul>
    </div>
  );
}

export default Tours;
