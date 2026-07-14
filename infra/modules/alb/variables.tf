variable "name" {
  type        = string
  description = "Name prefix for ALB resources."
}

variable "env" {
  type        = string
  description = "Enviroment name"
}

variable "vpc_id" {
  type        = string
  description = "VPC where the ALB will be created."
}

variable "public_subnet_ids" {
  type        = list(string)
  description = "Public subnet ids for the ALB."
}

variable "app_port" {
  type        = number
  description = "Backend app port."
}

variable "health_check_path" {
  type        = string
  description = "Path used by the ALB target group health check."
  default     = "/healthz"
}
