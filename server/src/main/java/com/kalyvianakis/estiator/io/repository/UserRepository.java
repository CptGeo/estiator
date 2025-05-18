package com.kalyvianakis.estiator.io.repository;

import com.kalyvianakis.estiator.io.enums.ReservationStatus;
import com.kalyvianakis.estiator.io.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    List<User> findByUserRoleIn(Collection<String> userRoles);
    Optional<User> findByIdAndUserRoleIn(Long id, Collection<String> userRoles);
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    Boolean existsByPhone(String phone);

    @Query(value = "select u.* from users u left join reservations r on u.id = r.created_for_user_id where r.status = :status and r.table_id = :tableId", nativeQuery = true)
    User findByTableReservationAndStatus(@Param(value= "tableId") Long tableId, @Param(value= "status") ReservationStatus status);
}
