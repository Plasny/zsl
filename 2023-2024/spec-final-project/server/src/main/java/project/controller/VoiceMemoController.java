package project.controller;

import java.io.IOException;
import java.net.URLConnection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import project.message.ResponseMessage;
import project.model.VoiceMemo;
import project.service.VoiceMemoService;

@Controller
public class VoiceMemoController {
    @Autowired
    private VoiceMemoService voiceMemoService;

    @GetMapping("/api/status")
    public ResponseEntity<ResponseMessage> status() {
        ResponseMessage msg = new ResponseMessage("ok");

        ResponseEntity<ResponseMessage> res = ResponseEntity
                .status(HttpStatus.OK)
                .body(msg);

        return res;
    }

    @GetMapping("/list")
    public String list() {
        return "list";
    }

    // @GetMapping("/upload")
    // public String uploadForm() {
    //     return "upload";
    // }
    
    @PostMapping(path = "/api/memos", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseMessage> addMemo(
            @RequestParam("audio") MultipartFile audioFile,
            @RequestParam Long timestamp,
            @RequestParam Long duration,
            @RequestParam boolean location,
            @RequestParam(required = false) Double longitude,
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) String transcription) {
        try {
            voiceMemoService.save(
                    audioFile,
                    timestamp,
                    duration,
                    location,
                    latitude,
                    longitude,
                    transcription);

            System.out.println("VoiceMemo t=" + timestamp.toString() + " synced");

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new ResponseMessage("ok"));
        } catch (IOException e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseMessage("error: we weren't able to save the voicememo"));
        }
    }

    @GetMapping("/api/memos")
    public ResponseEntity<List<VoiceMemo>> getAll() {
        List<VoiceMemo> list = voiceMemoService.getAll();

        ResponseEntity<List<VoiceMemo>> res = ResponseEntity
                .status(HttpStatus.OK)
                .body(list);

        return res;
    }

    @GetMapping("/api/memos/{id}")
    public ResponseEntity<?> getOne(@PathVariable("id") Long id) {
        VoiceMemo memo = voiceMemoService.getById(id);

        if (memo == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ResponseMessage("VoiceMemo with given id not found"));
        }

        ResponseEntity<VoiceMemo> res = ResponseEntity
                .status(HttpStatus.OK)
                .body(memo);

        return res;
    }

    @DeleteMapping("/api/memos/{id}")
    public ResponseEntity<?> deleteOne(@PathVariable("id") Long id) {
        VoiceMemo memo = voiceMemoService.getById(id);

        if (memo == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ResponseMessage("VoiceMemo with given id not found"));
        }

        voiceMemoService.deleteById(id);

        ResponseEntity<?> res = ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .build();

        return res;
    }

    @GetMapping("/api/memos/{id}/audio")
    public ResponseEntity<?> getAudio(@PathVariable("id") Long id) {
        try {
            Resource file = voiceMemoService.audioFile(id);
            String mimeType = URLConnection.guessContentTypeFromStream(file.getInputStream());
            ResponseEntity<Resource> res = ResponseEntity
                    .status(HttpStatus.OK)
                    .header("Content-Type", mimeType)
                    .body(file);

            return res;
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ResponseMessage("error: audio file for VoiceMemo with given if not found"));
        }
    }
}
