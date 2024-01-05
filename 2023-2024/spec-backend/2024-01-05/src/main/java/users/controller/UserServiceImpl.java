package users.controller;

import java.util.ArrayList;
import java.util.HashMap;

import users.model.User;

public class UserServiceImpl implements UserService {
    HashMap<String, User> users = new HashMap<>();

    public ArrayList<User> getAllUsers() {
        ArrayList<User> list = new ArrayList<User>();
        list.addAll(users.values());
        return list;
    }

    @Override
    public void addUser(User user) {
        users.put(user.id, user);
    }

    @Override
    public User getUser(String id) {
        User user = users.get(id);
        return user;
    }

    @Override
    public void editUser(User user) {
        users.put(user.id, user);
    }

    @Override
    public void deleteUser(String id) {
        users.remove(id);
    }

    @Override
    public Boolean userExist(String id) {
        if (users.get(id) != null)
            return true;

        return false;
    }
}
