variable "project_name" {
  type        = string
  description = "Project name used as a prefix for AWS resources."
  default     = "manga-project"
}

variable "aws_region" {
  type        = string
  description = "AWS region for the dev environment."
  default     = "eu-central-1"
}

variable "aws_profile" {
  type        = string
  description = "Local AWS CLI profile used by Terraform."
  default     = "terraform-fcc"
}

variable "static_assets_bucket_name" {
  type        = string
  description = "Globally unique S3 bucket name for static client assets."
}

variable "s3_allowed_cors_origins" {
  type        = list(string)
  description = "Browser origins allowed to upload/read files directly through S3."
  default     = ["http://localhost:5173"]
}

variable "instance_type" {
  type        = string
  description = "EC2 instance type for the backend API."
  default     = "t3.micro"
}

variable "ec2_key_name" {
  type        = string
  description = "Existing AWS EC2 key pair name used for SSH."
  default     = null
  nullable    = true
}

variable "ssh_allowed_cidr" {
  type        = string
  description = "Trusted CIDR allowed to SSH to the EC2 instance, for example 203.0.113.10/32."
  default     = null
  nullable    = true
}

variable "app_port" {
  type        = number
  description = "Port exposed by the backend container on EC2."
  default     = 8000
}

variable "secrets_manager_arn" {
  type        = string
  description = "Optional Secrets Manager secret ARN that the EC2 role can read."
  default     = null
  nullable    = true
}
