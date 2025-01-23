package com.kalyvianakis.estiator.io.specifications;

import com.kalyvianakis.estiator.io.metamodel._User;
import com.kalyvianakis.estiator.io.model.User;

import org.springframework.data.jpa.domain.Specification;

public class UserSpecification {
    public static Specification<User> emailEquals(String email) {
        return (root, query, builder) -> builder.equal(root.get(_User.EMAIL), email);
    }
    public static Specification<User> isAdmin() {
        return (root, query, builder) -> builder.equal(root.get(_User.USER_ROLE), "ROLE_ADMIN");
    }

    public static Specification<User> isModerator() {
        return (root, query, builder) -> builder.equal(root.get(_User.USER_ROLE), "ROLE_MODERATOR");
    }
}