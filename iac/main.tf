locals {
  lambda_function_name_insert = "insert_place_lambda"
  lambda_function_name_get    = "get_places_lambda"
}

module "dynamodb" {
  source        = "./modules/dynamodb"
  table_name    = "place-table"
  partition_key = "PK"
  sort_key      = "PLACE_ID"
  attribute_definitions = [
    {
      attribute_name = "PK"
      attribute_type = "S"
    },
    {
      attribute_name = "PLACE_ID"
      attribute_type = "S"
    }
  ]
}

module "lambda" {
  source = "./modules/lambda"
  functions = {
    insert_place_lambda = {
      function_name = local.lambda_function_name_insert
      zip_file      = "../lambdas/insert-place/dist/index.zip"
    },
    get_places_lambda = {
      function_name = local.lambda_function_name_get
      zip_file      = "../lambdas/get-places/dist/index.zip"
    }
  }
  handler = "index.lambdaHandler"
  runtime = "nodejs22.x"
  environment = {
    TABLE_NAME_PLACE = module.dynamodb.table_name
  }
}

module "api_gateway" {
  source = "./modules/apigateway"
  lambda_routes = {
    insert_place = {
      http_method       = "POST"
      lambda_invoke_arn = module.lambda.lambda_function_arns[local.lambda_function_name_insert]
    }
    get_places = {
      http_method       = "GET"
      lambda_invoke_arn = module.lambda.lambda_function_arns[local.lambda_function_name_get]
    }
  }
  api_name = "who-am-i-api"
}

resource "aws_lambda_permission" "apigw_lambdas" {
  for_each      = module.lambda.lambda_names
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = each.value
  principal     = "apigateway.amazonaws.com"

  source_arn = "${module.api_gateway.rest_api_execution_arn}/*/*/*"
}

//-----INSERT LAMBDA IAM ROLE POLICY ATTACHMENT-----
data "aws_iam_policy_document" "lambda_policy_document_write" {
  statement {
    actions = [
      "dynamodb:PutItem",
    ]
    resources = [
      module.dynamodb.table_arn
    ]
  }
}
resource "aws_iam_policy" "dynamodb_lambda_policy_write" {
  name        = "dynamodb-lambda-policy-write"
  description = "This policy will be used by the lambda to write data to DynamoDB"
  policy      = data.aws_iam_policy_document.lambda_policy_document_write.json
}
resource "aws_iam_role_policy_attachment" "lambda_attachements_write" {
  role       = module.lambda.lambda_execution_role_names[local.lambda_function_name_insert]
  policy_arn = aws_iam_policy.dynamodb_lambda_policy_write.arn
}

//-----GET LAMBDA IAM ROLE POLICY ATTACHMENT-----
data "aws_iam_policy_document" "lambda_policy_document_read" {
  statement {
    actions = [
      "dynamodb:Query",
    ]
    resources = [
      module.dynamodb.table_arn
    ]
  }
}
resource "aws_iam_policy" "dynamodb_lambda_policy_read" {
  name        = "dynamodb-lambda-policy-read"
  description = "This policy will be used by the lambda to read data from DynamoDB"
  policy      = data.aws_iam_policy_document.lambda_policy_document_read.json
}
resource "aws_iam_role_policy_attachment" "lambda_attachements_reads" {
  role       = module.lambda.lambda_execution_role_names[local.lambda_function_name_get]
  policy_arn = aws_iam_policy.dynamodb_lambda_policy_read.arn
}
