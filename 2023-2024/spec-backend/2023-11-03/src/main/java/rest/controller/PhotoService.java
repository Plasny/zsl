package rest.controller;

import java.io.OutputStream;
import java.util.Map;

import rest.model.Photo;

public interface PhotoService {
    void update(String uploadDir) throws Exception;

    Map<String, Photo> getMapOfPhotos();

    Photo getPhotoById(String id);

    Photo getPhotoByName(String name);

    boolean deletePhotoById(String id);

    OutputStream getPhotoStreamById(String id);

    boolean renamePhotoById(String id, String newName);
}
