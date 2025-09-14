package com.nikenpatel.auth;

public record AuthenticationRequest(
        String username,
        String password
) {
}
