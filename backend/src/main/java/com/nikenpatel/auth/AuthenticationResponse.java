package com.nikenpatel.auth;

import com.nikenpatel.customer.CustomerDTO;

public record AuthenticationResponse (
        String token,
        CustomerDTO customerDTO){
}
