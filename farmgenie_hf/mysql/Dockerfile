# Use the official MySQL image from the Docker Hub
FROM mysql:8.1

# Set environment variables for MySQL
# ENV MYSQL_ROOT_PASSWORD=rootpassword
# ENV MYSQL_DATABASE=amazon_agricultural_products
# ENV MYSQL_USER=root
# ENV MYSQL_PASSWORD=mist786%

# Copy the SQL dump file into the container
COPY Dump20240805.sql /docker-entrypoint-initdb.d/

# Expose the port MySQL is running on
EXPOSE 33061