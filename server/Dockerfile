FROM alpine/java:22-jdk
LABEL maintainer="george.kalyvianakis@gmail.com"
EXPOSE 8888
ARG JAR_FILE=build/libs/estiator.io-1.0.0.jar
ADD ${JAR_FILE} app.jar

# Provide entrypoint, including system property for Java's entropy source; 
# Java applications use random numbers for cryptographic operations, and /dev/random in Linux can block if there's not enough entropy.
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]