package com.example.api.dto;

import java.util.List;
import lombok.Data;

@Data
public class TourItineraryDTO {
    private Integer itineraryId;
    private Integer tourId;
    private String title;
    private String description;

    @Data
    public static class DestinationDetail {
        private Integer destinationId;
        private Integer visitOrder;
        private String note;
        private String name; // for display purposes
    }

    @Data
    public static class EventDetail {
        private Integer eventId;
        private String attendTime;
        private String note;
        private String name; // for display purposes
    }

    private List<DestinationDetail> destinations;
    private List<EventDetail> events;
}
