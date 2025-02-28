package com.kalyvianakis.estiator.io.utils;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;


@Configuration
@ConfigurationProperties(prefix = "app")
public class ApplicationProperties {
    private String jwtSecret;

    private String clientProtocol;

    private String clientPort;

    private String clientHost;

    public String getClientUrl() {
        return clientProtocol + "://" + clientHost + (!clientPort.isEmpty() ? ":" + clientPort : "") + "/";
    }
    public String getClientUrl(String append) {
        return getClientUrl() + append;
    }

    public String getJwtSecret() {
        return jwtSecret;
    }

    public void setJwtSecret(String jwtSecret) {
        this.jwtSecret = jwtSecret;
    }

    public String getClientProtocol() {
        return clientProtocol;
    }

    public void setClientProtocol(String clientProtocol) {
        this.clientProtocol = clientProtocol;
    }

    public String getClientPort() {
        return clientPort;
    }

    public void setClientPort(String clientPort) {
        this.clientPort = clientPort;
    }

    public String getClientHost() {
        return clientHost;
    }

    public void setClientHost(String clientHost) {
        this.clientHost = clientHost;
    }
}
