package com.example.api.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.api.model.Discount;
import com.example.api.model.User;
import com.example.api.repository.DiscountRepository;
import com.example.api.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DiscountService {

    private final DiscountRepository discountRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public void sendDiscountCodeToUser(Long userId, Integer discountId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        Discount discount = discountRepository.findById(discountId)
                .orElseThrow(() -> new RuntimeException("Mã giảm giá không tồn tại"));

        emailService.sendDiscountCodeEmail(user.getEmail(), discount.getCode(), discount.getDescription());
    }

    public java.util.Optional<Discount> getDiscountByCode(String code) {
        return discountRepository.findByCode(code);
    }

    @Transactional
    public boolean checkAndUpdateDiscountQuantity(Discount discount) {
        if (discount.getUsedQuantity() == null) discount.setUsedQuantity(0);
        if (discount.getQuantity() != null && discount.getUsedQuantity() >= discount.getQuantity()) {
            return false;
        }
        discount.setUsedQuantity(discount.getUsedQuantity() + 1);
        discountRepository.save(discount);
        return true;
    }

    public boolean isDiscountAvailable(Discount discount) {
        if (discount.getQuantity() == null) return true;
        if (discount.getUsedQuantity() == null) discount.setUsedQuantity(0);
        return discount.getUsedQuantity() < discount.getQuantity();
    }
}
