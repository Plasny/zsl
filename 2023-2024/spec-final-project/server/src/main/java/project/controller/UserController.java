package project.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import project.dto.UserRequestDto;
import project.message.ResponseMessage;
import project.message.TokenResponse;
import project.model.User;
import project.service.JwtService;
import project.service.UserService;

// @RestController
@Controller
@Validated
public class UserController {
    private final UserService userService;
    private final static long LOGIN_TOKEN_EXPIRATION_TIME = 360 * 86400000;

    UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @GetMapping("/register")
    public String registerPage() {
        return "register";
    }

    @PostMapping("/api/users")
    public ResponseEntity<ResponseMessage> createUser(final @Valid @RequestBody UserRequestDto userRequestDto) {
        System.out.println("User " + userRequestDto.username + " created");

        return new ResponseEntity<>(
                this.userService.createUser(userRequestDto),
                HttpStatus.CREATED);
    }

    @PostMapping("/api/login")
    public ResponseEntity<?> login(final @Valid @RequestBody UserRequestDto userReq) {
        User user = userService.getUserByUsername(userReq.username);

        if (user == null) {
            return new ResponseEntity<>(
                    new ResponseMessage("wrong username or password"),
                    HttpStatus.UNAUTHORIZED);
        }

        boolean ok = userService.canLogin(user, userReq.password);

        if (!ok) {
            return new ResponseEntity<>(
                    new ResponseMessage("wrong username or password"),
                    HttpStatus.UNAUTHORIZED);
        }

        System.out.println("User " + user.username + " logged in");

        String token = JwtService.generateToken(
                user.username,
                LOGIN_TOKEN_EXPIRATION_TIME);

        return new ResponseEntity<>(
                new TokenResponse(token),
                HttpStatus.OK);
    }
}
