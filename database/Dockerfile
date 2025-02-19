FROM mysql:8.0

LABEL maintainer "george.kalyvianakis@gmail.com"

# The MYSQL_DATABASE environment variable only works when mysqld initializes a fresh data directory. 
# If the container starts with an existing data directory (e.g., because a volume is mounted), this variable is ignored.
# On console, try running: docker volume rm [volumn-name]
ENV MYSQL_DATABASE=estiator\
    MYSQL_ROOT_PASSWORD=root

ADD db-init.sql /docker-entrypoint-initdb.d

EXPOSE 3306