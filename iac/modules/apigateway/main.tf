resource "aws_api_gateway_rest_api" "my_api" {
  name        = "places-api"
  description = "My places demo API"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_resource" "root" {
  rest_api_id = aws_api_gateway_rest_api.my_api.id
  parent_id   = aws_api_gateway_rest_api.my_api.root_resource_id
  path_part   = "places"
}

resource "aws_api_gateway_usage_plan" "usage_plan" {
  name        = "Places API Usage Plan"
  description = "Usage plan for the Places API"
  api_stages {
    api_id = aws_api_gateway_rest_api.my_api.id
    stage  = aws_api_gateway_stage.deployment_stage.stage_name
  }
  quota_settings {
    limit  = 1000
    period = "DAY"
  }
  throttle_settings {
    burst_limit = 6
    rate_limit  = 3
  }
}

resource "aws_api_gateway_api_key" "new_key" {
  name        = "PlacesAPIKey"
  description = "API key for places usage"
}
resource "aws_api_gateway_usage_plan_key" "example_usage_plan_key" {
  key_id        = aws_api_gateway_api_key.new_key.id
  key_type      = "API_KEY"
  usage_plan_id = aws_api_gateway_usage_plan.usage_plan.id
}

//-------------CREATING ROUTES-------------
resource "aws_api_gateway_method" "proxys" {
  for_each         = var.lambda_routes
  rest_api_id      = aws_api_gateway_rest_api.my_api.id
  resource_id      = aws_api_gateway_resource.root.id
  http_method      = each.value.http_method
  authorization    = "NONE"
  api_key_required = true
  request_parameters = {
    "method.request.header.x-api-key" = true
  }
}

resource "aws_api_gateway_integration" "lambda_integrations" {
  for_each                = var.lambda_routes
  rest_api_id             = aws_api_gateway_rest_api.my_api.id
  resource_id             = aws_api_gateway_resource.root.id
  http_method             = aws_api_gateway_method.proxys[each.key].http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = each.value.lambda_invoke_arn
}
//-------------END ROUTES-------------

resource "aws_api_gateway_deployment" "deployment_places" {
  rest_api_id = aws_api_gateway_rest_api.my_api.id

  triggers = {
    redeployment = sha1(jsonencode(aws_api_gateway_rest_api.my_api.body))
  }

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [aws_api_gateway_method.proxys, aws_api_gateway_integration.lambda_integrations]
}

resource "aws_api_gateway_stage" "deployment_stage" {
  deployment_id = aws_api_gateway_deployment.deployment_places.id
  rest_api_id   = aws_api_gateway_rest_api.my_api.id
  stage_name    = "prod"
}

resource "aws_api_gateway_method_settings" "deployment_method_settings" {
  rest_api_id = aws_api_gateway_rest_api.my_api.id
  stage_name  = aws_api_gateway_stage.deployment_stage.stage_name
  method_path = "*/*"

  settings {
    logging_level = "OFF"
  }
}
