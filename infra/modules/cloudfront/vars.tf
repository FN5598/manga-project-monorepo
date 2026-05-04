variable "env" {
  type        = string
  description = "Enviroment name"
}

variable "s3_bucket_domain_name" {
  type        = string
  description = "S3 domain name for cloudfront"
}

variable "s3_bucket_id" {
  type        = string
  description = "S3 id for cloudfront"
}

variable "cloudfront_name" {
  type        = string
  description = "Name which will be shown in aws UI"
}
