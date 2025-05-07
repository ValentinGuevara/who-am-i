resource "aws_iam_role" "lambda_execs" {
  for_each = var.functions
  name     = "${each.value.function_name}_iam_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basics" {
  for_each   = var.functions
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.lambda_execs[each.key].name
}

resource "aws_lambda_function" "new_lambdas" {
  for_each         = var.functions
  function_name    = each.value.function_name
  role             = aws_iam_role.lambda_execs[each.key].arn
  handler          = var.handler
  runtime          = var.runtime
  filename         = each.value.zip_file
  source_code_hash = filebase64sha256(each.value.zip_file)
  environment {
    variables = var.environment
  }
}
