package com.kalyvianakis.estiator.io.metamodel;

import com.kalyvianakis.estiator.io.model.User;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

import java.sql.Timestamp;

@StaticMetamodel(User.class)
public class _User {
        public static volatile SingularAttribute<User, Integer> id;
        public static volatile SingularAttribute<User, Timestamp> createdDate;
        public static volatile SingularAttribute<User, String> name;
        public static volatile SingularAttribute<User, String> surname;
        public static volatile SingularAttribute<User, String> email;
        public static volatile SingularAttribute<User, String> password;
        public static volatile SingularAttribute<User, String> phone;
        public static volatile SingularAttribute<User, String> position;
        public static volatile SingularAttribute<User, String> profileImage;
        public static volatile SingularAttribute<User, Short> statusValue;
        public static volatile SingularAttribute<User, Short> userRoleValue;

        public static final String ID = "id";
        public static final String CREATED_DATE = "createdDate";
        public static final String NAME = "name";
        public static final String SURNAME = "surname";
        public static final String EMAIL = "email";
        public static final String PASSWORD = "password";
        public static final String PHONE = "phone";
        public static final String POSITION = "position";
        public static final String PROFILE_IMAGE = "profileImage";
        public static final String STATUS_VALUE = "statusValue";
        public static final String USER_ROLE_VALUE = "userRoleValue";

}
