output "table_name" {
  value       = aws_dynamodb_table.new_table.name
  description = "DynamoDB table name"
}

output "table_id" {
  value       = aws_dynamodb_table.new_table.id
  description = "DynamoDB table ID"
}

output "table_arn" {
  value       = aws_dynamodb_table.new_table.arn
  description = "DynamoDB table ARN"
}
