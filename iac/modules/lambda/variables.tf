variable "functions" {
  type = map(object({
    function_name = string
    zip_file      = string
  }))
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
