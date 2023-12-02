FROM mysql:latest

RUN chown -R mysql:root /var/lib/mysql/

ARG MYSQL_DATABASE=babyteacher
ARG MYSQL_USER=babyuser
ARG MYSQL_PASSWORD=pass
ARG MYSQL_ROOT_PASSWORD=pass

ADD setup.sql /docker-entrypoint-initdb.d

#ADD setup.sql /etc/mysql/setup.sql
#
#RUN sed -i 's/MYSQL_DATABASE/'$MYSQL_DATABASE'/g' /etc/mysql/setup.sql
#RUN cp /etc/mysql/setup.sql /docker-entrypoint-initdb.d

EXPOSE 3306
