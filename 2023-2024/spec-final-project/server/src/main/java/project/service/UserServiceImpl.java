package project.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import project.dto.UserRequestDto;
import project.message.ResponseMessage;
import project.model.User;
import project.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {
    private static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Autowired
    private UserRepository userRepository;

    UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public ResponseMessage createUser(final UserRequestDto user) {
        userRepository.save(new User(user.username, encoder.encode(user.password)));
        return new ResponseMessage("ok");
    }

    @Override
    public User getUserByUsername(final String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public boolean canLogin(final User user, final String password) {
        return encoder.matches(password, user.passwordHash);
    }
}
