package cars.utils;

import java.io.File;
import java.nio.file.Path;

public class FileUtils {
    public static void ClearDir(String path) {
        File directory = new File(path);

        if (!directory.exists()) {
            return;
        }

        File[] files = directory.listFiles();
        for (File file : files) {
            file.delete();
        }
    }

    public static void removeFile(Path path) {
        File f = path.toFile();
        f.delete();
    }
}
