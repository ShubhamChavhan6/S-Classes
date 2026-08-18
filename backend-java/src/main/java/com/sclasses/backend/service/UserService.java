package com.sclasses.backend.service;

import com.sclasses.backend.model.User;
import com.sclasses.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public Optional<User> getUserById(String userId) {
        return userRepository.findById(userId);
    }

    public User updateProfile(String userId, User profileData) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (profileData.getName() != null) user.setName(profileData.getName());
        if (profileData.getQualification() != null) user.setQualification(profileData.getQualification());
        if (profileData.getStream() != null) user.setStream(profileData.getStream());
        if (profileData.getSchoolName() != null) user.setSchoolName(profileData.getSchoolName());
        if (profileData.getStudentType() != null) user.setStudentType(profileData.getStudentType());
        if (profileData.getGradeLevel() != null) user.setGradeLevel(profileData.getGradeLevel());
        if (profileData.getTargetExam() != null) user.setTargetExam(profileData.getTargetExam());
        if (profileData.getLanguagePref() != null) user.setLanguagePref(profileData.getLanguagePref());

        return userRepository.save(user);
    }
}
