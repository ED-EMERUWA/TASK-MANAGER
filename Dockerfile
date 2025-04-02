# Use the official MySQL image as the base
FROM mysql:8.0


# Add a health check to ensure MySQL is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD mysqladmin ping -h localhost -u root --password=$MYSQL_ROOT_PASSWORD || exit 1

# Expose the default MySQL port
EXPOSE 3306

# Default command to run MySQL server
CMD ["mysqld"]
