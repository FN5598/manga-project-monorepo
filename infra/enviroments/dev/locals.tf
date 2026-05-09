locals {
  region = var.aws_region
  env    = "dev"
  name   = "${var.project_name}-${local.env}"
}
