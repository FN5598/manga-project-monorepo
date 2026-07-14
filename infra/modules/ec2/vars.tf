variable "env" {
  type        = string
  description = "Enviroment name"
}

variable "instance_type" {
  type        = string
  description = "Size of ec2 to be deployed"
}

variable "name" {
  type        = string
  description = "Name by which ec2 will be identified"
}

variable "docker" {
  type        = bool
  description = "If set to true will preinstall docker on instance"
}

variable "app_port" {
  type        = number
  description = "Backend app port."
  default     = 4000
}

variable "vpc_id" {
  type        = string
  description = "VPC id for the EC2 security group."
}

variable "subnet_id" {
  type        = string
  description = "Subnet id where the EC2 instance will run."
}

variable "alb_security_group_id" {
  type        = string
  description = "ALB security group allowed to reach the backend."
}

variable "target_group_arn" {
  type        = string
  description = "ALB target group ARN where the instance will be registered."
}

variable "iam_instance_profile_name" {
  type        = string
  description = "IAM instance profile name for EC2."
  default     = null
}

variable "key_name" {
  type        = string
  description = "Existing AWS EC2 key pair name used for SSH."
  default     = null
}

variable "ssh_allowed_cidr" {
  type        = string
  description = "Trusted CIDR allowed to SSH to the EC2 instance."
  default     = null
  nullable    = true
}
