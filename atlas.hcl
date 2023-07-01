################################################################################
# Input Variables – Input variables that can be configured.
################################################################################

variable "dev_db_url" {
    description = "The URL of the dev database for atlas to plan out changes before apply."
    // See: https://atlasgo.io/concepts/dev-database
    type = string
    default = "docker://mysql/8"
}

variable "host" {
    description = "The host of the database."
    type = string
    default = "localhost"
}

variable "username" {
    description = "The username of the database."
    type = string
    default = "root"
}

variable "password" {
    description = "The password of the database."
    type = string
    default = "password"
}

variable "port" {
    description = "The port of the database."
    type = number
    default = 3306
}

################################################################################
# Local Variables – Reusable variables that are used in the configuration.
################################################################################

locals {
    url = "mysql://${var.username}:${var.password}@${var.host}:${var.port}"
    schemas = [
        "student-life"
    ]
    dev_url = var.dev_db_url
}

################################################################################
# Environments – The environments that are managed by Atlas.
################################################################################

# Dev Environment

env "dev" {
  src = "./database"

  // The URL of the database which is managed in
  // this environment.
  url = local.url

  // Dev Database for this environment
  // See: https://atlasgo.io/concepts/dev-database
  dev = local.dev_url

  // The schemas in the database that are managed by Atlas.
  schemas = local.schemas
}