package com.kalyvianakis.estiator.io.repository;

import com.kalyvianakis.estiator.io.model.Table;
import com.kalyvianakis.estiator.io.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {}
