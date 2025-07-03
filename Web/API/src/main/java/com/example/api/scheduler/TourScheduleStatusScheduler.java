package com.example.api.scheduler;

import com.example.api.model.TourSchedule;
import com.example.api.repository.TourScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class TourScheduleStatusScheduler {
    private final TourScheduleRepository tourScheduleRepository;

   
    @Scheduled(cron = "0 5 0 * * ?")
    public void updateClosedSchedules() {
        LocalDate today = LocalDate.now();
        List<TourSchedule> schedules = tourScheduleRepository.findAll();
        for (TourSchedule schedule : schedules) {
            if ((schedule.getStatus() == TourSchedule.Status.available || schedule.getStatus() == TourSchedule.Status.full)
                    && !today.isBefore(schedule.getStartDate())) {
                schedule.setStatus(TourSchedule.Status.closed);
                tourScheduleRepository.save(schedule);
            }
        }
    }
} 