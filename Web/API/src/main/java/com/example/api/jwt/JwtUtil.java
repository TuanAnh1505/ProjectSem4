package com.example.api.jwt;

import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Date;
import java.util.Set;
@Component
public class JwtUtil {
    private final PrivateKey privateKey;
    private final PublicKey publicKey;
    private final long expiration = 86400000; // 24h

    public JwtUtil(@Value("${jwt.private-key}") String privateKeyStr,
                   @Value("${jwt.public-key}") String publicKeyStr) throws Exception {
        String privateKeyPEM = privateKeyStr
                .replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "")
                .replaceAll("\\s", "");
        byte[] privateKeyBytes = Base64.getDecoder().decode(privateKeyPEM);
        PKCS8EncodedKeySpec privateKeySpec = new PKCS8EncodedKeySpec(privateKeyBytes);

        String publicKeyPEM = publicKeyStr
                .replace("-----BEGIN PUBLIC KEY-----", "")
                .replace("-----END PUBLIC KEY-----", "")
                .replaceAll("\\s", "");
        byte[] publicKeyBytes = Base64.getDecoder().decode(publicKeyPEM);
        X509EncodedKeySpec publicKeySpec = new X509EncodedKeySpec(publicKeyBytes);

        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        this.privateKey = keyFactory.generatePrivate(privateKeySpec);
        this.publicKey = keyFactory.generatePublic(publicKeySpec);
    }

    public String generateToken(String email, Set<String> roles) {
        return Jwts.builder()
                .subject(email)
                .claim("roles", roles)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(privateKey)
                .compact();
    }

    public String getEmailFromToken(String token) {
        return Jwts.parser()
                .verifyWith(publicKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(publicKey)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}

