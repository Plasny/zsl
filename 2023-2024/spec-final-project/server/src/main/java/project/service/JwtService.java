package project.service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private static final Key SIGNING_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS512);

    public static String generateToken(String username, long expiration_time) {

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration_time);

        Map<String, Object> claims = new HashMap<>();
        claims.put("username", username);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(SIGNING_KEY, SignatureAlgorithm.HS512)
                .compact();
    }

    public static Boolean validateToken(String token, UserDetails userDetails) {
        Date expirationDate = getExpirationDateFromToken(token);
        assert expirationDate != null;
        if (expirationDate.before(new Date())) {
            return false;
        }
        String username = getUsernameFromToken(token);
        return userDetails.getUsername().equals(username) && !expirationDate.before(new Date());
    }

    public static String getUsernameFromToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(SIGNING_KEY)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return claims.get("username", String.class);
        } catch (ExpiredJwtException e) {
            // Token expired
            return "";
        }
    }

    public static Date getExpirationDateFromToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(SIGNING_KEY)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return claims.get("exp", Date.class);
        } catch (ExpiredJwtException e) {
            // Token has expired
            return null;
        }
    }
}
