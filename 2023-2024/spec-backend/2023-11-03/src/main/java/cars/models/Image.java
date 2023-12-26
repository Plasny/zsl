package cars.models;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import javax.imageio.ImageIO;

import org.imgscalr.Scalr;

public class Image {
    public transient static String basePath = "images";
    public transient Path path;
    public UUID uuid;
    public String name;

    // Remember to check whether InputStream is empty
    public Image(InputStream imgStream, String name) throws IOException {
        this.name = name;
        this.uuid = UUID.randomUUID();
        this.path = Paths.get(basePath, this.uuid + ".jpg");

        File directory = new File(basePath);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        Files.copy(imgStream, this.path);
    }

    public void flipY() throws IOException {
        File f = this.path.toFile();
        BufferedImage oldImage = ImageIO.read(f);

        BufferedImage newImage = Scalr.rotate(oldImage, Scalr.Rotation.FLIP_VERT);
        ImageIO.write(newImage, "jpg", f);

        oldImage.flush();
        newImage.flush();
    }

    public void flipX() throws IOException {
        File f = this.path.toFile();
        BufferedImage oldImage = ImageIO.read(f);

        BufferedImage newImage = Scalr.rotate(oldImage, Scalr.Rotation.FLIP_HORZ);
        ImageIO.write(newImage, "jpg", f);

        oldImage.flush();
        newImage.flush();
    }

    public void rotate() throws IOException {
        File f = this.path.toFile();
        BufferedImage oldImage = ImageIO.read(f);

        BufferedImage newImage = Scalr.rotate(oldImage, Scalr.Rotation.CW_90);
        ImageIO.write(newImage, "jpg", f);

        oldImage.flush();
        newImage.flush();
    }

    public void crop(Integer x, Integer y, Integer w, Integer h) throws IOException {
        File f = this.path.toFile();
        BufferedImage oldImage = ImageIO.read(f);

        BufferedImage newImage = Scalr.crop(oldImage, x, y, w, h);
        ImageIO.write(newImage, "jpg", f);

        oldImage.flush();
        newImage.flush();
    }
}
