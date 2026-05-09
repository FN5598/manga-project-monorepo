variable "name" {
  type        = string
  description = "Name prefix for IAM resources."
}

variable "env" {
  type        = string
  description = "Enviroment name"
}

variable "s3_bucket_arn" {
  type        = string
  description = "S3 arn to give read access to cloudfront"
}

variable "s3_bucket_id" {
  type        = string
  description = "S3 bucket id from which static files will be served"
}

variable "secrets_manager_arn" {
  type        = string
  description = "Arn of AWS secrets manager resource to pull latest envs"
  default     = null
  nullable    = true
}

variable "cloudfront_distribution_arn" {
  type        = string
  description = "Arn of distrubted arn for s3 access check"
}

variable "ecr_repository_arn" {
  type        = string
  description = "ECR repository ARN that EC2 can pull backend images from."
}
