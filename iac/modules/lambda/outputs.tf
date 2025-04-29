output "lambda_arn" {
  value = aws_lambda_function.new_lambda.invoke_arn
}

output "lambda_name" {
  value = aws_lambda_function.new_lambda.function_name
}

output "lambda_execution_role_name" {
  value = aws_iam_role.lambda_exec.name
}

output "lambda_execution_role_arn" {
  value = aws_iam_role.lambda_exec.arn
}
