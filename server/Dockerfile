# Compiling
FROM gradle:8.14.2-jdk21-corretto-al2023 AS BUILD
ENV APP_HOME=/usr/app/
WORKDIR $APP_HOME
COPY . .
RUN gradle clean bootJar
RUN echo "Running gradle clean and bootJar"

# Running container
FROM eclipse-temurin:21-jdk-alpine

ENV VERSION=0.4.0-alpha

ENV JAR_NAME=estiator_io-${VERSION}.jar
ENV APP_HOME=/usr/app

WORKDIR $APP_HOME/
COPY --from=BUILD $APP_HOME/build ${APP_HOME}/build
RUN echo "Copying files from ${APP_HOME} to $APP_HOME/build"

LABEL maintainer="george.kalyvianakis@gmail.com"

EXPOSE 8443

ENTRYPOINT sh -c 'java -Djava.security.egd=file:/dev/./urandom -jar "/usr/app/build/libs/${JAR_NAME}"'

# To include keystore file for TLS encryption
# docker run -v ./server/src/main/resources/keystore.p12:/usr/app/build/resources/main/keystore.p12 -p 8443:8443 estiator-io-server-bnr-t1 --detach 