package cars.controllers;

import java.util.UUID;

import spark.Request;
import spark.Response;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Optional;

import com.google.gson.Gson;

import cars.models.Car;

public class CarRouter {
    static Gson gson = new Gson();

    static public String getImages(Request req, Response res) {
        UUID toFind = UUID.fromString(req.params("id"));
        Optional<Car> car = State.CarList
                .stream()
                .filter(c -> c.uuid.equals(toFind))
                .findFirst();

        if (car.isEmpty()) {
            res.status(404);
            return "Car not found";
        }

        res.header("Content-Type", "application/json");
        return gson.toJson(car.get().imageUUIDs, ArrayList.class);
    }

    static public String getInvoice(Request req, Response res) {
        UUID toFind = UUID.fromString(req.params("id"));

        for (Car car : State.CarList) {
            if (!toFind.equals(car.uuid))
                continue;

            res.type("application/octet-stream");
            res.header("Content-Disposition", "inline; filename=invoice.pdf");

            try {
                OutputStream outputStream = res.raw().getOutputStream();
                outputStream.write(Files.readAllBytes(car.invoicePath));
            } catch (IOException err) {
                System.err.println(err);
            }

            return "";
        }

        res.status(404);
        return "Car not found";
    }

    static public String genInvoice(Request req, Response res) {
        UUID toFind = UUID.fromString(req.params("id"));

        for (Car car : State.CarList) {
            if (!toFind.equals(car.uuid))
                continue;

            car.generateInvoice();
            return "Invoice generated";
        }

        res.status(404);
        return "Car not found";
    }

    static public String getCar(Request req, Response res) {
        UUID toFind = UUID.fromString(req.params("id"));

        for (Car car : State.CarList) {
            if (toFind.equals(car.uuid)) {
                res.header("Content-Type", "application/json");
                return gson.toJson(car, Car.class);
            }
        }

        res.status(404);
        return "Car not found";
    }

    static public String getCars(Request req, Response res) {
        res.header("Content-Type", "application/json");
        return gson.toJson(State.CarList, ArrayList.class);
    }

    static public String addCar(Request req, Response res) {
        Car newCar = gson.fromJson(req.body(), Car.class);
        newCar.newUUID();
        newCar.updateDate();
        State.CarList.add(newCar);

        res.status(201);
        return gson.toJson(newCar);
    }

    static public String delCar(Request req, Response res) {
        UUID toDel = UUID.fromString(req.params("id"));
        int i = -1;
        // State.CarList.removeIf(car -> toDel.equals(car.uuid));

        for (Car car : State.CarList) {
            i++;

            if (!toDel.equals(car.uuid))
                continue;

            if (car.hasInvoice)
                car.deleteInvoice();

            car.deleteImages();

            State.CarList.remove(i);
            break;
        }

        return "Car deleted";
    }

    static public String updateCar(Request req, Response res) {
        UUID toUpdate = UUID.fromString(req.params("id"));
        Car c = gson.fromJson(req.body(), Car.class);

        for (Car car : State.CarList) {
            if (toUpdate.equals(car.uuid)) {
                System.out.print(c.color);
                System.out.print(req.body());
                car.update(c.model, c.color, c.year, c.airbags);
                return "Car updated";
            }
        }

        res.status(404);
        return "Car not found";
    }
}
