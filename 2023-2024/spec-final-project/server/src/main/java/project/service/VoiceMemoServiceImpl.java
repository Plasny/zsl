package project.service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import project.model.VoiceMemo;
import project.repository.VoiceMemoRepository;

@Service
public class VoiceMemoServiceImpl implements VoiceMemoService {
    private final Path root = Paths.get("uploads");

    @Autowired
    private final VoiceMemoRepository voiceMemoRepository;

    VoiceMemoServiceImpl(VoiceMemoRepository voiceMemoRepository) {
        this.voiceMemoRepository = voiceMemoRepository;
        init();
    }

    @Override
    public void init() {
        if (Files.exists(root))
            return;

        try {
            Files.createDirectory(root);
        } catch (Exception e) {
            System.out.println("Unable to create uploads directory");
            System.exit(1);
        }
    }

    @Override
    public void save(
            MultipartFile file,
            Long timestamp,
            Long duration,
            boolean location,
            Double latitude,
            Double longitude,
            String transcription) throws IOException {

        int idx = file.getOriginalFilename().lastIndexOf(".");
        String extension;
        if (idx == -1) {
            extension = "";
        } else {
            extension = file.getOriginalFilename().substring(idx);
        }

        String fileName = UUID.randomUUID().toString() + extension;

        Files.copy(file.getInputStream(), this.root.resolve(fileName));

        voiceMemoRepository.save(new VoiceMemo(
                timestamp,
                duration,
                fileName,
                location,
                latitude,
                longitude,
                transcription));
    }

    @Override
    public Resource audioFile(Long id) throws MalformedURLException {
        Optional<VoiceMemo> memo = voiceMemoRepository.findById(id);
        Path file = root.resolve(memo.orElse(new VoiceMemo()).audioFilePath);
        Resource res = new UrlResource(file.toUri());
        return res;
    }

    @Override
    public List<VoiceMemo> getAll() {
        return voiceMemoRepository.findAll();
    }

    @Override
    public VoiceMemo getById(Long id) {
        Optional<VoiceMemo> memoOption = voiceMemoRepository.findById(id);
        return memoOption.orElse(null);
    }

    @Override
    public void deleteById(Long id) {
        voiceMemoRepository.deleteById(id);
    }
}
