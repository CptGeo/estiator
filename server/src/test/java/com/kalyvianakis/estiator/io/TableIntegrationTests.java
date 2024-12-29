package com.kalyvianakis.estiator.io;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@SpringBootTest
public class TableIntegrationTests {

  @Autowired
  private WebApplicationContext webApplicationContext;

  private MockMvc mockMvc;

  /** 
   * @description `init` method can be removed if we use `@AutoConfigureWebMcv` annotation on this test class.
   * Kept it like this so that it is clearer what exactly is happening without the "magic" annotation.
   */
  @BeforeEach
  public void init() {
    mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
  }

  @Test
  @Tag("HTTP GET")
  @DisplayName("GET tables/ - Status should be 200 OK")
  public void whenGettingTables_statusShouldBeOK() throws Exception {
    mockMvc.perform(get("/tables")).andExpect(status().isOk());
  }
  
  @Test
  @Tag("HTTP GET")
  @DisplayName("GET tables/{id} with invalid ID - Status should be 400 Bad Request")
  public void whenGettingTableByID_statusShouldBeBadRequest() throws Exception {
    mockMvc.perform(get("/tables/-1")).andExpect(status().isBadRequest());
  }

  @Test
  @Tag("HTTP DELETE")
  @DisplayName("DELETE tables/{id} with invalid ID - Status should be 400 Bad Request")
  public void whenDelettingTableByID_statusShouldBeBadRequest() throws Exception {
    mockMvc.perform(get("/tables/-1")).andExpect(status().isBadRequest());
  }
}
