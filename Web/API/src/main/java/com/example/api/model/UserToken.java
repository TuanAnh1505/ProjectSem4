package com.example.api.model;




import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "usertokens")
public class UserToken {
    

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer tokenid;

    @ManyToOne
    @JoinColumn(name = "userid")
    private User user;

    private String token;

    private LocalDateTime expiry;

    private LocalDateTime createdat;

    // Getters and Setters
    public Integer getTokenid() { return tokenid; }
    public void setTokenid(Integer tokenid) { this.tokenid = tokenid; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public LocalDateTime getExpiry() { return expiry; }
    public void setExpiry(LocalDateTime expiry) { this.expiry = expiry; }
    public LocalDateTime getCreatedat() { return createdat; }
    public void setCreatedat(LocalDateTime createdat) { this.createdat = createdat; }
}