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
