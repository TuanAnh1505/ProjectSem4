
package com.example.api.repository;

import com.example.api.model.TourGuide;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TourGuideRepository extends JpaRepository<TourGuide, Integer> {
    @Query("SELECT tg FROM TourGuide tg WHERE tg.userId = :userid")
    Optional<TourGuide> findByUserId(@Param("userid") Long userId);
}


