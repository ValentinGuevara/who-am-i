variable "table_name" {
  type = string
}
variable "read_capacity" {
  type    = number
  default = null
}
variable "write_capacity" {
  type    = number
  default = null
}
variable "partition_key" {
  type    = string
  default = "id"
}
variable "sort_key" {
  type    = string
  default = null
}
variable "attribute_definitions" {
  type = list(object({
    attribute_name = string
    attribute_type = string
  }))
  default = [
    {
      attribute_name = "id"
      attribute_type = "S"
    }
  ]
}
