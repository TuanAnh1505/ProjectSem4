import React from "react";
import styles from "./TourBooking.module.css";
import TourBookingHeader from "./TourBookingHeader";
import TourBookingSteps from "./TourBookingSteps";
import TourBookingForm from "./TourBookingForm";
import TourSummary from "./TourSummary";
import PaymentOptions from "./PaymentOptions";
import TermsAndConditions from "./TermsAndConditions";
import Footer from "./Footer";

const TourBooking = () => {
  return (
    <div className={styles.pay}>
      <TourBookingHeader />
      <TourBookingSteps />
      <div className={styles.div12}>
        <div className={styles.thngtinlinlc}>Thông tin liên lạc</div>
        <div className={styles.tmttchuyni}>Tóm tắt chuyến đi</div>
      </div>
      <div className={styles.div13}>
        <div className={styles.div14}>
          <TourBookingForm />
          <TourSummary />
        </div>
      </div>
      <PaymentOptions />
      <TermsAndConditions />
      <Footer />
    </div>
  );
};

export default TourBooking;
