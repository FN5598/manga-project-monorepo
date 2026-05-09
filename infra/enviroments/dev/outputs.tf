output "alb_dns_name" {
  value = module.alb.dns_name
}

output "cloudfront_domain" {
  value = module.cloudfront.cloudfront_domain
}

output "ecr_repository_url" {
  value = module.ecr.repository_url
}

output "ec2_instance_public_ip" {
  value = module.ec2.instance_public_ip
}

