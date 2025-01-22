package com.kalyvianakis.estiator.io.repository;

import com.kalyvianakis.estiator.io.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    List<User> findByUserRoleValueIn(List<Short> userRoles);
    Optional<User> findByIdAndUserRoleValueIn(Long id, Collection<Short> userRoles);
    Optional<User> findByEmail(String email);
}
