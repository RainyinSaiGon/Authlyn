package com.authlyn.shared.mail;

import java.util.Map;

public record MailMessage(
        String to,
        String subject,
        String templateName,
        Map<String, Object> variables
) {}