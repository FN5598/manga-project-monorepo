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

variable "alb_dns_name" {
  type        = string
  description = "ALB DNS name used as the API origin."
}

variable "api_path_patterns" {
  type        = list(string)
  description = "CloudFront path patterns routed to the ALB API origin."
  default     = ["/api/*", "/graphql", "/graphql/*", "/manga/*", "/healthz"]
}
