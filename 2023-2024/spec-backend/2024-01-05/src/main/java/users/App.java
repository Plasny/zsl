package users;

import static spark.Spark.*;

import java.util.ArrayList;

import com.google.gson.Gson;

import users.controller.UserServiceImpl;
import users.model.User;

public class App {
    private static UserServiceImpl userServiceImpl = new UserServiceImpl();
    private static Gson gson = new Gson();

    public static void main(String[] args) {
        get("/api/users", (req, res) -> {
            res.header("Content-Type", "application/json");
            return gson.toJson(userServiceImpl.getAllUsers(), ArrayList.class);
        });

        get("/api/users/:id", (req, res) -> {
            String toFind = req.params("id");
            res.header("Content-Type", "application/json");
            User user = userServiceImpl.getUser(toFind);

            if (user == null) {
                res.status(404);
                return "User not found";
            }

            return gson.toJson(user, User.class);
        });

        post("/api/users", (req, res) -> {
            User user = gson.fromJson(req.body(), User.class);
            userServiceImpl.addUser(user);
            res.status(201);
            return "";
        });

        put("/api/users", (req, res) -> {
            User user = gson.fromJson(req.body(), User.class);
            userServiceImpl.editUser(user);
            res.status(201);
            return "";
        });

        options("/api/users/:id", (req, res) -> {
            String toFind = req.params("id");
            Boolean exists = userServiceImpl.userExist(toFind);

            if (exists) {
                res.status(200);
                return "";
            } else {
                res.status(204);
                return "";
            }
        });

        delete("/api/users/:id", (req, res) -> {
            String toFind = req.params("id");
            userServiceImpl.deleteUser(toFind);
            res.status(204);
            return "";
        });
    }

}
