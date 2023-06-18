# Desserts

## Database

### Installation

[How To Install PostgreSQL on Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-postgresql-on-ubuntu-20-04-quickstart)

```shell
sudo apt update
sudo apt install postgresql postgresql-contrib

# connect to the Postgres prompt
sudo -u postgres psql

# creating new role
sudo -u postgres createuser --interactive

# TODO: remote if app started working correctly
# add new user
# sudo adduser stats

# create new database
sudo -u postgres createdb stats

# switch over and connect to the database
sudo -u stats psql

# Prisma

```
