import React from "react";
import styles from "./TourBooking.module.css";

const PaymentOptions = () => {
  return (
    <>
      <div className={styles.divbookingContainerBlockbookingNoteIpt}>
        Vui lòng nhập nội dung lời nhắn bằng tiếng Anh hoặc tiếng Việt
      </div>
      <div className={styles.cchnhthcthanhton}>Các hình thức thanh toán</div>
      <div className={styles.divcollapsecollapseCheckbox}>
        <div className={styles.div98}>
          <div className={styles.tinmt}>Tiền mặt</div>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/3b25dbe71d20da5a245bbc2ab5d43cbc760c98b3?apiKey=b83079aa3b064aefaad9423de3864312&"
            className={styles.img24}
            alt="Cash"
          />
        </div>
        <input type="checkbox" className={styles.input1} />
      </div>
      <div className={styles.divcollapsecollapseCheckbox2}>
        <div className={styles.div99}>
          <div className={styles.chuynkhon}>Chuyển khoản</div>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/cde89ec8668453fb9d9000ed7017475af57fb876?apiKey=b83079aa3b064aefaad9423de3864312&"
            className={styles.img25}
            alt="Bank transfer"
          />
        </div>
        <input type="checkbox" className={styles.input2} />
      </div>
      <div className={styles.divcollapsecollapseCheckbox3}>
        <div className={styles.div100}>
          <div className={styles.thanhtonbngZaloPay}>
            Thanh toán bằng ZaloPay
          </div>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/6808a56671d9cce79fbd3ca9e8fedebd1de19a62?apiKey=b83079aa3b064aefaad9423de3864312&"
            className={styles.img26}
            alt="ZaloPay"
          />
        </div>
        <input type="checkbox" className={styles.input9} />
      </div>
      <div className={styles.divcollapsecollapseCheckbox4}>
        <div className={styles.div101}>
          <div className={styles.thtndng}>Thẻ tín dụng</div>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/54db5625a8600d1637cbe8bc76ddff73c534289c?apiKey=b83079aa3b064aefaad9423de3864312&"
            className={styles.img27}
            alt="Credit card"
          />
        </div>
        <input type="checkbox" className={styles.input15} />
      </div>
      <div className={styles.divcollapsecollapseCheckbox5}>
        <div className={styles.div102}>
          <div className={styles.thanhtonVnpay}>Thanh toán VNPAY</div>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/46469636f839a0137e0a07401167d5b5c9133be9?apiKey=b83079aa3b064aefaad9423de3864312&"
            className={styles.img28}
            alt="VNPAY"
          />
        </div>
        <input type="checkbox" className={styles.input16} />
      </div>
      <div className={styles.divcollapsecollapseCheckbox6}>
        <div className={styles.div103}>
          <div className={styles.thanhtonbngMoMo}>Thanh toán bằng MoMo</div>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/540684bd11b7482cbc2dc74299173efd/4948a70ba10fbb310b0989851899e11589796bf7?apiKey=b83079aa3b064aefaad9423de3864312&"
            className={styles.img29}
            alt="MoMo"
          />
        </div>
        <input type="checkbox" className={styles.input17} />
      </div>
    </>
  );
};

export default PaymentOptions;
