variable "function_name" {
  type = string
}
variable "zip_file" {
  type = string
}
variable "handler" {
  type = string
}
variable "runtime" {
  type = string
}
variable "environment" {
  type    = map(string)
  default = {}
}
