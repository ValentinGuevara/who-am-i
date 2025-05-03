output "rest_api_id" {
  value = aws_api_gateway_rest_api.my_api.id
}

output "rest_api_execution_arn" {
  value = aws_api_gateway_rest_api.my_api.execution_arn
}

output "rest_root_ressource_id" {
  value = aws_api_gateway_rest_api.my_api.root_resource_id
}
