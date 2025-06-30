package com.example.api.repository;

import com.example.api.model.ScheduleChangeRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ScheduleChangeRequestRepository extends JpaRepository<ScheduleChangeRequest, Integer> {
    
    List<ScheduleChangeRequest> findByGuideIdOrderByRequestedAtDesc(Integer guideId);
    
    List<ScheduleChangeRequest> findByStatusOrderByUrgencyLevelDescRequestedAtAsc(ScheduleChangeRequest.Status status);
    
    List<ScheduleChangeRequest> findAllByOrderByRequestedAtDesc();
    
    List<ScheduleChangeRequest> findByScheduleIdOrderByRequestedAtDesc(Integer scheduleId);
    
    List<ScheduleChangeRequest> findByUrgencyLevelAndStatus(ScheduleChangeRequest.UrgencyLevel urgencyLevel, ScheduleChangeRequest.Status status);
} 