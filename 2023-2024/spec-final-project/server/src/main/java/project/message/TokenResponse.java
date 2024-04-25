package project.message;

public class TokenResponse {
    public String message;
    public String token;

    public TokenResponse(final String token) {
        this.message = "ok";
        this.token = token;
    }

    public TokenResponse(final String token, final String message) {
        this.message = message;
        this.token = token;
    }
}
