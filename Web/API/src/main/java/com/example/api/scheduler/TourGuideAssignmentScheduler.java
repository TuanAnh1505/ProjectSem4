package com.example.api.scheduler;

import com.example.api.service.TourGuideAssignmentService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class TourGuideAssignmentScheduler {

    private final TourGuideAssignmentService assignmentService;

    public TourGuideAssignmentScheduler(TourGuideAssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    // Chạy mỗi ngày lúc 1:00 sáng (giờ server)
    // @Scheduled(cron = "0 0 1 * * ?")
    @Scheduled(cron = "0 0 6 * * ?")
    public void autoUpdateAssignmentsDaily() {
        assignmentService.autoUpdateAllAssignments();
        System.out.println("Auto-updated assignment statuses at 1:00 AM");
    }
}
