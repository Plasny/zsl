package users.controller;

import users.model.User;

public interface UserService {
    void addUser(User user);

    User getUser(String id);

    void editUser(User user);

    void deleteUser(String id);

    Boolean userExist(String id);
}
