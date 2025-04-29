module "dynamodb" {
  source        = "./modules/dynamodb"
  table_name    = "place-table"
  partition_key = "PLACE_ID"
  attribute_definitions = [
    {
      attribute_name = "PLACE_ID"
      attribute_type = "S"
    }
  ]
}

module "lambda" {
  source        = "./modules/lambda"
  function_name = "insert_place_lambda"
  zip_file      = "../lambdas/insert-place/dist/index.zip"
  handler       = "index.lambdaHandler"
  runtime       = "nodejs22.x"
  environment = {
    TABLE_NAME = module.dynamodb.table_name
  }
}

data "aws_iam_policy_document" "lambda_policy_document" {
  statement {
    actions = [
      "dynamodb:PutItem",
    ]
    resources = [
      module.dynamodb.table_arn
    ]
  }
}
resource "aws_iam_policy" "dynamodb_lambda_policy" {
  name        = "dynamodb-lambda-policy"
  description = "This policy will be used by the lambda to write data to DynamoDB"
  policy      = data.aws_iam_policy_document.lambda_policy_document.json
}
resource "aws_iam_role_policy_attachment" "lambda_attachements" {
  role       = module.lambda.lambda_execution_role_name
  policy_arn = aws_iam_policy.dynamodb_lambda_policy.arn
}


# module "apigateway" {
#   source      = "./modules/apigateway"
#   lambda_arn  = module.lambda.lambda_arn
#   lambda_name = module.lambda.lambda_name
#   api_name    = "example-api"
# }
