module "vpc" {
  source = "../../modules/vpc"

  name = local.name
  env  = local.env
}

module "s3" {
  source = "../../modules/s3"

  env                  = local.env
  s3_bucket_name       = var.static_assets_bucket_name
  allowed_cors_origins = var.s3_allowed_cors_origins
}

module "cloudfront" {
  source = "../../modules/cloudfront"

  env                   = local.env
  cloudfront_name       = "${local.name}-static"
  s3_bucket_domain_name = module.s3.bucket_regional_domain_name
  s3_bucket_id          = module.s3.bucket_id
  alb_dns_name          = module.alb.dns_name
}

module "iam" {
  source = "../../modules/iam"

  name                        = local.name
  env                         = local.env
  ecr_repository_arn          = module.ecr.repository_arn
  s3_bucket_arn               = module.s3.bucket_arn
  s3_bucket_id                = module.s3.bucket_id
  cloudfront_distribution_arn = module.cloudfront.distribution_arn
  secrets_manager_arn         = var.secrets_manager_arn
}

module "ecr" {
  source = "../../modules/ecr"

  name = local.name
}

module "alb" {
  source = "../../modules/alb"

  name              = local.name
  env               = local.env
  vpc_id            = module.vpc.vpc_id
  public_subnet_ids = module.vpc.public_subnet_ids
  app_port          = var.app_port
}

module "ec2" {
  source = "../../modules/ec2"

  env                       = local.env
  name                      = "${local.name}-api"
  instance_type             = var.instance_type
  docker                    = true
  app_port                  = var.app_port
  vpc_id                    = module.vpc.vpc_id
  subnet_id                 = module.vpc.public_subnet_ids[0]
  alb_security_group_id     = module.alb.security_group_id
  target_group_arn          = module.alb.target_group_arn
  iam_instance_profile_name = module.iam.ec2_instance_profile_name
  key_name                  = var.ec2_key_name
  ssh_allowed_cidr          = var.ssh_allowed_cidr
}
