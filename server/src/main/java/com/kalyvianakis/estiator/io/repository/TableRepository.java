package com.kalyvianakis.estiator.io.repository;

import com.kalyvianakis.estiator.io.model.Table;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TableRepository extends JpaRepository<Table, Long> {}
