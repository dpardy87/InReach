#!/bin/bash

# Get the absolute path of the current script's directory
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)

# Define the backup directory relative to the script location
BACKUP_DIR="$SCRIPT_DIR/backups"

# Ensure the backup directory exists
mkdir -p "$BACKUP_DIR"

# Timestamp for the backup file
TIMESTAMP=$(date +%F)

# Run the Docker command to back up the MySQL volume
docker run --rm --volumes-from mysql_container -v "$BACKUP_DIR:/backup" ubuntu tar cvf /backup/mysql_data_backup_$TIMESTAMP.tar /var/lib/mysql
