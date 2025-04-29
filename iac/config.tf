terraform {
  backend "s3" {
    bucket  = "terraform-s3-state-92300"
    key     = "my-terraform-project"
    region  = "eu-central-1"
    profile = "valentin-guevara-sandbox-1_ADMIN_ACCESS"
  }
}

provider "aws" {
  region  = "eu-west-3"
  profile = "valentin-guevara-sandbox-1_ADMIN_ACCESS"
}
