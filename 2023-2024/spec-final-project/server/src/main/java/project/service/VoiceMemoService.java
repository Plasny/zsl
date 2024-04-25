package project.service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import project.model.VoiceMemo;

public interface VoiceMemoService {
    public void init();

    public void save(
            MultipartFile file,
            Long timestamp,
            Long duration,
            boolean location,
            Double latitude,
            Double longitude,
            String transcription) throws IOException;

    public VoiceMemo getById(Long id);

    public Resource audioFile(Long id) throws MalformedURLException;

    public List<VoiceMemo> getAll();

    public void deleteById(Long id);
}
