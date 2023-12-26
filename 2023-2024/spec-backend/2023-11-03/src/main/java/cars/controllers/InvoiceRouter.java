package cars.controllers;

import spark.Request;
import spark.Response;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.UUID;

import com.google.gson.Gson;

import cars.models.Invoice;

public class InvoiceRouter {
    static Gson gson = new Gson();

    static public String invoiceList(Request req, Response res) {
        res.header("Content-Type", "application/json");
        return gson.toJson(State.InvoiceList, ArrayList.class);
    }

    static public String invoiceForAll(Request req, Response res) {
        Invoice invoice = new Invoice(State.CarList);
        State.InvoiceList.add(invoice);

        return "Added new invoice";
    }

    static public String invoiceForYear(Request req, Response res) {
        int year = Integer.parseInt(req.body());

        Invoice invoice = new Invoice(State.CarList, year);
        State.InvoiceList.add(invoice);

        return "Added new invoice";
    }

    static public String invoiceForPrice(Request req, Response res) {
        String arr[] = req.body().split("-");
        if (arr.length != 2) {
            res.status(400);
            return "Wrong data";
        }

        int minPrice = Integer.parseInt(arr[0]); 
        int maxPrice = Integer.parseInt(arr[1]); 

        System.out.print(minPrice);
        System.out.print(maxPrice);

        Invoice invoice = new Invoice(State.CarList, minPrice, maxPrice);
        State.InvoiceList.add(invoice);

        return "Added new invoice";
    }

    static public String getInvoice(Request req, Response res) {
        UUID toFind = UUID.fromString(req.params("id"));

        for (Invoice invoice : State.InvoiceList) {
            if (!toFind.equals(invoice.uuid))
                continue;

            res.type("application/octet-stream");
            res.header("Content-Disposition", "inline; filename=invoice.pdf");

            try {
                OutputStream outputStream = res.raw().getOutputStream();
                outputStream.write(Files.readAllBytes(invoice.invoicePath));
            } catch (IOException err) {
                System.err.println(err);
            }

            return "";
        }

        res.status(404);
        return "Car not found";
    }
}
