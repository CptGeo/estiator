# Begin with setting up the base image for the container
FROM alpine/java:21-jdk

# Add labels for documentation purposes
LABEL maintainer="george.kalyvianakis@gmail.com"

# Expose port to outer world
EXPOSE 8888

# Specify the .jar file path
ARG JAR_FILE=build/libs/estiator.io-1.0.0.jar

# Include .jar file in the container
ADD ${JAR_FILE} app.jar

# Provide entrypoint, including system property for Java's entropy source; 
# Java applications use random numbers for cryptographic operations, and /dev/random in Linux can block if there's not enough entropy.
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]