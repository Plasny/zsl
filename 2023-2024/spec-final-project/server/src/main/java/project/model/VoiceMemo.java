package project.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "memos")
public class VoiceMemo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    public Long timestamp;
    public Long duration; 
    public boolean location = false;
    public Double longitude = null;
    public Double latitude = null;
    public String audioFilePath;
    @Column(columnDefinition="TEXT")
    public String transcription = null;
    
    public VoiceMemo() {}

    public VoiceMemo(
            Long timestamp, 
            Long duration, 
            String audioFilePath,
            boolean location,
            Double latitude,
            Double longitude,
            String transcription
    ) {
        this.audioFilePath = audioFilePath;
        this.timestamp = timestamp;
        this.duration = duration;
        this.location = location;
        this.latitude = latitude;
        this.longitude = longitude;
        this.transcription = transcription;
    }
}
