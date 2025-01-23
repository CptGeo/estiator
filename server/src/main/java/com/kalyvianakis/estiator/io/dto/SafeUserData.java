package com.kalyvianakis.estiator.io.dto;

import com.kalyvianakis.estiator.io.model.User;

public class SafeUserData extends AuthenticatedUser {
   public SafeUserData(User user) {
       super(user);
   }
}
