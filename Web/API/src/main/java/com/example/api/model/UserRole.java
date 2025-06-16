package com.example.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.io.Serializable;

@Entity
@Table(name = "userroles")
@IdClass(UserRole.UserRoleId.class)
@Data
public class UserRole implements Serializable {
    @Id
    private Long userid;
    @Id
    private Integer roleid;

    public UserRole() {}
    public UserRole(Long userid, Integer roleid) {
        this.userid = userid;
        this.roleid = roleid;
    }

    @Data
    public static class UserRoleId implements Serializable {
        private Long userid;
        private Integer roleid;
    }
} 