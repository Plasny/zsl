package rest;

import static spark.Spark.*;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

import javax.servlet.MultipartConfigElement;
import javax.servlet.http.Part;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;

import rest.controller.PhotoService;
import rest.controller.PhotoServiceImpl;
import rest.model.Photo;
import rest.response.ResponseEntity;
import rest.response.ResponseStatus;

import spark.Request;
import spark.Response;

public class AppREST {
    private static Gson gson = new GsonBuilder().setPrettyPrinting().create();
    private static PhotoService ps = new PhotoServiceImpl();

    // if using with cars-app use "images" instead
    private static String uploadDir = "upload";

    public static void main(String[] args) {
        port(7777);

        post("/api/photos", (req, res) -> savePhoto(req, res));
        get("/api/photos", (req, res) -> getMapOfPhotos(req, res));
        get("/api/photos/:id", (req, res) -> getPhotoById(req, res));
        get("/api/photos/photo/:name", (req, res) -> getPhotoByName(req, res));
        delete("/api/photos/:id", (req, res) -> deletePhotoById(req, res));
        put("/api/photos/:id", (req, res) -> renamePhotoById(req, res));
        get("/api/photos/data/:id", (req, res) -> getPhotoStream(req, res));
    }

    private static String savePhoto(Request req, Response res) {
        req.attribute("org.eclipse.jetty.multipartConfig", new MultipartConfigElement("tmp"));
        res.type("application/json");

        File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

        try {
            Part filePart = req.raw().getPart("file");
            String fileName = filePart.getSubmittedFileName();
            InputStream fileStream = filePart.getInputStream();
            Path filePath = Paths.get(uploadDir, fileName);

            Files.copy(fileStream, filePath);
        } catch (Exception err) {
            System.out.println(err);
            res.status(500);
            return gson.toJson(new ResponseEntity(
                    ResponseStatus.ERROR,
                    "upload error"));
        }

        return gson.toJson(new ResponseEntity(
                    ResponseStatus.SUCCESS,
                    "upload successful"));

    }

    private static String getMapOfPhotos(Request req, Response res) {
        res.type("application/json");
        res.header("Access-Control-Allow-Origin", "*");

        try {
            ps.update(uploadDir);
        } catch (Exception e) {
            res.status(500);
            return gson.toJson(new ResponseEntity(
                    ResponseStatus.ERROR,
                    "cant read photo direcotry"));
        }

        Map<String, Photo> map = ps.getMapOfPhotos();

        return gson.toJson(new ResponseEntity(
                ResponseStatus.SUCCESS,
                "photos list",
                gson.toJsonTree(map)));
    }

    private static String getPhotoById(Request req, Response res) {
        res.type("application/json");
        res.header("Access-Control-Allow-Origin", "*");

        Photo p = ps.getPhotoById(req.params("id"));
        if (p == null) {
            res.status(404);
            return gson.toJson(new ResponseEntity(
                    ResponseStatus.NOT_FOUND,
                    "photo with id=" + req.params("id") + " not found"));
        }

        return gson.toJson(new ResponseEntity(
                ResponseStatus.SUCCESS,
                "photo found",
                gson.toJsonTree(p)));
    }

    private static String getPhotoByName(Request req, Response res) {
        res.type("application/json");
        res.header("Access-Control-Allow-Origin", "*");

        Photo p = ps.getPhotoByName(req.params("name"));
        if (p == null) {
            res.status(404);
            return gson.toJson(new ResponseEntity(
                    ResponseStatus.NOT_FOUND,
                    "photo with name=" + req.params("name") + " not found"));
        }

        return gson.toJson(new ResponseEntity(
                ResponseStatus.SUCCESS,
                "photo found",
                gson.toJsonTree(p)));
    }

    private static String deletePhotoById(Request req, Response res) {
        res.type("application/json");
        res.header("Access-Control-Allow-Origin", "*");

        boolean v = ps.deletePhotoById(req.params("id"));
        if (v == false) {
            res.status(500);
            return gson.toJson(new ResponseEntity(
                    ResponseStatus.ERROR,
                    "photo file delete error"));
        }

        return gson.toJson(new ResponseEntity(
                ResponseStatus.SUCCESS,
                "photo deleted"));
    }

    private static String renamePhotoById(Request req, Response res) {
        res.type("application/json");
        res.header("Access-Control-Allow-Origin", "*");

        String jsonString = req.body();
        JsonObject json = gson.fromJson(jsonString, JsonObject.class);

        boolean v = ps.renamePhotoById(req.params("id"), json.get("name").getAsString());
        if (v == false) {
            res.status(500);
            return gson.toJson(new ResponseEntity(
                    ResponseStatus.ERROR,
                    "photo file rename error"));
        }

        Photo photo = ps.getPhotoById(req.params("id"));

        return gson.toJson(new ResponseEntity(
                ResponseStatus.SUCCESS,
                "photo renamed",
                gson.toJsonTree(photo)));
    }

    private static String getPhotoStream(Request req, Response res) {
        res.header("Access-Control-Allow-Origin", "*");

        Photo p = ps.getPhotoById(req.params("id"));
        if (p == null) {
            res.type("application/json");
            res.status(404);

            return gson.toJson(new ResponseEntity(
                    ResponseStatus.NOT_FOUND,
                    "cannot get photo stream"));
        }

        Path path = Paths.get(p.path);

        try {
            String contentType = Files.probeContentType(path);
            res.type(contentType);

            OutputStream resStream = res.raw().getOutputStream();

            Files.copy(Paths.get(p.path), resStream);
        } catch (IOException err) {
            res.type("application/json");
            res.status(500);
            return gson.toJson(new ResponseEntity(
                    ResponseStatus.ERROR,
                    "cannot get photo stream"));
        }

        return "";
    }
}
