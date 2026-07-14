output "cloudfront_domain" {
  value = aws_cloudfront_distribution.main.domain_name
}

output "distribution_arn" {
  value = aws_cloudfront_distribution.main.arn
}

output "distribution_id" {
  value = aws_cloudfront_distribution.main.id
}
