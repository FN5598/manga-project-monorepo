variable "name" {
  type        = string
  description = "Name prefix for VPC resources."
}

variable "env" {
  type        = string
  description = "Enviroment name"
}

variable "cidr_block" {
  type        = string
  description = "CIDR block for the VPC."
  default     = "10.20.0.0/16"
}

variable "public_subnet_cidrs" {
  type        = list(string)
  description = "CIDR blocks for public subnets."
  default     = ["10.20.1.0/24", "10.20.2.0/24"]
}
