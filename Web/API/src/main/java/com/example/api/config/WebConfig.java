package com.example.api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

        private static final Logger logger = LoggerFactory.getLogger(WebConfig.class);

        @Override
        public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                                .allowedOrigins("http://localhost:3000")
                                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                                .allowedHeaders("*")
                                .allowCredentials(true);

                registry.addMapping("/uploads/**")
                                .allowedOrigins("http://localhost:3000")
                                .allowedMethods("GET")
                                .allowedHeaders("*")
                                .allowCredentials(true);
        }

        @Override
        public void addResourceHandlers(ResourceHandlerRegistry registry) {
                
                String rootPath = System.getProperty("user.dir");

              
                File mediaDir = new File(rootPath, "uploads/media");
                if (!mediaDir.exists()) {
                        boolean created = mediaDir.mkdirs();
                        if (created) {
                                logger.info("Created media directory at: " + mediaDir.getAbsolutePath());
                        } else {
                                logger.error("Failed to create media directory at: " + mediaDir.getAbsolutePath());
                        }
                }

                File toursDir = new File(rootPath, "uploads/tours");
                if (!toursDir.exists()) {
                        boolean created = toursDir.mkdirs();
                        if (created) {
                                logger.info("Created tours directory at: " + toursDir.getAbsolutePath());
                        } else {
                                logger.error("Failed to create tours directory at: " + toursDir.getAbsolutePath());
                        }
                }

        
                logger.info("Root path: " + rootPath);
                logger.info("Media directory path: " + mediaDir.getAbsolutePath());
                logger.info("Tours directory path: " + toursDir.getAbsolutePath());

        
                registry.addResourceHandler("/uploads/media/**")
                                .addResourceLocations("file:" + mediaDir.getAbsolutePath() + File.separator)
                                .setCachePeriod(3600)
                                .resourceChain(true);

              
                registry.addResourceHandler("/uploads/tours/**")
                                .addResourceLocations("file:" + toursDir.getAbsolutePath() + File.separator)
                                .setCachePeriod(3600)
                                .resourceChain(true);

              
                logger.info("Resource handlers configured successfully");
        }
}
