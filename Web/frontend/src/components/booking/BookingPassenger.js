// BookingPassenger.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, User, Smile } from 'lucide-react';
import './BookingPassenger.css';
import { toast } from 'react-toastify';
import styles from './BookingPassenger.module.css'; // Sử dụng CSS Module
import DatePicker from '../common/DatePicker'; // Import DatePicker mới

const BookingPassenger = () => {
  const location = useLocation();
  const navigate = useNavigate();
  console.log('BookingPassenger location.state:', location.state);
  const { bookingId, bookingCode, tourInfo, selectedDate, itineraries = [], finalPrice } = location.state || {};

  // State cho thông tin người đặt tour
  const [useLoggedInInfo, setUseLoggedInInfo] = useState(true);
  const [contactInfo, setContactInfo] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
    gender: 'Nam',
    birthDate: ''
  });

  // State cho thông tin người dùng đã đăng nhập
  const [loggedInUser, setLoggedInUser] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
    gender: 'Nam',
    birthDate: ''
  });

  // State cho số lượng hành khách
  const initialPassengerCounts = location.state?.passengerCounts || {
    adult: 1,
    child: 0,
    infant: 0
  };
  const [passengerCounts, setPassengerCounts] = useState(initialPassengerCounts);

  // State cho thông tin chi tiết của các hành khách phụ
  const [additionalPassengers, setAdditionalPassengers] = useState({
    adult: [], // Chỉ chứa thông tin người lớn 2 trở đi
    child: [],
    infant: []
  });

  const [bookedTour, setBookedTour] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [expandedDestinationIds, setExpandedDestinationIds] = useState([]);
  const [expandedEventIds, setExpandedEventIds] = useState([]);

  // Thêm lại các state cho mã giảm giá
  const [discountCode, setDiscountCode] = useState('');
  const [discountInfo, setDiscountInfo] = useState(null);
  const [discountError, setDiscountError] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState(location.state?.finalPrice || 0);

  // Thêm hàm tính giá đã giảm, kiểm tra bookedTour tồn tại
  const discountPercent = discountInfo?.discountPercent || 0;
  const discountedBasePrice = bookedTour ? Math.round(bookedTour.price * (1 - discountPercent / 100)) : 0;
  const getDiscountedPrice = (base, ratio = 1) => bookedTour ? Math.round(base * ratio * (1 - discountPercent / 100)) : 0;

  // Tính tổng gốc (chưa giảm)
  const totalOriginal = bookedTour
    ? passengerCounts.adult * bookedTour.price +
      passengerCounts.child * bookedTour.price * 0.5 +
      passengerCounts.infant * bookedTour.price * 0.25
    : 0;

  // Helper: Tính tuổi tại ngày khởi hành
  function getAgeAtDate(birthDateStr, refDateStr) {
    if (!birthDateStr || !refDateStr) return null;
    const birth = new Date(birthDateStr);
    const ref = new Date(refDateStr);
    let age = ref.getFullYear() - birth.getFullYear();
    const m = ref.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && ref.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  function formatTime(timeStr) {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    let hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${m} ${ampm}`;
  }

  // Cập nhật contactInfo khi toggle useLoggedInInfo
  useEffect(() => {
    if (useLoggedInInfo) {
      setContactInfo(loggedInUser);
    } else {
      setContactInfo({
        fullName: '',
        phoneNumber: '',
        email: '',
        address: '',
        gender: 'Nam',
        birthDate: ''
      });
    }
  }, [useLoggedInInfo, loggedInUser]);

  // Fetch thông tin tour và user
  useEffect(() => {
    if (!bookingId || !tourInfo) return navigate('/tours');
    setBookedTour(tourInfo);

    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const publicId = localStorage.getItem('publicId');
        if (!token || !publicId) return navigate('/login');

        const res = await axios.get(`http://localhost:8080/api/users/${publicId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = res.data;
        const userData = {
          fullName: data.fullName || '',
          phoneNumber: data.phone || '',
          email: data.email || '',
          address: data.address || '',
          gender: 'Nam',
          birthDate: ''
        };
        setLoggedInUser(userData);
        setContactInfo(userData);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) navigate('/login');
      }
    };
    fetchUserInfo();
  }, [bookingId, tourInfo, navigate]);

  // Tính toán tổng giá (có áp dụng giảm giá nếu có)
  useEffect(() => {
    if (!bookedTour) return;
    const adultPrice = bookedTour.price;
    const childPrice = bookedTour.price * 0.5;
    const infantPrice = bookedTour.price * 0.25;
    const totalBeforeDiscount =
      (passengerCounts.adult * adultPrice) +
      (passengerCounts.child * childPrice) +
      (passengerCounts.infant * infantPrice);
    
    if (discountInfo && discountInfo.discountPercent) {
      const percent = discountInfo.discountPercent;
      const newTotal = Math.round(totalBeforeDiscount - (totalBeforeDiscount * percent / 100));
      setDiscountedPrice(newTotal);
      setTotalPrice(newTotal);
    } else {
      setDiscountedPrice(totalBeforeDiscount);
      setTotalPrice(totalBeforeDiscount);
    }
  }, [passengerCounts, bookedTour, discountInfo]);

  // Xử lý thay đổi thông tin liên hệ
  const handleContactChange = (e) => {
    setContactInfo(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Xử lý thay đổi số lượng hành khách
  const handlePassengerCountChange = (type, operation) => {
    setPassengerCounts(prev => {
      const totalCurrent = prev.adult + prev.child + prev.infant;
      const max = bookedTour?.maxParticipants || 99;
      let newCount = operation === 'add'
        ? prev[type] + 1
        : Math.max(type === 'adult' ? 1 : 0, prev[type] - 1);
      // Nếu là tăng, kiểm tra tổng số khách mới
      if (operation === 'add') {
        if (totalCurrent + 1 > max) {
          toast.error(`Số lượng khách không được vượt quá ${max} người!`);
          return prev;
        }
      }
      setAdditionalPassengers(prevDetails => {
        let updated = [...prevDetails[type]];
        if (type === 'adult') {
          if (updated.length < newCount - 1) {
            while (updated.length < newCount - 1) {
              updated.push({ fullName: '', gender: 'Nam', birthDate: '' });
            }
          } else if (updated.length > newCount - 1) {
            updated = updated.slice(0, newCount - 1);
          }
        } else {
          if (updated.length < newCount) {
            while (updated.length < newCount) {
              updated.push({ fullName: '', gender: 'Nam', birthDate: '' });
            }
          } else if (updated.length > newCount) {
            updated = updated.slice(0, newCount);
          }
        }
        return { ...prevDetails, [type]: updated };
      });
      return { ...prev, [type]: newCount };
    });
  };

  // Xử lý thay đổi thông tin hành khách phụ
  const handleAdditionalPassengerChange = (type, index, field, value) => {
    setAdditionalPassengers(prev => {
      // Luôn tạo mảng mới để React nhận biết thay đổi
      const updated = prev[type].map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      );
      return { ...prev, [type]: updated };
    });
  };

  // Toggle sử dụng thông tin đăng nhập
  const handleToggleUserInfo = () => {
    setUseLoggedInInfo(prev => !prev);
  };

  // Toggle hiển thị note điểm đến
  const toggleDestinationNote = (destinationId) => {
    setExpandedDestinationIds(prev =>
      prev.includes(destinationId)
        ? prev.filter(id => id !== destinationId)
        : [...prev, destinationId]
    );
  };

  // Toggle hiển thị note sự kiện
  const toggleEventNote = (eventId) => {
    setExpandedEventIds(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  // Validate dữ liệu trước khi submit
  const validateData = () => {
    const errors = [];

    // Validate thông tin liên hệ
    if (!contactInfo.fullName?.trim()) errors.push("Họ tên không được để trống");
    if (!contactInfo.email?.trim()) errors.push("Email không được để trống");
    if (!contactInfo.phoneNumber?.trim()) errors.push("Số điện thoại không được để trống");
    if (!contactInfo.birthDate) errors.push("Ngày sinh không được để trống");
    // Kiểm tra tuổi người lớn (người liên hệ)
    if (contactInfo.birthDate && selectedDate) {
      const age = getAgeAtDate(contactInfo.birthDate, selectedDate);
      if (age === null || isNaN(age)) {
        errors.push("Ngày sinh người liên hệ không hợp lệ");
      } else if (age < 16) {
        errors.push("Người liên hệ phải trên 16 tuổi tại ngày khởi hành");
      }
    }

    // Validate thông tin hành khách phụ
    additionalPassengers.adult.forEach((p, index) => {
      if (!p.fullName?.trim()) {
        errors.push(`Vui lòng nhập tên cho Người lớn ${index + 2}`);
      }
      if (!p.birthDate) {
        errors.push(`Vui lòng nhập ngày sinh cho Người lớn ${index + 2}`);
      } else if (selectedDate) {
        const age = getAgeAtDate(p.birthDate, selectedDate);
        if (age === null || isNaN(age)) {
          errors.push(`Ngày sinh của Người lớn ${index + 2} không hợp lệ`);
        } else if (age < 16) {
          errors.push(`Người lớn ${index + 2} phải trên 16 tuổi tại ngày khởi hành`);
        }
      }
    });

    additionalPassengers.child.forEach((p, index) => {
      if (!p.fullName?.trim()) {
        errors.push(`Vui lòng nhập tên cho Trẻ em ${index + 1}`);
      }
      if (!p.birthDate) {
        errors.push(`Vui lòng nhập ngày sinh cho Trẻ em ${index + 1}`);
      } else if (selectedDate) {
        const age = getAgeAtDate(p.birthDate, selectedDate);
        if (age === null || isNaN(age)) {
          errors.push(`Ngày sinh của Trẻ em ${index + 1} không hợp lệ`);
        } else if (age < 2 || age >= 16) {
          errors.push(`Trẻ em ${index + 1} phải từ 2 đến dưới 16 tuổi tại ngày khởi hành`);
        }
      }
    });

    additionalPassengers.infant.forEach((p, index) => {
      if (!p.fullName?.trim()) {
        errors.push(`Vui lòng nhập tên cho Em bé ${index + 1}`);
      }
      if (!p.birthDate) {
        errors.push(`Vui lòng nhập ngày sinh cho Em bé ${index + 1}`);
      } else if (selectedDate) {
        const age = getAgeAtDate(p.birthDate, selectedDate);
        if (age === null || isNaN(age)) {
          errors.push(`Ngày sinh của Em bé ${index + 1} không hợp lệ`);
        } else if (age >= 2) {
          errors.push(`Em bé ${index + 1} phải dưới 2 tuổi tại ngày khởi hành`);
        }
      }
    });

    return errors;
  };

  // Xử lý submit form
  const handleSubmitPassengers = async () => {
    const errors = validateData();
    if (errors.length > 0) {
      errors.forEach(err => toast.error(err));
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      const publicId = localStorage.getItem('publicId');
      if (!token || !publicId) return navigate('/login');

      // Tạo danh sách hành khách (chỉ để log, không gửi cả mảng này lên backend)
      const allPassengers = [];
      allPassengers.push({
        fullName: contactInfo.fullName.trim(),
        gender: contactInfo.gender,
        birthDate: contactInfo.birthDate,
        passengerType: 'adult',
        phone: contactInfo.phoneNumber.trim(),
        email: contactInfo.email.trim(),
        address: contactInfo.address?.trim() || ''
      });
      additionalPassengers.adult.forEach((p, idx) => {
        allPassengers.push({
          fullName: p.fullName.trim(),
          gender: p.gender,
          birthDate: p.birthDate,
          passengerType: 'adult'
        });
      });
      additionalPassengers.child.forEach(p => {
        allPassengers.push({
          fullName: p.fullName.trim(),
          gender: p.gender,
          birthDate: p.birthDate,
          passengerType: 'child'
        });
      });
      additionalPassengers.infant.forEach(p => {
        allPassengers.push({
          fullName: p.fullName.trim(),
          gender: p.gender,
          birthDate: p.birthDate,
          passengerType: 'infant'
        });
      });
      // Log kiểm tra dữ liệu trước khi gửi
      console.log('allPassengers:', allPassengers);
      console.log('additionalPassengers:', additionalPassengers);

      // Chỉ gửi Người lớn 2 trở đi, trẻ em, em bé vào passengerDetails
      const passengerDetails = [
        ...additionalPassengers.adult.map(p => ({
          fullName: p.fullName.trim(),
          gender: p.gender,
          birthDate: p.birthDate,
          passengerType: 'adult'
        })),
        ...additionalPassengers.child.map(p => ({
          fullName: p.fullName.trim(),
          gender: p.gender,
          birthDate: p.birthDate,
          passengerType: 'child'
        })),
        ...additionalPassengers.infant.map(p => ({
          fullName: p.fullName.trim(),
          gender: p.gender,
          birthDate: p.birthDate,
          passengerType: 'infant'
        }))
      ];

      const bookingPassengerRequest = {
        bookingId,
        publicId: localStorage.getItem('publicId'),
        contactInfo,
        passengers: passengerCounts,
        passengerDetails,
        discountCode: discountCode || null,
        discountedPrice: discountedPrice || null
      };

      const res = await axios.post('http://localhost:8080/api/booking-passengers/submit', bookingPassengerRequest, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      
      toast.success('Đăng ký thông tin hành khách thành công!');
      
      // Tính toán lại giá cuối cùng để đảm bảo chính xác
      const adultPrice = bookedTour.price;
      const childPrice = bookedTour.price * 0.5;
      const infantPrice = bookedTour.price * 0.25;
      const totalBeforeDiscount =
        (passengerCounts.adult * adultPrice) +
        (passengerCounts.child * childPrice) +
        (passengerCounts.infant * infantPrice);
      
      let finalPrice = totalBeforeDiscount;
      if (discountInfo && discountInfo.discountPercent) {
        const percent = discountInfo.discountPercent;
        finalPrice = Math.round(totalBeforeDiscount - (totalBeforeDiscount * percent / 100));
      }
      
      navigate('/booking-confirmation', {
        state: {
          bookingId,
          bookingCode: location.state.bookingCode,
          passengers: res.data,
          tourInfo: bookedTour,
          finalPrice: finalPrice,
          basePrice: bookedTour.price,
          itineraries,
          passengerCounts,
          contactInfo
        }
      });
    } catch (err) {
      const msg = err.response?.data?.message || 'Đã có lỗi xảy ra khi đăng ký thông tin hành khách';
      toast.error(msg);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hàm áp dụng mã giảm giá
  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setDiscountError('Vui lòng nhập mã giảm giá trước khi áp dụng!');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:8080/api/discounts/check',
        { code: discountCode, tourId: bookedTour?.tourId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDiscountInfo(res.data);
      setDiscountError('');
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setDiscountInfo(null);
        setDiscountedPrice(bookedTour.price);
        setDiscountError('Mã giảm giá không hợp lệ hoặc đã hết hạn');
      }
    }
  };

  if (!bookedTour) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Đang tải thông tin đặt chỗ...</p>
      </div>
    );
  }

  // Helper component cho từng input field để code gọn hơn
  const InputField = ({ label, id, ...props }) => (
    <div className={styles.inputGroup}>
      <label htmlFor={id} className={styles.label}>{label}</label>
      <input id={id} className={styles.input} {...props} />
    </div>
  );
  
  const SelectField = ({ label, id, children, ...props }) => (
    <div className={styles.inputGroup}>
      <label htmlFor={id} className={styles.label}>{label}</label>
      <select id={id} className={styles.input} {...props}>
        {children}
      </select>
    </div>
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainLayout}>
        {/* Cột trái - Form thông tin */}
        <div className={styles.mainContent}>
          <h1 className={styles.pageTitle}>Thông tin đặt tour</h1>

          {/* Form thông tin liên hệ */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Thông tin người liên hệ</h2>
            <div className={styles.gridForm}>
              <InputField label="Họ và tên" id="fullName" name="fullName" value={contactInfo.fullName} onChange={handleContactChange} placeholder="Nguyễn Văn A" required />
              <InputField label="Số điện thoại" id="phoneNumber" name="phoneNumber" value={contactInfo.phoneNumber} onChange={handleContactChange} placeholder="09xxxxxxxx" required />
              <InputField label="Email" id="email" name="email" type="email" value={contactInfo.email} onChange={handleContactChange} placeholder="email@example.com" required />
              <InputField label="Địa chỉ" id="address" name="address" value={contactInfo.address} onChange={handleContactChange} placeholder="Số nhà, đường, phường/xã,..." />
              <div className={styles.inputGroup}>
                <label htmlFor="birthDate" className={styles.label}>Ngày sinh (trên 16 tuổi)</label>
                <DatePicker 
                    id="birthDate"
                    value={contactInfo.birthDate} 
                    onChange={(newDate) => handleContactChange({ target: { name: 'birthDate', value: newDate } })}
                />
              </div>
              <SelectField label="Giới tính" id="gender" name="gender" value={contactInfo.gender} onChange={handleContactChange}>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </SelectField>
            </div>
          </div>

          {/* Form thông tin hành khách */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Thông tin hành khách</h2>
            {/* Người lớn */}
            {additionalPassengers.adult.map((p, index) => (
              <div key={`adult-${index}`} className={styles.passengerForm}>
                <h3 className={styles.passengerTitle}>Người lớn {index + 2}</h3>
                <div className={styles.gridForm}>
                  <InputField label="Họ và tên" id={`adult-fullName-${index}`} value={p.fullName} onChange={(e) => handleAdditionalPassengerChange('adult', index, 'fullName', e.target.value)} placeholder="Nguyễn Văn B" required />
                  <div className={styles.inputGroup}>
                    <label htmlFor={`adult-birthDate-${index}`} className={styles.label}>Ngày sinh (trên 16 tuổi)</label>
                    <DatePicker 
                        id={`adult-birthDate-${index}`}
                        value={p.birthDate} 
                        onChange={(newDate) => handleAdditionalPassengerChange('adult', index, 'birthDate', newDate)}
                    />
                  </div>
                   <SelectField label="Giới tính" id={`adult-gender-${index}`} value={p.gender} onChange={(e) => handleAdditionalPassengerChange('adult', index, 'gender', e.target.value)}>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </SelectField>
                </div>
              </div>
            ))}
            {/* Trẻ em */}
            {additionalPassengers.child.map((p, index) => (
              <div key={`child-${index}`} className={styles.passengerForm}>
                <h3 className={styles.passengerTitle}>Trẻ em {index + 1}</h3>
                <div className={styles.gridForm}>
                  <InputField label="Họ và tên" id={`child-fullName-${index}`} value={p.fullName} onChange={(e) => handleAdditionalPassengerChange('child', index, 'fullName', e.target.value)} placeholder="Nguyễn Thị C" required />
                  <div className={styles.inputGroup}>
                    <label htmlFor={`child-birthDate-${index}`} className={styles.label}>Ngày sinh (từ 2 đến dưới 16 tuổi)</label>
                    <DatePicker 
                        id={`child-birthDate-${index}`}
                        value={p.birthDate} 
                        onChange={(newDate) => handleAdditionalPassengerChange('child', index, 'birthDate', newDate)}
                    />
                  </div>
                   <SelectField label="Giới tính" id={`child-gender-${index}`} value={p.gender} onChange={(e) => handleAdditionalPassengerChange('child', index, 'gender', e.target.value)}>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </SelectField>
                </div>
              </div>
            ))}
            {/* Em bé */}
            {additionalPassengers.infant.map((p, index) => (
              <div key={`infant-${index}`} className={styles.passengerForm}>
                <h3 className={styles.passengerTitle}>Em bé {index + 1}</h3>
                <div className={styles.gridForm}>
                  <InputField label="Họ và tên" id={`infant-fullName-${index}`} value={p.fullName} onChange={(e) => handleAdditionalPassengerChange('infant', index, 'fullName', e.target.value)} placeholder="Nguyễn Văn D" required />
                  <div className={styles.inputGroup}>
                    <label htmlFor={`infant-birthDate-${index}`} className={styles.label}>Ngày sinh (dưới 2 tuổi)</label>
                    <DatePicker 
                        id={`infant-birthDate-${index}`}
                        value={p.birthDate} 
                        onChange={(newDate) => handleAdditionalPassengerChange('infant', index, 'birthDate', newDate)}
                    />
                  </div>
                   <SelectField label="Giới tính" id={`infant-gender-${index}`} value={p.gender} onChange={(e) => handleAdditionalPassengerChange('infant', index, 'gender', e.target.value)}>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </SelectField>
                </div>
              </div>
            ))}
          </div>

           <div className={styles.submitButtonWrapper}>
            <button onClick={handleSubmitPassengers} className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? 'Đang xử lý...' : 'Xác nhận thông tin'}
            </button>
          </div>
        </div>

        {/* Cột phải - Tóm tắt */}
        <div className={styles.summaryColumn}>
          <div className={styles.summaryCard}>
            <img src={bookedTour.imageUrls && bookedTour.imageUrls.length > 0 ? `http://localhost:8080${bookedTour.imageUrls[0]}` : 'https://via.placeholder.com/400x250'} alt={bookedTour.name} className={styles.summaryImage} />
            <div className={styles.summaryContent}>
              <h3 className={styles.summaryTourName}>{bookedTour.name}</h3>
              <p className={styles.summaryBookingCode}>Mã đặt chỗ: <strong>{bookingCode}</strong></p>
              <div className={styles.summaryDetail}>
                <p><strong>Ngày khởi hành:</strong> {new Date(selectedDate).toLocaleDateString('vi-VN')}</p>
              </div>

              <div className={styles.passengerCounter}>
                 <div className={styles.passengerType}>
                  <span>Người lớn (100%)</span>
                  <div className={styles.counterControls}>
                    <button onClick={() => handlePassengerCountChange('adult', 'subtract')}>-</button>
                    <span>{passengerCounts.adult}</span>
                    <button onClick={() => handlePassengerCountChange('adult', 'add')}>+</button>
                  </div>
                </div>
                 <div className={styles.passengerType}>
                  <span>Trẻ em (50%)</span>
                  <div className={styles.counterControls}>
                    <button onClick={() => handlePassengerCountChange('child', 'subtract')}>-</button>
                    <span>{passengerCounts.child}</span>
                    <button onClick={() => handlePassengerCountChange('child', 'add')}>+</button>
                  </div>
                </div>
                 <div className={styles.passengerType}>
                  <span>Em bé (25%)</span>
                  <div className={styles.counterControls}>
                    <button onClick={() => handlePassengerCountChange('infant', 'subtract')}>-</button>
                    <span>{passengerCounts.infant}</span>
                    <button onClick={() => handlePassengerCountChange('infant', 'add')}>+</button>
                  </div>
                </div>
              </div>
              {/* Bảng chi tiết giá từng loại hành khách */}
              {bookedTour && (
                <div className={styles.priceBreakdownBox}>
                  <div className={styles.priceBreakdownTitle}>Chi tiết giá:</div>
                  <div className={styles.priceRow}>
                    <span>Giá tour :</span>
                    {discountPercent > 0 ? (
                      <span className={styles.priceDisplayWrap}>
                        <span className={styles.priceDiscounted}>
                          {discountedBasePrice.toLocaleString('vi-VN')} đ
                          <span className={styles.discountIcon}>
                            <svg width="16" height="16" fill="#ff3b30" viewBox="0 0 24 24" style={{ display: 'block' }}>
                              <path d="M20.59 13.41l-8-8A2 2 0 0 0 10 4H4a2 2 0 0 0-2 2v6a2 2 0 0 0 .59 1.41l8 8a2 2 0 0 0 2.82 0l7.18-7.18a2 2 0 0 0 0-2.82zM7 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                            </svg>
                          </span>
                        </span>
                        <span className={styles.priceOriginal}>
                          {bookedTour.price.toLocaleString('vi-VN')} đ
                        </span>
                      </span>
                    ) : (
                      <span>{bookedTour.price.toLocaleString('vi-VN')} đ</span>
                    )}
                  </div>
                  {passengerCounts.adult > 0 && (
                    <div className={styles.priceBreakdownRow}>
                      <span>Người lớn :</span>
                      <span>
                        {getDiscountedPrice(bookedTour.price).toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  )}
                  {passengerCounts.child > 0 && (
                    <div className={styles.priceBreakdownRow}>
                      <span>Trẻ em :</span>
                      <span>
                        {getDiscountedPrice(bookedTour.price, 0.5).toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  )}
                  {passengerCounts.infant > 0 && (
                    <div className={styles.priceBreakdownRow}>
                      <span>Em bé :</span>
                      <span>
                       {getDiscountedPrice(bookedTour.price, 0.25).toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className={styles.priceSection}>
                {/* <h4 className={styles.priceTitle}>Chi tiết giá</h4> */}
               
                {discountInfo && (
                   <div className={`${styles.priceRow} ${styles.discountApplied}`}>
                    <span>Giảm giá ({discountInfo.discountPercent}%)</span>
                    <span>- {(totalPrice / (1 - discountInfo.discountPercent / 100) * (discountInfo.discountPercent / 100)).toLocaleString('vi-VN')}đ</span>
                  </div>
                )}
                 <div className={styles.discountSection}>
                  <input type="text" value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} placeholder="Nhập mã giảm giá" className={styles.discountInput} />
                  <button onClick={handleApplyDiscount} className={styles.applyButton}>Áp dụng</button>
                </div>
                {discountError && <p className={styles.discountError}>{discountError}</p>}

                {/* Tổng cộng */}
                <div className={styles.priceRow} style={{ marginTop: 12 }}>
                  <span>Tổng cộng :</span>
                  {discountPercent > 0 ? (
                    <span className={styles.priceDisplayWrap}>
                      <span className={styles.priceDiscounted}>
                        {discountedPrice.toLocaleString('vi-VN')} đ
                        <span className={styles.discountIcon}>
                          <svg width="16" height="16" fill="#ff3b30" viewBox="0 0 24 24" style={{ display: 'block' }}>
                            <path d="M20.59 13.41l-8-8A2 2 0 0 0 10 4H4a2 2 0 0 0-2 2v6a2 2 0 0 0 .59 1.41l8 8a2 2 0 0 0 2.82 0l7.18-7.18a2 2 0 0 0 0-2.82zM7 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                          </svg>
                        </span>
                      </span>
                      <span className={styles.priceOriginal}>
                        {totalOriginal.toLocaleString('vi-VN')} đ
                      </span>
                    </span>
                  ) : (
                    <span className={styles.priceDiscounted}>
                      {totalOriginal.toLocaleString('vi-VN')} đ
                    </span>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPassenger;