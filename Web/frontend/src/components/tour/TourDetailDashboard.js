import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function TourDetailDashboard() {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [discountCode, setDiscountCode] = useState('');
  const [message, setMessage] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [relatedTours, setRelatedTours] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [finalPrice, setFinalPrice] = useState(0);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [selectedItineraryId, setSelectedItineraryId] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [expContent, setExpContent] = useState('');
  const [expMedia, setExpMedia] = useState([]);
  const [expLoading, setExpLoading] = useState(false);
  const [expTitle, setExpTitle] = useState('');
  const [modalImage, setModalImage] = useState(null);
  const [modalGallery, setModalGallery] = useState({ images: [], index: 0, open: false });
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [reviewName, setReviewName] = useState('');
  const [reviewContent, setReviewContent] = useState('');

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        const res = await axios.get(`http://localhost:8080/api/tours/${tourId}`, config);
        if (!res.data) throw new Error('Tour not found');
        setTour(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Please login to view tour details');
          navigate('/login');
        } else {
          setError(err.response?.data?.message || 'Failed to load tour details.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (tourId) fetchTour();
    else {
      setError('Invalid tour ID');
      setLoading(false);
    }
  }, [tourId, navigate]);

  useEffect(() => {
    const fetchRelatedTours = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = token 
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};
          
        const res = await axios.get(
          `http://localhost:8080/api/tours/random?count=3&excludeTourId=${tourId}`,
          config
        );
        setRelatedTours(res.data);
      } catch (err) {
        console.error('Failed to fetch related tours:', err);
      }
    };

    if (tourId) fetchRelatedTours();
  }, [tourId]);

  const fetchItineraries = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = token 
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      const schedulesRes = await axios.get(
        `http://localhost:8080/api/schedules/tour/${tourId}`,
        config
      );
      const schedules = schedulesRes.data;

      const schedulesWithItineraries = [];
      for (const schedule of schedules) {
        const itinerariesRes = await axios.get(
          `http://localhost:8080/api/itineraries/schedule/${schedule.scheduleId}`,
          config
        );
        schedulesWithItineraries.push({
          ...schedule,
          itineraries: itinerariesRes.data
        });
      }
      setItineraries(schedulesWithItineraries);
    } catch (err) {
      console.error('Failed to fetch itineraries:', err);
    }
  };

  useEffect(() => {
    if (tourId) fetchItineraries();
  }, [tourId]);

  const handleBooking = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token) {
      toast.info(
        <div>
          Bạn cần đăng nhập (hoặc đăng ký) để đặt tour.<br />
          <button onClick={() => navigate("/login", { state: { tourId } })}>
            Đăng nhập ngay
          </button>
        </div>,
        { autoClose: false, position: "top-center" }
      );
      return;
    }
    if (!userId) {
      toast.error("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
      return;
    }
    if (!selectedScheduleId) {
      toast.error("Vui lòng chọn một lịch trình trước khi đặt tour.");
      return;
    }
    setBookingLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8080/api/bookings",
        { userId: parseInt(userId), tourId, scheduleId: selectedScheduleId, discountCode },
        { headers: { Authorization: "Bearer " + token } }
      );
      if (res.data && res.data.bookingId) {
        await fetchItineraries();
        const finalPrice = res.data.finalPrice;
        const selectedSchedule = itineraries.find(sch => sch.scheduleId === selectedScheduleId);
        navigate("/booking-passenger", { 
          state: { 
            bookingId: res.data.bookingId, 
            bookingCode: res.data.bookingCode, 
            tourInfo: tour, 
            selectedDate: selectedSchedule?.startDate, 
            itineraries: selectedSchedule?.itineraries || [], 
            finalPrice 
          } 
        });
      } else {
        toast.error("Invalid response from server");
        return;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra khi đặt tour");
      console.error("Booking error:", err);
    } finally {
      setBookingLoading(false);
    }
  };

  const fetchExperiences = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.get(`http://localhost:8080/api/experiences/tour/${tourId}`, config);
      setExperiences(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setExperiences([]);
    }
  };

  useEffect(() => {
    if (tourId) fetchExperiences();
  }, [tourId]);

  const handleExpSubmit = async (e) => {
    e.preventDefault();
    setExpLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      const expRes = await axios.post('http://localhost:8080/api/experiences', {
        userid: userId,
        tourId: tourId,
        content: expContent,
        title: expTitle
      }, config);

      const experienceId = expRes.data.experienceId;
      if (!experienceId) {
        alert('Không lấy được experienceId!');
        return;
      }

      for (const file of expMedia) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userid', userId);
        formData.append('experienceId', experienceId);
        formData.append('fileType', file.type.startsWith('image') ? 'image' : 'video');
        
        await axios.post('http://localhost:8080/api/media', formData, {
          ...config,
          headers: { ...config.headers, 'Content-Type': 'multipart/form-data' }
        });
      }
      
      setExpContent('');
      setExpMedia([]);
      setExpTitle('');
      fetchExperiences();
    } catch (err) {
      alert('Gửi trải nghiệm thất bại!');
    }
    setExpLoading(false);
  };

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setFeedbackLoading(true);
      try {
        const res = await axios.get(`http://localhost:8080/api/feedbacks?tourId=${tourId}`);
        setFeedbacks(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setFeedbacks([]);
      }
      setFeedbackLoading(false);
    };
    if (tourId) fetchFeedbacks();
  }, [tourId]);

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading tour details...</div>;
  if (error) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-600 text-xl">{error}</div>;
  if (!tour) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Tour not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {/* Tour Information Section */}
        <div className="bg-blue-50 rounded-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <h1 className="text-3xl font-bold text-blue-600 mb-4">{tour.name}</h1>
              <p className="text-gray-700 mb-6">{tour.description}</p>
              
              <div className="flex flex-wrap mb-6">
                <div className="w-1/3 mb-4">
                  <h3 className="text-sm font-semibold text-gray-500">Thời gian</h3>
                  <p className="text-lg font-medium">{tour.duration} ngày</p>
                </div>
                <div className="w-1/3 mb-4">
                  <h3 className="text-sm font-semibold text-gray-500">Số lượng</h3>
                  <p className="text-lg font-medium">{tour.maxParticipants} khách</p>
                </div>
                <div className="w-1/3 mb-4">
                  <h3 className="text-sm font-semibold text-gray-500">Giá</h3>
                  <p className="text-lg font-medium text-red-600">{tour.price?.toLocaleString()}đ</p>
                </div>
              </div>
              
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
                onClick={() => navigate("/tour-schedule", { state: { tourId } })}
              >
                LỊCH TRÌNH
              </button>
            </div>
            
            <div className="md:w-1/3">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-center mb-2">Đặt Tour Ngay</h3>
                <div className="bg-blue-100 text-blue-800 rounded-lg p-3 text-sm mb-4">
                  Nhận ưu đãi đặc biệt khi đặt tour trực tuyến
                </div>
                <button
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
                  onClick={handleBooking}
                  disabled={bookingLoading || !selectedScheduleId || 
                    ['full', 'closed'].includes(itineraries.find(sch => sch.scheduleId === selectedScheduleId)?.status)}
                >
                  {bookingLoading ? 'Đang xử lý...' : 
                    (itineraries.find(sch => sch.scheduleId === selectedScheduleId)?.status === 'full') 
                      ? 'Đã đủ người' 
                      : (itineraries.find(sch => sch.scheduleId === selectedScheduleId)?.status === 'closed')
                        ? 'Đã đóng' 
                        : 'Đặt ngay'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tour Schedule Section */}
        <div className="mb-12">
          <div className="bg-white border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Lịch trình tour</h3>
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">Còn {tour.availableSeats} chỗ</span>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4 py-2 mb-6">
              {tour.itinerary.map((day, index) => (
                <div key={index} className="mb-4">
                  <h4 className="font-semibold text-gray-800">Ngày {index + 1}:</h4>
                  {day.activities.map((activity, actIndex) => (
                    <p key={actIndex} className="text-gray-700">
                      <span className="font-medium">{activity.time}</span> - {activity.description}
                    </p>
                  ))}
                </div>
              ))}
            </div>
            
            <div className="text-sm text-gray-600">
              <p><i className="fas fa-info-circle mr-2 text-blue-500"></i>Lịch trình có thể thay đổi tùy theo điều kiện thời tiết và tình hình thực tế</p>
            </div>
          </div>
        </div>

        {/* Tour Images Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Hình ảnh tour</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tour.images.map((image, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  <img 
                    src={image.url} 
                    alt={image.description} 
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Review Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Chia sẻ trải nghiệm của bạn</h2>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <p className="text-gray-700 mb-6">
              Hãy chia sẻ trải nghiệm của bạn về tour để giúp những du khách khác có thêm thông tin.
            </p>
            
            <div className="space-y-4">
              <div>
                <input 
                  type="text" 
                  placeholder="Tên và địa chỉ email" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                />
              </div>
              
              <div>
                <textarea 
                  placeholder="Chia sẻ trải nghiệm của bạn về tour..." 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                ></textarea>
              </div>
              
              <div>
                <div className="border border-gray-300 rounded-lg px-4 py-3 flex items-center">
                  <i className="fas fa-camera text-gray-500 mr-2"></i>
                  <span className="text-gray-500">Chọn ảnh/video (tối đa 5 file)</span>
                </div>
              </div>
              
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-200">
                Gửi trải nghiệm
              </button>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Các trải nghiệm đã chia sẻ</h2>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            {tour.reviews.length > 0 ? (
              <div className="space-y-6">
                {tour.reviews.map((review, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                        <i className="fas fa-user"></i>
                      </div>
                      <div className="ml-4">
                        <h4 className="font-semibold text-gray-800">{review.name}</h4>
                        <p className="text-sm text-gray-500">{review.date}</p>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.content}</p>
                    {review.images && review.images.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        {review.images.map((image, imgIndex) => (
                          <img 
                            key={imgIndex}
                            src={image.url} 
                            alt={`Review image ${imgIndex + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Chưa có đánh giá nào cho tour này
              </div>
            )}
          </div>
        </div>

        {/* Related Tours Section */}
        {relatedTours.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Tour liên quan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedTours.map((relatedTour) => (
                <div key={relatedTour.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="h-48 bg-gray-100">
                    <img 
                      src={relatedTour.images[0]?.url} 
                      alt={relatedTour.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">{relatedTour.name}</h3>
                    <p className="text-red-600 font-bold mb-4">{relatedTour.price.toLocaleString('vi-VN')}đ</p>
                    <a 
                      href={`/tours/${relatedTour.id}`}
                      className="block w-full bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700 transition duration-200"
                    >
                      Xem chi tiết
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}