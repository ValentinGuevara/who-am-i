# output "api_url" {
#   value = module.apigateway.api_url
# }

output "aws_iam_role_ci_arn" {
  value       = aws_iam_role.this.arn
  description = "CI IAM Role ARN"

}
