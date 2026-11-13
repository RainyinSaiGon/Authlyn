package com.authlyn.shared.ratelimit;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.web.util.matcher.IpAddressMatcher;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Resolves the real client IP for rate limiting.
 *
 * <p>{@code X-Forwarded-For} is client-controlled: anyone can send any value. It is only read
 * when the direct peer is a proxy listed in {@code authlyn.security.trusted-proxy-cidrs}. The
 * header is then walked right to left (each proxy appends the address it received the request
 * from), skipping trusted proxies; the first untrusted address is the client. With no trusted
 * proxies configured, the socket address is always used.
 */
@Component
public class ClientIpResolver {

    private final List<IpAddressMatcher> trustedProxies;

    public ClientIpResolver(@Value("${authlyn.security.trusted-proxy-cidrs:}") String trustedProxyCidrs) {
        this.trustedProxies = Arrays.stream(trustedProxyCidrs.split(","))
                .map(String::trim)
                .filter(cidr -> !cidr.isEmpty())
                .map(IpAddressMatcher::new)
                .toList();
    }

    public String resolve(HttpServletRequest request) {
        String peer = request.getRemoteAddr();
        if (!isTrusted(peer)) {
            return peer;
        }

        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded == null || forwarded.isBlank()) {
            return peer;
        }

        String[] hops = forwarded.split(",");
        for (int i = hops.length - 1; i >= 0; i--) {
            String hop = hops[i].trim();
            if (!hop.isEmpty() && !isTrusted(hop)) {
                return hop;
            }
        }
        return peer;
    }

    private boolean isTrusted(String address) {
        for (IpAddressMatcher matcher : trustedProxies) {
            try {
                if (matcher.matches(address)) {
                    return true;
                }
            } catch (IllegalArgumentException ex) {
                return false; // not a parseable IP: never trusted
            }
        }
        return false;
    }
}
