package com.smartbin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SmartBinTrackerApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartBinTrackerApplication.class, args);
    }
} 