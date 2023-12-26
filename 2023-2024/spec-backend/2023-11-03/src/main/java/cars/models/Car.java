package cars.models;

import java.awt.Color;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.Image;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Font;
import com.itextpdf.text.BaseColor;
import com.itextpdf.text.pdf.PdfWriter;

import cars.controllers.State;
import cars.utils.ColorUtils;
import cars.utils.FileUtils;

public class Car {
    public UUID uuid;
    public String model;
    public String color;
    public int year;
    public boolean hasInvoice = false;
    // 0 - driver, 1 - passanger, 2 - back seat, 3 - on sides
    public boolean airbags[] = new boolean[4];
    // random fields
    public String date;
    public int price;
    public int tax;
    // gallery fields
    public ArrayList<UUID> imageUUIDs;

    transient public Path invoicePath;

    private static Random rnd = new Random();
    private static int taxes[] = { 0, 7, 22 };

    public Car(String model, String color, int year, boolean airbags[]) {
        this.uuid = UUID.randomUUID();
        this.model = model;
        this.color = color;
        this.year = year;
        this.airbags = airbags;

        this.date = CustomDate.afterYear(year).toString();
        this.price = rnd.nextInt(10000, 1000000);
        this.tax = taxes[rnd.nextInt(taxes.length)];
    }

    public String newUUID() {
        this.uuid = UUID.randomUUID();
        return this.uuid.toString();
    }

    public void updateDate() {
        this.date = CustomDate.afterYear(this.year).toString();
        this.price = rnd.nextInt(10000, 1000000);
        this.tax = taxes[rnd.nextInt(taxes.length)];
        this.imageUUIDs = new ArrayList<UUID>();
    }

    public void update(String model, String color, int year, boolean airbags[]) {
        if (model != null)
            this.model = model;
        if (color != null)
            this.color = color;
        if (year != 0)
            this.year = year;
        if (airbags != null)
            this.airbags = airbags;
    }

    public void generateInvoice() {
        String base_path = "invoices";
        Path path = Paths.get(base_path, this.uuid + ".pdf");
        Document document = new Document();

        File directory = new File(base_path);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        try {
            try {
                PdfWriter.getInstance(document, new FileOutputStream(path.toString()));
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
            Color c = Color.decode(this.color);
            BaseColor bc = new BaseColor(c.getRed(), c.getGreen(), c.getBlue());

            document.open();

            font = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, BaseColor.BLACK);
            p = new Paragraph(String.format("Invoice for: %s", this.uuid), font);
            document.add(p);

            font = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, BaseColor.BLACK);
            p = new Paragraph(String.format("Model: %s", this.model), font);
            document.add(p);

            font = FontFactory.getFont(FontFactory.HELVETICA, 16, bc);
            p = new Paragraph(String.format("Color: %s", ColorUtils.getColorNameFromColor(c)), font);
            document.add(p);

            font = FontFactory.getFont(FontFactory.HELVETICA, 16, BaseColor.BLACK);
            p = new Paragraph(String.format("Year: %s", this.year), font);
            document.add(p);

            p = new Paragraph(String.format(
                    "airbag - driver seat: %s\nairbag - passanger seat: %s\nairbags - back seat: %s\nairbags - sides: %s",
                    this.airbags[0], this.airbags[1], this.airbags[2], this.airbags[3]), font);
            document.add(p);

            try {
                // get image from resources
                Image img = Image.getInstance(getClass().getResource("/pdf_assets/jawa.jpg"));
                float size = ((document.getPageSize().getWidth() - document.leftMargin()
                        - document.rightMargin()) / img.getWidth()) * 100;

                img.scalePercent(size);
                document.add(img);
            } catch (IOException err) {
                System.out.println(err);
            }

            document.close();
        } catch (DocumentException err) {
            System.out.println(err);
            return;
        }

        this.hasInvoice = true;
        this.invoicePath = path;
    }

    public void deleteInvoice() {
        File invoice = new File(this.invoicePath.toString());
        invoice.delete();
    }

    public void deleteImages() {
        ArrayList<cars.models.Image> toDel = State.ImageList.stream()
                .filter(i -> this.imageUUIDs.contains(i.uuid))
                .collect(Collectors.toCollection(ArrayList::new));

        toDel.forEach(i -> FileUtils.removeFile(i.path));
        State.ImageList.removeAll(toDel);
    }
}
