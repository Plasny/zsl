package rest.controller;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Stream;

import rest.model.Photo;

public class PhotoServiceImpl implements PhotoService {
    private Map<String, Photo> photosMap = new HashMap<>();
    private int currentId = 0;

    @Override
    public void update(String uploadDir) throws IOException {
        Stream<Path> list = Files.list(Paths.get(uploadDir));

        list.forEach(path -> {
            for (Photo p : photosMap.values()) {
                if (p.path.compareTo(path.toString()) == 0)
                    return;
            }

            String id = String.valueOf(++currentId);
            photosMap.put(id, new Photo(
                    id,
                    path.getFileName().toString(),
                    path.toString()));
        });

        list.close();
    }

    @Override
    public Map<String, Photo> getMapOfPhotos() {
        return photosMap;
    }

    @Override
    public Photo getPhotoById(String id) {
        Photo photo = photosMap.get(id);
        return photo;
    }

    @Override
    public Photo getPhotoByName(String name) {
        for (Photo p : photosMap.values()) {
            if (p.name.compareTo(name) == 0) {
                return p;
            }
        }

        return null;
    }

    @Override
    public boolean deletePhotoById(String id) {
        Photo photo = photosMap.get(id);
        if (photo == null) {
            return true;
        }

        File f = new File(photo.path);

        if (f.delete()) {
            photosMap.remove(id);
            return true;
        }

        return false;

    }

    @Override
    public OutputStream getPhotoStreamById(String id) {
        Photo photo = photosMap.get(id);
        if (photo == null) {
            return null;
        }

        OutputStream stream;
        try {
            stream = new FileOutputStream(photo.path);
        } catch (FileNotFoundException err) {
            return null;
        }

        return stream;
    }

    @Override
    public boolean renamePhotoById(String id, String newName) {
        Photo photo = photosMap.get(id);
        if (photo == null) {
            return false;
        }

        File f = new File(photo.path);
        File newFile = new File(f.getParent(), newName);
        Boolean ok = f.renameTo(newFile);

        if (!ok)
            return false;

        // check if file already exists

        photo.name = newName;
        photo.path = newFile.toString();
        photosMap.put(id, photo);

        return true;
    }

    public String AddPhoto(String name, String path) {
        String id = String.valueOf(++currentId);

        photosMap.put(id, new Photo(id, name, path));

        return id;
    }
}
