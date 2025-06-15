package com.kalyvianakis.estiator.io.utils;

import java.net.InetAddress;
import java.net.UnknownHostException;

public class HostHelper {
    public static String getHostAddress() {
        try {
            InetAddress inetAddress = InetAddress.getLocalHost();
            return inetAddress.getHostAddress();
        } catch (UnknownHostException e) {
            return "Unknown host";
        }
    }
}
