package com.example.api.config;

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
                .allowedOrigins("http://localhost:3000")
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

        registry.addResourceHandler("/uploads/media/**")
                .addResourceLocations("file:uploads/media/");
    }
}
