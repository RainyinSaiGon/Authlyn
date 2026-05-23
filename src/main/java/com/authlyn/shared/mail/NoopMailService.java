package com.authlyn.shared.mail;

import org.springframework.stereotype.Service;

@Service
public class NoopMailService implements MailService {

    @Override
    public void send(MailMessage message) {
        // Intentionally blank: mail delivery is stubbed in this phase.
    }
}