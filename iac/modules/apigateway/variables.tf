variable "api_name" {
  type = string
}

variable "lambda_routes" {
  type = map(object({
    http_method       = string
    lambda_invoke_arn = string
  }))
}
