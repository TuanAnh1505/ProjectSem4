    package com.example.api.dto;

    import lombok.Data;
    import lombok.NoArgsConstructor;
    import lombok.AllArgsConstructor;
    import java.util.List;
    import com.fasterxml.jackson.annotation.JsonProperty;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public class BookingPassengerRequestDTO {
        private Integer bookingId;
        private String publicId;
        private ContactInfo contactInfo;
        private PassengerCounts passengers;
        private List<PassengerDetailDTO> passengerDetails;



        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class ContactInfo {
            private String fullName;
            private String phoneNumber;
            private String email;
            private String address;
            @JsonProperty("gender")
            private String gender;
            @JsonProperty("birthDate")
            private String birthDate;
        }

        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class PassengerCounts {
            private int adult;
            private int child;
            private int infant;
        }
    }
