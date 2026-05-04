variable "env" {
  type        = string
  description = "Enviroment name"
}

variable "cloudfront_arn" {
  type        = string
  description = "Arn of created cloudfront to give read access bucket iam role"
}

variable "s3_bucket_id" {
  type        = string
  description = "S3 bucket id from which static files will be served"
}
