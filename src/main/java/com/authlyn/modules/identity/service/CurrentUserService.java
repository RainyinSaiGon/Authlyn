package com.authlyn.modules.identity.service;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.authlyn.modules.identity.domain.UserEntity;
import com.authlyn.modules.identity.dto.MeResponse;
import com.authlyn.modules.identity.repository.UserJpaRepository;

@Service
public class CurrentUserService {

    private final UserJpaRepository userRepository;

    public CurrentUserService(UserJpaRepository userRepository) {
        this.userRepository = userRepository;
    }

    public MeResponse getCurrentUser(UUID userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return new MeResponse(user.getId(), user.getEmail(), user.isEmailVerified(),
                user.getDisplayName(), user.getCreatedAt());
    }
}
