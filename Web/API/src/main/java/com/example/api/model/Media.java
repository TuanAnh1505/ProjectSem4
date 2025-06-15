package com.example.api.model;

import java.time.LocalDateTime;
import lombok.Data;
import jakarta.persistence.*;

@Table(name = "media")
@Entity
@Data
public class Media {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "media_id")
    private Long mediaId;

    @ManyToOne
    @JoinColumn(name = "userid")
    private User user;

    @Column(name = "experience_id")
    private Long experienceId;

    @Column(name = "file_type")
    private String fileType; // "image" or "video"

    @Column(name = "file_url")
    private String fileUrl;

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt = LocalDateTime.now();
    // getters, setters
    

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}