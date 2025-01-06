package com.kalyvianakis.estiator.io.specifications;

import com.kalyvianakis.estiator.io.enums.UserRole;
import com.kalyvianakis.estiator.io.metamodel._User;
import com.kalyvianakis.estiator.io.model.User;

import org.springframework.data.jpa.domain.Specification;

public class UserSpecification {
    public static Specification<User> emailEquals(String email) {
        return (root, query, builder) -> builder.equal(root.get(_User.EMAIL), email);
    }
    public static Specification<User> isAdmin() {
        return (root, query, builder) -> builder.equal(root.get(_User.USER_ROLE_VALUE), UserRole.Admin.getLabel());
    }

    public static Specification<User> isModerator() {
        return (root, query, builder) -> builder.equal(root.get(_User.USER_ROLE_VALUE), UserRole.Moderator.getLabel());
    }
}