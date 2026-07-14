variable "env" {
  type        = string
  description = "Enviroment name"
}

variable "s3_bucket_name" {
  type        = string
  description = "Name of bucket"
}

variable "allowed_cors_origins" {
  type        = list(string)
  description = "Origins allowed to upload/read browser assets through S3 CORS."
}
