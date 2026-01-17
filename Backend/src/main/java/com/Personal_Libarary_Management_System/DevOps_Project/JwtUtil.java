package com.Personal_Libarary_Management_System.DevOps_Project;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    private Key getSigningKey() {
        String normalized = secret != null ? secret.trim() : "";
        byte[] keyBytes;
        // Heuristic: decode Base64 only if it looks like Base64 (no commas/spaces and valid chars)
        boolean looksBase64 = normalized.matches("^[A-Za-z0-9+/=]+$") && (normalized.length() % 4 == 0);
        if (looksBase64) {
            try {
                keyBytes = Decoders.BASE64.decode(normalized);
            } catch (IllegalArgumentException ex) {
                // Fallback to raw bytes when decode fails
                keyBytes = normalized.getBytes(StandardCharsets.UTF_8);
            }
        } else {
            keyBytes = normalized.getBytes(StandardCharsets.UTF_8);
        }

        // Ensure at least 256 bits (32 bytes) per RFC 7518 for HS256
        if (keyBytes.length < 32) {
            try {
                MessageDigest md = MessageDigest.getInstance("SHA-256");
                keyBytes = md.digest(keyBytes);
            } catch (NoSuchAlgorithmException e) {
                // As a last resort, generate a secure random key
                return Keys.secretKeyFor(SignatureAlgorithm.HS256);
            }
        }

        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String username, Long userId) {
        return Jwts.builder()
                .setSubject(username)
                .claim("userId", userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    public Long extractUserId(String token) {
        return extractClaims(token).get("userId", Long.class);
    }

    public boolean isTokenValid(String token) {
        try {
            extractClaims(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}