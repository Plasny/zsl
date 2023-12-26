package cars.controllers;

import java.io.InputStream;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.servlet.MultipartConfigElement;
import javax.servlet.http.Part;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import cars.models.Car;
import cars.models.Image;
import cars.utils.FileUtils;
import spark.Request;
import spark.Response;
import spark.utils.IOUtils;

public class ImageRouter {
    static Gson gson = new Gson();

    /// opt: 0 = rotate, 1 = flipX, 2+ = flipY
    public static String rotateImage(Request req, Response res, Integer opt) {
        UUID toFind = UUID.fromString(req.params("id"));
        Optional<Image> img = State.ImageList
                .stream()
                .filter(c -> c.uuid.equals(toFind))
                .findFirst();

        if (img.isEmpty()) {
            res.status(404);
            return "Image not found";
        }

        try {
            if (opt == 0) {
                img.get().rotate();
            } else if (opt == 1) {
                img.get().flipX();
            } else {
                img.get().flipY();
            }
        } catch (Exception e) {
            res.status(500);
            return "Image error";
        }

        return "Image rotated";
    }

    public static String cropImage(Request req, Response res) {
        UUID toFind = UUID.fromString(req.params("id"));
        Optional<Image> img = State.ImageList
                .stream()
                .filter(c -> c.uuid.equals(toFind))
                .findFirst();

        if (img.isEmpty()) {
            res.status(404);
            return "Image not found";
        }

        JsonObject json = gson.fromJson(req.body(), JsonObject.class);

        Integer top = json.get("top").getAsInt();
        Integer left = json.get("left").getAsInt();
        Integer width = json.get("right").getAsInt() - left;
        Integer height = json.get("bottom").getAsInt() - top;

        // System.out.println(top);
        // System.out.println(left);
        // System.out.println(height);
        // System.out.println(width);

        try {
            img.get().crop(left, top, width, height);
        } catch (Exception e) {
            res.status(500);
            return "Image error";
        }

        return "Image cropped";
    }

    public static String allImages(Request req, Response res) {
        ArrayList<UUID> images = State.ImageList
                .stream()
                .map(i -> i.uuid)
                .collect(Collectors.toCollection(ArrayList::new));

        res.header("Content-Type", "application/json");
        return gson.toJson(images, ArrayList.class);
    }

    public static String deleteImage(Request req, Response res) {
        UUID toFind = UUID.fromString(req.params("id"));
        Optional<Image> img = Optional.empty();
        int i;

        for (i = 0; i < State.ImageList.size(); i++) {
            if (State.ImageList.get(i).uuid.equals(toFind)) {
                img = Optional.of(State.ImageList.get(i));
                break;
            }

        }

        if (img.isEmpty()) {
            res.status(404);
            return "Image not found";
        }

        Image image = State.ImageList.remove(i);
        FileUtils.removeFile(image.path);

        State.CarList.stream()
            .forEach(c -> {
                c.imageUUIDs.remove(image.uuid);
            });

        return "Image deleted";
    }

    public static String getImage(Request req, Response res) {
        UUID toFind = UUID.fromString(req.params("id"));
        Optional<Image> img = State.ImageList
                .stream()
                .filter(c -> c.uuid.equals(toFind))
                .findFirst();

        if (img.isEmpty()) {
            res.status(404);
            return "Image not found";
        }

        try {
            res.raw().getOutputStream().write(Files.readAllBytes(img.get().path));
        } catch (Exception e) {
            res.status(500);
            return "Image rendering error";
        }

        res.type("image/jpeg");

        return "";
    }

    public static String addImage(Request req, Response res) {
        ArrayList<Image> images = new ArrayList<Image>();
        Optional<Car> car = Optional.empty();

        // idk why it is needed but ok, now it works
        req.attribute("org.eclipse.jetty.multipartConfig", new MultipartConfigElement("tmp"));

        try {
            Collection<Part> parts = req.raw().getParts();
            for (Part part : parts) {
                if (part.getName().equals("car_uuid")) {
                    UUID carUUID = UUID.fromString(IOUtils.toString(part.getInputStream()));
                    car = State.CarList.stream().filter(c -> c.uuid.equals(carUUID)).findFirst();

                    if (car.isEmpty()) {
                        res.status(400);
                        return "Car with such uuid does not exist";
                    }

                    continue;
                }

                if (part.getName().equals("img")) {
                    if (part.getSize() == 0) {
                        res.status(400);
                        return "Empty files cannot be saved";
                    }

                    String name = part.getSubmittedFileName();
                    InputStream imgStream = part.getInputStream();

                    images.add(new Image(imgStream, name));

                    continue;
                }
            }
        } catch (Exception e) {
            System.out.println(e);
            res.status(500);
            return "Something went wrong processing your request";
        }

        State.ImageList.addAll(images);

        if (car.isPresent()) {
            for (Image image : images) {
                car.get().imageUUIDs.add(image.uuid);
            }
            res.redirect("/gallery.html?car=" + car.get().uuid);
        } else {
            res.redirect("/gallery.html");
        }

        return "Photos saved";
    }
}
