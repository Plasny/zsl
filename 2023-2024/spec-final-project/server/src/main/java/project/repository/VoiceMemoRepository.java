package project.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import project.model.VoiceMemo;

@Repository
public interface VoiceMemoRepository extends JpaRepository<VoiceMemo, Long> {
    VoiceMemo save(VoiceMemo memo);
    Optional<VoiceMemo> findById(Long id);
    List<VoiceMemo> findAll();
    void deleteById(Long id);
}
