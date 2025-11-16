package com.FSP.BackEnd;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class BackEndApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackEndApplication.class, args);
    }

    // ✅ Enable CORS globally
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") 
                        // CRITICAL FIX: Allow all origins (*) since the ALB is the front-end. 
                        // The old 'localhost' setting caused startup delay/failure in the cloud.
                        .allowedOrigins("*") 
                        .allowedMethods("*")
                        .allowedHeaders("*");
            }
        };
    }
}
