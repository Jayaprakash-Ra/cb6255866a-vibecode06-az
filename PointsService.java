package com.smartbin.service;

import com.smartbin.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PointsService {

    private static final Logger logger = LoggerFactory.getLogger(PointsService.class);

    @Autowired
    private UserService userService;

    public void awardPoints(User user, int points, String reason) {
        if (user == null) {
            logger.warn("Attempted to award points to null user");
            return;
        }

        if (points <= 0) {
            logger.warn("Attempted to award non-positive points: {}", points);
            return;
        }

        try {
            int oldPoints = user.getPoints();
            userService.addPointsToUser(user, points);
            
            logger.info("Awarded {} points to user {} ({}). Old balance: {}, New balance: {}", 
                       points, user.getUsername(), reason, oldPoints, user.getPoints());
        } catch (Exception e) {
            logger.error("Failed to award points to user: {}", user.getUsername(), e);
            throw new RuntimeException("Failed to award points: " + e.getMessage(), e);
        }
    }

    public boolean canRedeem(User user, int pointsCost) {
        return user != null && user.getPoints() >= pointsCost;
    }

    public void redeemPoints(User user, int pointsCost, String item) {
        if (!canRedeem(user, pointsCost)) {
            throw new RuntimeException("Insufficient points for redemption");
        }

        try {
            int oldPoints = user.getPoints();
            user.setPoints(oldPoints - pointsCost);
            userService.updateUser(user);
            
            logger.info("User {} redeemed {} points for {}. Old balance: {}, New balance: {}", 
                       user.getUsername(), pointsCost, item, oldPoints, user.getPoints());
        } catch (Exception e) {
            logger.error("Failed to redeem points for user: {}", user.getUsername(), e);
            throw new RuntimeException("Failed to redeem points: " + e.getMessage(), e);
        }
    }

    public int getUserPoints(User user) {
        return user != null ? user.getPoints() : 0;
    }

    // Standard point values for different actions
    public static final int POINTS_REPORT_SUBMISSION = 15;
    public static final int POINTS_QR_SCAN = 10;
    public static final int POINTS_EDUCATION_COMPLETE = 20;
    public static final int POINTS_PROPER_DISPOSAL = 25;
    public static final int POINTS_COMMUNITY_CLEANUP = 50;
    public static final int POINTS_REFERRAL = 30;
} 