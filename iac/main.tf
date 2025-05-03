locals {
  lambda_function_name = "insert_place_lambda"
}

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
  function_name = local.lambda_function_name
  zip_file      = "../lambdas/insert-place/dist/index.zip"
  handler       = "index.lambdaHandler"
  runtime       = "nodejs22.x"
  environment = {
    TABLE_NAME_PLACE = module.dynamodb.table_name
  }
}

module "api_gateway" {
  source                        = "./modules/apigateway"
  lambda_arn                    = module.lambda.lambda_arn
  lambda_name                   = module.lambda.lambda_name
  api_name                      = "who-am-i-api"
  lambda_invoke_integration_arn = module.lambda.lambda_arn
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = module.lambda.lambda_execution_role_name
}

resource "aws_lambda_permission" "apigw_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = local.lambda_function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${module.api_gateway.rest_api_execution_arn}/*/*/*"
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
