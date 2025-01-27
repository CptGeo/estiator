package com.kalyvianakis.estiator.io;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthTests {

    @Autowired
    private MockMvc mvc;

    @Test
    public void whenUserAccessLogin_shouldSucceedAndShouldIncludeEmailAndToken() throws Exception {
        String userJson = "{\"email\":\"george.kalyvianakis@gmail.com\",\"password\":\"12341234\"}";
        ResultActions result = mvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON).content(userJson));
        result.andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.email").value("george.kalyvianakis@gmail.com"))
                .andExpect(jsonPath("$.token").isString());
    }

    @Test
    public void whenUserAccessWithWrongCredentials_statusShouldBeUnauthorizedAndContentShouldBeCorrect() throws Exception {
        String userJson = "{\"email\":\"george.kalyvianakis@gmail.com\",\"password\":\"wrongPassword\"}";
        ResultActions result = mvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON).content(userJson));
        result.andExpect(status().isUnauthorized())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.details").isString())
                .andExpect(jsonPath("$.token").doesNotExist())
                .andExpect(jsonPath("$.message").isString());
    }

    @Test
    @WithMockUser(username = "moderator", roles = { "MODERATOR" })
    public void whenUserModeratorAccessResourceWithoutAccessRights_shouldForbid() throws Exception {
        mvc.perform(get("/users"))
                .andExpect(status().isForbidden())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @WithMockUser(username = "client", roles = { "CLIENT" })
    public void whenUserClientAccessResourceWithoutAccessRights_shouldForbid() throws Exception {
        mvc.perform(get("/tables"))
                .andExpect(status().isForbidden())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @WithMockUser(username = "admin", roles = { "ADMIN" })
    public void whenUserAdminAccessResourceWithAccessRights_shouldSucceed() throws Exception {
        mvc.perform(get("/users"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

}
