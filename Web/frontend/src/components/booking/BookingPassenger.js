import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, User, Smile } from 'lucide-react';
import './BookingPassenger.css';
import { toast } from 'react-toastify';
import styles from './BookingPassenger.module.css';
import DatePicker from '../common/DatePicker';
import { FaExclamationCircle } from 'react-icons/fa';


const PassengerForm = ({ value, onChange, type, index, isContact, guardianOptions, errors, clearFieldError }) => {
  const handleChange = (e) => {
    if (e.target.name === 'phoneNumber') {
      let input = e.target.value.replace(/\D/g, '');
      if (input.length > 10) input = input.slice(0, 10);
      onChange({ ...value, phoneNumber: input });
      if (clearFieldError) clearFieldError('phoneNumber', index, type, isContact);
    } else {
      onChange({ ...value, [e.target.name]: e.target.value });
      if (clearFieldError) clearFieldError(e.target.name, index, type, isContact);
    }
  };
  const handleDateChange = (newDate) => {
    onChange({ ...value, birthDate: newDate });
    if (clearFieldError) clearFieldError('birthDate', index, type, isContact);
  };
  const handleGuardianChange = (e) => {
    onChange({ ...value, guardianIndex: parseInt(e.target.value, 10) });
  };
  let title = '';
  if (isContact) title = 'Người liên hệ (Người lớn 1)';
  else if (type === 'adult') title = `Người lớn ${index + 2}`;
  else if (type === 'child') title = `Trẻ em ${index + 1}`;
  else if (type === 'infant') title = `Em bé ${index + 1}`;
  let birthLabel = 'Ngày sinh';
  if (type === 'adult' && !isContact) birthLabel += ' (trên 16 tuổi)';
  if (type === 'child') birthLabel += ' (từ 2 đến dưới 16 tuổi)';
  if (type === 'infant') birthLabel += ' (dưới 2 tuổi)';
  return (
    <div className={styles.passengerForm}>
      <h3 className={styles.passengerTitle}>{title}</h3>
      <div className={styles.gridForm}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Họ và tên</label>
          <input className={styles.input} name="fullName" value={value.fullName} onChange={handleChange} placeholder="Họ và tên" />
          {errors?.fullName && <div className={styles.inputError}><FaExclamationCircle style={{color: 'red', marginRight: 4}}/>{errors.fullName}</div>}
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>{birthLabel}</label>
          <DatePicker value={value.birthDate} onChange={handleDateChange} />
          {errors?.birthDate && <div className={styles.inputError}><FaExclamationCircle style={{color: 'red', marginRight: 4}}/>{errors.birthDate}</div>}
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Giới tính</label>
          <select className={styles.input} name="gender" value={value.gender} onChange={handleChange}>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>
        {(isContact || (type === 'adult' && !isContact)) && (
          <>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Số điện thoại</label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{
                  padding: '10px 12px',
                  background: '#f5f6fa',
                  border: '1px solid #cbd5e0',
                  borderRadius: '6px 0 0 6px',
                  fontSize: 14,
                  color: '#4a5568',
                  borderRight: 'none'
                }}>+84</span>
                <input
                  className={styles.input}
                  style={{ borderRadius: '0 6px 6px 0', borderLeft: 'none', width: '100%' }}
                  name="phoneNumber"
                  value={value.phoneNumber || ''}
                  onChange={handleChange}
                  placeholder="Số điện thoại"
                  type="tel"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  maxLength={10}
                />
              </div>
              {errors?.phoneNumber && <div className={styles.inputError}><FaExclamationCircle style={{color: 'red', marginRight: 4}}/>{errors.phoneNumber}</div>}
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Email</label>
              <input className={styles.input} name="email" value={value.email || ''} onChange={handleChange} placeholder="Email" />
              {errors?.email && <div className={styles.inputError}><FaExclamationCircle style={{color: 'red', marginRight: 4}}/>{errors.email}</div>}
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Địa chỉ</label>
              <input className={styles.input} name="address" value={value.address || ''} onChange={handleChange} placeholder="Địa chỉ" />
              {errors?.address && <div className={styles.inputError}><FaExclamationCircle style={{color: 'red', marginRight: 4}}/>{errors.address}</div>}
            </div>
          </>
        )}
        {(type === 'child' || type === 'infant') && guardianOptions && (
          <div className={styles.inputGroup}>
            <label className={styles.label}>Người giám hộ</label>
            <select className={styles.input} name="guardianIndex" value={value.guardianIndex || 0} onChange={handleGuardianChange}>
              {guardianOptions.map((g, idx) => (
                <option key={idx} value={idx}>{g.fullName} {g.phoneNumber ? `(+84${g.phoneNumber})` : ''}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

const BookingPassenger = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId, bookingCode, tourInfo, selectedDate, itineraries = [], finalPrice } = location.state || {};

  const [useLoggedInInfo, setUseLoggedInInfo] = useState(true);
  const [contactInfo, setContactInfo] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
    gender: 'Nam',
    birthDate: ''
  });
  const [loggedInUser, setLoggedInUser] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
    gender: 'Nam',
    birthDate: ''
  });
  const hasInitializedContactInfo = useRef(false);

  // State cho số lượng hành khách
  const initialPassengerCounts = location.state?.passengerCounts || { adult: 1, child: 0, infant: 0 };
  const [passengerCounts, setPassengerCounts] = useState(initialPassengerCounts);
  const [additionalPassengers, setAdditionalPassengers] = useState({ adult: [], child: [], infant: [] });
  const [bookedTour, setBookedTour] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountCode, setDiscountCode] = useState('');
  const [discountInfo, setDiscountInfo] = useState(null);
  const [discountError, setDiscountError] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState(finalPrice || 0);
  const [contactErrors, setContactErrors] = useState({});
  const [passengerErrors, setPassengerErrors] = useState({ adult: [], child: [], infant: [] });
  const [expandedDestinationIds, setExpandedDestinationIds] = useState([]);
  const [expandedEventIds, setExpandedEventIds] = useState([]);

  // Tính giá và guardianOptions
  const discountPercent = discountInfo?.discountPercent || 0;
  const discountedBasePrice = bookedTour ? Math.round(bookedTour.price * (1 - discountPercent / 100)) : 0;
  const getDiscountedPrice = (base, ratio = 1) => bookedTour ? Math.round(base * ratio * (1 - discountPercent / 100)) : 0;
  const totalOriginal = bookedTour
    ? passengerCounts.adult * bookedTour.price +
      passengerCounts.child * bookedTour.price * 0.5 +
      passengerCounts.infant * bookedTour.price * 0.25
    : 0;
  const guardianOptions = [
    { ...contactInfo, fullName: contactInfo.fullName || 'Người liên hệ', phoneNumber: contactInfo.phoneNumber },
    ...additionalPassengers.adult.map((p, idx) => ({ ...p, fullName: p.fullName || `Người lớn ${idx + 2}` }))
  ];

  // Helper functions
  function getAgeAtDate(birthDateStr, refDateStr) {
    if (!birthDateStr || !refDateStr) return null;
    const birth = new Date(birthDateStr);
    const ref = new Date(refDateStr);
    let age = ref.getFullYear() - birth.getFullYear();
    const m = ref.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && ref.getDate() < birth.getDate())) age--;
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

  // Fetch user info
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
        console.log('User info:', data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        setLoggedInUser({
          fullName: data.fullName || '',
          phoneNumber: data.phone || '',
          email: data.email || '',
          address: data.address || '',
          gender: 'Nam',
          birthDate: ''
        });
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) navigate('/login');
      }
    };
    fetchUserInfo();
  }, [bookingId, tourInfo, navigate]);

  // Set contactInfo from loggedInUser
  useEffect(() => {
    if (useLoggedInInfo && loggedInUser.fullName && !hasInitializedContactInfo.current) {
      setContactInfo(loggedInUser);
      hasInitializedContactInfo.current = true;
    }
  }, [loggedInUser, useLoggedInInfo]);

  // Tính tổng giá
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

  // Xử lý toggle thông tin cá nhân
  const handleToggleUserInfo = () => {
    setUseLoggedInInfo(prev => {
      const newVal = !prev;
      if (!prev) {
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
      return newVal;
    });
  };

  // Xử lý thay đổi thông tin liên hệ
  const handleContactInfoChange = (newContactInfo) => {
    setContactInfo(newContactInfo);
  };

  // Xử lý thay đổi số lượng hành khách
  const handlePassengerCountChange = (type, operation) => {
    setPassengerCounts(prev => {
      const totalCurrent = prev.adult + prev.child + prev.infant;
      const max = bookedTour?.maxParticipants || 99;
      let newCount = operation === 'add'
        ? prev[type] + 1
        : Math.max(type === 'adult' ? 1 : 0, prev[type] - 1);
      if (operation === 'add' && totalCurrent + 1 > max) {
        toast.error(`Số lượng khách không được vượt quá ${max} người!`);
        return prev;
      }
      setAdditionalPassengers(prevDetails => {
        let updated = [...prevDetails[type]];
        if (operation === 'add') {
          updated.push({ fullName: '', gender: 'Nam', birthDate: '', guardianIndex: 0, phoneNumber: '', address: '', email: '' });
        }
        updated = type === 'adult' ? updated.slice(0, newCount - 1) : updated.slice(0, newCount);
        if (type === 'adult' && newCount === 1) {
          return { ...prevDetails, adult: [] };
        }
        return { ...prevDetails, [type]: updated };
      });
      return { ...prev, [type]: newCount };
    });
  };

  // Cập nhật hành khách phụ
  const handleAdditionalPassengerChange = (type, index, newValue) => {
    setAdditionalPassengers(prev => {
      const updated = prev[type].map((item, idx) => idx === index ? newValue : item);
      return { ...prev, [type]: updated };
    });
  };

  // Toggle hiển thị note
  const toggleDestinationNote = (destinationId) => {
    setExpandedDestinationIds(prev =>
      prev.includes(destinationId) ? prev.filter(id => id !== destinationId) : [...prev, destinationId]
    );
  };
  const toggleEventNote = (eventId) => {
    setExpandedEventIds(prev =>
      prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]
    );
  };

  // Validation
  const validateData = () => {
    const contactErr = {};
    const passengerErr = { adult: [], child: [], infant: [] };
    if (!contactInfo.fullName?.trim()) contactErr.fullName = 'Họ tên không được để trống';
    if (!contactInfo.email?.trim()) contactErr.email = 'Email không được để trống';
    if (!contactInfo.phoneNumber?.trim()) contactErr.phoneNumber = 'Số điện thoại không được để trống';
    if (!contactInfo.birthDate) contactErr.birthDate = 'Ngày sinh không được để trống';
    if (!contactInfo.address?.trim()) contactErr.address = 'Địa chỉ không được để trống';
    if (contactInfo.birthDate && selectedDate) {
      const age = getAgeAtDate(contactInfo.birthDate, selectedDate);
      if (age === null || isNaN(age)) contactErr.birthDate = 'Ngày sinh người liên hệ không hợp lệ';
      else if (age < 16) contactErr.birthDate = 'Người liên hệ phải trên 16 tuổi tại ngày khởi hành';
    }
    ['adult', 'child', 'infant'].forEach(type => {
      additionalPassengers[type].forEach((p, idx) => {
        const err = {};
        if (!p.fullName?.trim()) err.fullName = `Vui lòng nhập tên cho ${type === 'adult' ? `Người lớn ${idx+2}` : type === 'child' ? `Trẻ em ${idx+1}` : `Em bé ${idx+1}`}`;
        if (!p.birthDate) err.birthDate = `Vui lòng nhập ngày sinh cho ${type === 'adult' ? `Người lớn ${idx+2}` : type === 'child' ? `Trẻ em ${idx+1}` : `Em bé ${idx+1}`}`;
        else if (selectedDate) {
          const age = getAgeAtDate(p.birthDate, selectedDate);
          if (age === null || isNaN(age)) err.birthDate = `Ngày sinh của ${type === 'adult' ? `Người lớn ${idx+2}` : type === 'child' ? `Trẻ em ${idx+1}` : `Em bé ${idx+1}`} không hợp lệ`;
          else if (type === 'adult' && age < 16) err.birthDate = `Người lớn ${idx+2} phải trên 16 tuổi tại ngày khởi hành`;
          else if (type === 'child' && (age < 2 || age >= 16)) err.birthDate = `Trẻ em ${idx+1} phải từ 2 đến dưới 16 tuổi tại ngày khởi hành`;
          else if (type === 'infant' && age >= 2) err.birthDate = `Em bé ${idx+1} phải dưới 2 tuổi tại ngày khởi hành`;
        }
        if (type === 'adult') {
          if (!p.phoneNumber?.trim()) err.phoneNumber = `Vui lòng nhập số điện thoại cho Người lớn ${idx+2}`;
          if (!p.address?.trim()) err.address = `Vui lòng nhập địa chỉ cho Người lớn ${idx+2}`;
        }
        passengerErr[type][idx] = err;
      });
    });
    return { contactErr, passengerErr };
  };

  // Xử lý submit
  const handleSubmitPassengers = async () => {
    const { contactErr, passengerErr } = validateData();
    setContactErrors(contactErr);
    setPassengerErrors(passengerErr);
    if (Object.keys(contactErr).length > 0 || Object.values(passengerErr).some(arr => arr.some(e => Object.keys(e).length > 0))) {
      return;
    }
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      const publicId = localStorage.getItem('publicId');
      if (!token || !publicId) return navigate('/login');
      const normalizeValue = v => v?.trim() ? v.trim() : null;
      const contactToSend = {
        ...contactInfo,
        address: normalizeValue(contactInfo.address),
        phoneNumber: normalizeValue(contactInfo.phoneNumber),
        email: normalizeValue(contactInfo.email),
        fullName: normalizeValue(contactInfo.fullName),
      };
      const passengerDetails = [
        ...additionalPassengers.adult.map(p => ({
          ...p,
          passengerType: 'adult',
          address: normalizeValue(p.address),
          phoneNumber: normalizeValue(p.phoneNumber),
          email: normalizeValue(p.email),
          fullName: normalizeValue(p.fullName),
        })),
        ...additionalPassengers.child.map(p => ({
          ...p,
          passengerType: 'child',
          address: normalizeValue(p.address),
          phoneNumber: normalizeValue(p.phoneNumber),
          fullName: normalizeValue(p.fullName),
          guardianIndex: p.guardianIndex || 0
        })),
        ...additionalPassengers.infant.map(p => ({
          ...p,
          passengerType: 'infant',
          address: normalizeValue(p.address),
          phoneNumber: normalizeValue(p.phoneNumber),
          fullName: normalizeValue(p.fullName),
          guardianIndex: p.guardianIndex || 0
        })),
      ];
      const rawPhone = contactInfo.phoneNumber;
      const phoneToSend = rawPhone.startsWith('0') ? ('+84' + rawPhone.slice(1)) : ('+84' + rawPhone);
      const bookingPassengerRequest = {
        bookingId,
        publicId,
        contactInfo: contactToSend,
        passengers: passengerCounts,
        passengerDetails,
        discountCode: discountCode || null,
        discountedPrice: discountedPrice || null
      };
      const res = await axios.post('http://localhost:8080/api/booking-passengers/submit', bookingPassengerRequest, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      toast.success('Đăng ký thông tin hành khách thành công!');
      const adultPrice = bookedTour.price;
      const childPrice = bookedTour.price * 0.5;
      const infantPrice = bookedTour.price * 0.25;
      const totalBeforeDiscount =
        (passengerCounts.adult * adultPrice) +
        (passengerCounts.child * childPrice) +
        (passengerCounts.infant * infantPrice);
      let finalPrice = totalBeforeDiscount;
      if (discountInfo && discountInfo.discountPercent) {
        finalPrice = Math.round(totalBeforeDiscount - (totalBeforeDiscount * discountInfo.discountPercent / 100));
      }
      // Lấy userId từ localStorage user info (nếu đã fetch trước đó)
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const userId = userInfo.id || userInfo.userid || undefined;
      navigate('/booking-confirmation', {
        state: {
          bookingId,
          bookingCode,
          passengers: res.data,
          tourInfo: bookedTour,
          finalPrice,
          basePrice: bookedTour.price,
          itineraries,
          passengerCounts,
          contactInfo,
          userId: userId
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

  // Áp dụng mã giảm giá
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
        setDiscountedPrice(bookedTour?.price || 0);
        setDiscountError('Mã giảm giá không hợp lệ hoặc đã hết hạn');
      }
    }
  };

  // Log contactInfo để debug
  useEffect(() => {
    console.log('contactInfo:', contactInfo);
  }, [contactInfo]);

  // Thêm hàm clearFieldError
  const clearFieldError = (field, idx, type, isContact) => {
    if (isContact) {
      setContactErrors(prev => {
        if (!prev[field]) return prev;
        const newErr = { ...prev };
        delete newErr[field];
        return newErr;
      });
    } else {
      setPassengerErrors(prev => {
        const arr = [...prev[type]];
        if (!arr[idx] || !arr[idx][field]) return prev;
        arr[idx] = { ...arr[idx] };
        delete arr[idx][field];
        return { ...prev, [type]: arr };
      });
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
        <div className={styles.mainContent}>
          <h1 className={styles.pageTitle}>Thông tin đặt tour</h1>
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Thông tin người liên hệ</h2>
            <PassengerForm
              value={contactInfo}
              onChange={handleContactInfoChange}
              type="adult"
              index={-1}
              isContact={true}
              errors={contactErrors}
              clearFieldError={clearFieldError}
            />
          </div>
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Thông tin hành khách</h2>
            {additionalPassengers.adult.map((p, index) => (
              <PassengerForm
                key={`adult-${index}`}
                value={p}
                onChange={newVal => handleAdditionalPassengerChange('adult', index, newVal)}
                type="adult"
                index={index}
                isContact={false}
                errors={passengerErrors.adult[index] || {}}
                clearFieldError={clearFieldError}
              />
            ))}
            {additionalPassengers.child.map((p, index) => (
              <PassengerForm
                key={`child-${index}`}
                value={p}
                onChange={newVal => handleAdditionalPassengerChange('child', index, newVal)}
                type="child"
                index={index}
                isContact={false}
                guardianOptions={guardianOptions}
                errors={passengerErrors.child[index] || {}}
                clearFieldError={clearFieldError}
              />
            ))}
            {additionalPassengers.infant.map((p, index) => (
              <PassengerForm
                key={`infant-${index}`}
                value={p}
                onChange={newVal => handleAdditionalPassengerChange('infant', index, newVal)}
                type="infant"
                index={index}
                isContact={false}
                guardianOptions={guardianOptions}
                errors={passengerErrors.infant[index] || {}}
                clearFieldError={clearFieldError}
              />
            ))}
          </div>
        </div>
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
              {bookedTour && (
                <div className={styles.priceBreakdownBox}>
                  <div className={styles.priceBreakdownTitle}>Chi tiết giá:</div>
                  <div className={styles.priceRow}>
                    <span>Giá tour:</span>
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
                      <span>Người lớn:</span>
                      <span>{getDiscountedPrice(bookedTour.price).toLocaleString('vi-VN')} đ</span>
                    </div>
                  )}
                  {passengerCounts.child > 0 && (
                    <div className={styles.priceBreakdownRow}>
                      <span>Trẻ em:</span>
                      <span>{getDiscountedPrice(bookedTour.price, 0.5).toLocaleString('vi-VN')} đ</span>
                    </div>
                  )}
                  {passengerCounts.infant > 0 && (
                    <div className={styles.priceBreakdownRow}>
                      <span>Em bé:</span>
                      <span>{getDiscountedPrice(bookedTour.price, 0.25).toLocaleString('vi-VN')} đ</span>
                    </div>
                  )}
                </div>
              )}
              <div className={styles.priceSection}>
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
                <div className={styles.priceRow} style={{ marginTop: 12 }}>
                  <span>Tổng cộng:</span>
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
                <div className={styles.submitButtonWrapper}>
                  <button onClick={handleSubmitPassengers} className={styles.submitButton} disabled={isSubmitting}>
                    {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đặt'}
                  </button>
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