import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const ActivateAccount = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const activateAccount = async () => {
      const userId = searchParams.get("userId");
      try {
        const response = await axios.get(`http://localhost:8080/api/auth/activate?userId=${userId}`);
        // Use the response data as the success message
        const successMessage = response.data || "Tài khoản đã được kích hoạt thành công";
        navigate(`/login?message=${encodeURIComponent(successMessage)}`);
      } catch (error) {
        const errorMessage = error.response?.data || "Có lỗi xảy ra khi kích hoạt tài khoản";
        console.error("Activation Error:", errorMessage); // Log the error for debugging
        navigate(`/login?message=${encodeURIComponent(errorMessage)}`);
      }
    };

    activateAccount();
  }, [searchParams, navigate]);

  return <p>Đang kích hoạt tài khoản...</p>;
};

export default ActivateAccount;
