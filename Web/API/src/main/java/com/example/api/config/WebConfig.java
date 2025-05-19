package com.example.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000", "http://192.168.0.101:8080", "http://localhost:8080", "http://10.0.2.2:8080")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String uploadPath = System.getProperty("user.dir") + File.separator + "uploads";
        registry.addResourceHandler("/uploads/**", "/uploads/tours/**")
                .addResourceLocations("file:" + uploadPath + File.separator,
                        "file:" + uploadPath + File.separator + "tours" + File.separator)
                .setCachePeriod(3600)
                .resourceChain(true);
    }
}
