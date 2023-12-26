package cars;

import static spark.Spark.*;

import cars.controllers.CarRouter;
import cars.controllers.ImageRouter;
import cars.controllers.InvoiceRouter;
import cars.models.Image;
import cars.models.Invoice;
import cars.utils.FileUtils;

public class App {
    public static void main(String[] args) {
        FileUtils.ClearDir(Image.basePath);
        FileUtils.ClearDir(Invoice.basePath);

        staticFiles.location("/public");

        // ! development only
        // String projectDir = System.getProperty("user.dir");
        // String staticDir = "/src/main/resources/public";
        // staticFiles.externalLocation(projectDir + staticDir);

        post("/api/cars", (req, res) -> CarRouter.addCar(req, res));
        get("/api/cars", (req, res) -> CarRouter.getCars(req, res));
        get("/api/cars/:id", (req, res) -> CarRouter.getCar(req, res));
        post("/api/cars/:id/invoice", (req, res) -> CarRouter.genInvoice(req, res));
        get("/api/cars/:id/invoice", (req, res) -> CarRouter.getInvoice(req, res));
        get("/api/cars/:id/images", (req, res) -> CarRouter.getImages(req, res));
        delete("/api/cars/:id", (req, res) -> CarRouter.delCar(req, res));
        put("/api/cars/:id", (req, res) -> CarRouter.updateCar(req, res));

        post("/api/invoices/all", (req, res) -> InvoiceRouter.invoiceForAll(req, res));
        post("/api/invoices/year", (req, res) -> InvoiceRouter.invoiceForYear(req, res));
        post("/api/invoices/price", (req, res) -> InvoiceRouter.invoiceForPrice(req, res));
        get("/api/invoices", (req, res) -> InvoiceRouter.invoiceList(req, res));
        get("/api/invoices/:id", (req, res) -> InvoiceRouter.getInvoice(req, res));

        post("/api/images", (req, res) -> ImageRouter.addImage(req, res));
        get("/api/images", (req, res) -> ImageRouter.allImages(req, res));
        get("/api/images/:id", (req, res) -> ImageRouter.getImage(req, res));
        delete("/api/images/:id", (req, res) -> ImageRouter.deleteImage(req, res));
        post("/api/images/:id/crop", (req, res) -> ImageRouter.cropImage(req, res));
        post("/api/images/:id/rotate", (req, res) -> ImageRouter.rotateImage(req, res, 0));
        post("/api/images/:id/flipX", (req, res) -> ImageRouter.rotateImage(req, res, 1));
        post("/api/images/:id/flipY", (req, res) -> ImageRouter.rotateImage(req, res, 2));
    }

}
