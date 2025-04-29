terraform {
  backend "s3" {
    bucket = "terraform-s3-state-92300"
    key    = "my-terraform-project"
    region = "eu-central-1"
  }
}

provider "aws" {
  region = "eu-west-3"
}
