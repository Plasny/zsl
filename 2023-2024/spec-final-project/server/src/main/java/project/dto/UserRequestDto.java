package project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class UserRequestDto {
    @NotBlank(message = "Nazwa użytkownika nie może być pusta.")
    public String username;

    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$", message = "Hasło musi zawierać conajmniej 8 znaków w tym cyfry, małe i duże litery.")
    public String password;

    UserRequestDto() {}

    UserRequestDto(String username, String password) {
        this.username = username;
        this.password = password;
    }
}
