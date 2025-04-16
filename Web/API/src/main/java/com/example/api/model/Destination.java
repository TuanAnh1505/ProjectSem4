
package com.example.api.model;

import jakarta.persistence.*;
import lombok.*;


import java.time.LocalDateTime;
@Getter
@Setter
@Entity
@Table(name = "destinations")
@Data
public class Destination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer destinationid;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    @Enumerated(EnumType.STRING)
    private FileType filetype;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String location;

    @Column(columnDefinition = "FLOAT DEFAULT 0")
    private Float rating;

    @Column(name = "createdat", columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdat;

    public enum FileType {
        image, video
    }

    public Integer getDestinationid() {
        return destinationid;
    }

    public void setDestinationid(Integer destinationid) {
        this.destinationid = destinationid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public FileType getFiletype() {
        return filetype;
    }

    public void setFiletype(FileType filetype) {
        this.filetype = filetype;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Float getRating() {
        return rating;
    }

    public void setRating(Float rating) {
        this.rating = rating;
    }

    public LocalDateTime getCreatedat() {
        return createdat;
    }

    public void setCreatedat(LocalDateTime createdat) {
        this.createdat = createdat;
    }
}
