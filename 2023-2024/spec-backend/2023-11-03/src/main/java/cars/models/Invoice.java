package cars.models;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.UUID;
import java.util.stream.Collectors;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

enum InvoiceType {
    All,
    Year,
    PriceRange
}

public class Invoice {
    public UUID uuid;
    public InvoiceType type;
    public long creationTimestamp;
    public String description;

    public transient Instant creationDate;
    public transient ArrayList<Car> cars;
    public transient Path invoicePath;

    static public transient String basePath = "invoices";
    static private DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");

    public Invoice(ArrayList<Car> cars) {
        this.uuid = UUID.randomUUID();
        this.type = InvoiceType.All;
        this.creationDate = Instant.now();
        this.creationTimestamp = this.creationDate.toEpochMilli();
        this.cars = cars
                .stream()
                .collect(Collectors.toCollection(ArrayList::new));
        this.invoicePath = Paths.get(basePath,
                "all_cars_" + this.creationDate.getEpochSecond() + ".pdf");

        LocalDateTime date = InstantToDate(this.creationDate);
        this.description = "Invoice for all cars - " + date.format(formatter);

        genFile();
    }

    public Invoice(ArrayList<Car> cars, int year) {
        this.uuid = UUID.randomUUID();
        this.type = InvoiceType.Year;
        this.creationDate = Instant.now();
        this.creationTimestamp = this.creationDate.toEpochMilli();
        this.cars = cars
                .stream()
                .filter(car -> car.year == year)
                .collect(Collectors.toCollection(ArrayList::new));
        this.invoicePath = Paths.get(basePath,
                "all_cars_sold_in_" + year + "_"
                        + this.creationDate.getEpochSecond() + ".pdf");

        LocalDateTime date = InstantToDate(this.creationDate);
        this.description = "Invoice for cars sold in " + year + " - " + date.format(formatter);

        genFile();
    }

    public Invoice(ArrayList<Car> cars, int priceMin, int priceMax) {
        this.uuid = UUID.randomUUID();
        this.type = InvoiceType.PriceRange;
        this.creationDate = Instant.now();
        this.creationTimestamp = this.creationDate.toEpochMilli();
        this.cars = cars
                .stream()
                .filter(car -> car.price >= priceMin && car.price <= priceMax)
                .collect(Collectors.toCollection(ArrayList::new));
        this.invoicePath = Paths.get(basePath,
                "all_cars_with_price_from_" + priceMin + "_to_" + priceMax
                        + "_" + this.creationDate.getEpochSecond() + ".pdf");

        LocalDateTime date = InstantToDate(this.creationDate);
        this.description = "Invoice for cars with price from " + priceMin + " to "
                + priceMax + " - " + date.format(formatter);

        genFile();
    }

    private LocalDateTime InstantToDate(Instant i) {
        return LocalDateTime.ofInstant(this.creationDate, ZoneId.systemDefault());
    }

    private void genFile() {
        Document document = new Document();

        File directory = new File(basePath);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        try {
            try {
                PdfWriter.getInstance(document,
                        new FileOutputStream(this.invoicePath.toString()));
            } catch (DocumentException err) {
                System.out.println(err);
                return;
            }
        } catch (FileNotFoundException err) {
            System.out.println(err);
            return;
        }

        try {
            Paragraph p;
            Font font;
            document.open();

            font = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24, BaseColor.BLACK);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd-HH/mm/ss");
            LocalDateTime date = InstantToDate(this.creationDate);
            p = new Paragraph(String.format("Invoice: %s", date.format(formatter)), font);
            document.add(p);

            font = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, BaseColor.RED);
            p = new Paragraph(this.description.split(" - ")[0], font);
            document.add(p);

            p = new Paragraph(" ", font);
            document.add(p);

            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(95);

            font = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, BaseColor.BLACK);
            table.addCell(new Phrase("nu. ", font));
            table.addCell(new Phrase("year ", font));
            table.addCell(new Phrase("price ", font));
            table.addCell(new Phrase("tax ", font));
            table.addCell(new Phrase("value ", font));

            font = FontFactory.getFont(FontFactory.HELVETICA, 12, BaseColor.BLACK);
            int i = 0;
            double sum = 0;
            for (Car car : this.cars) {
                i++;
                table.addCell(new Phrase(i + ".", font));
                table.addCell(new Phrase(car.year + "", font));
                table.addCell(new Phrase(String.format("%.2f PLN", (double) car.price), font));
                table.addCell(new Phrase(car.tax + "%", font));
                double value = car.price + (double) car.price * car.tax / 100;
                table.addCell(new Phrase(String.format("%.2f PLN", value), font));
                sum += car.price;
            }
            document.add(table);

            font = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, BaseColor.BLACK);
            p = new Paragraph(String.format("To pay: %.2f PLN", sum), font);
            document.add(p);

            document.close();
        } catch (DocumentException err) {
            System.out.println(err);
            return;
        }
    }

}
