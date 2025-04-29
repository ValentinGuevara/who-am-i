resource "aws_dynamodb_table" "new_table" {
  name           = var.table_name
  billing_mode   = "PAY_PER_REQUEST"
  read_capacity  = var.read_capacity
  write_capacity = var.write_capacity
  hash_key       = var.partition_key
  range_key      = var.sort_key

  dynamic "attribute" {
    for_each = var.attribute_definitions
    content {
      name = attribute.value.attribute_name
      type = attribute.value.attribute_type
    }
  }

  tags = {
    Name        = "dynamodb-table-example"
    Environment = "deployed"
  }
}
