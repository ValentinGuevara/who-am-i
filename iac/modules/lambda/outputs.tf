output "lambda_function_arns" {
  value = { for key, lambda in aws_lambda_function.new_lambdas : key => lambda.invoke_arn }
}

output "lambda_names" {
  value = { for key, lambda in aws_lambda_function.new_lambdas : key => lambda.function_name }
}

output "lambda_execution_role_names" {
  value = { for key, role in aws_iam_role.lambda_execs : key => role.name }
}

output "lambda_execution_role_arns" {
  value = { for key, role in aws_iam_role.lambda_execs : key => role.arn }
}
