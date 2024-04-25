package project.service;

import project.dto.UserRequestDto;
import project.message.ResponseMessage;
import project.model.User;

public interface UserService {
    ResponseMessage createUser(final UserRequestDto user);
    User getUserByUsername(final String username);
    boolean canLogin(final User user, final String password);
}
