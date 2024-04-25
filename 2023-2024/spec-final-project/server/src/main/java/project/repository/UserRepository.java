package project.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import project.model.User;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {
    User findByUsername(final String username);
    User save(User user);
}
