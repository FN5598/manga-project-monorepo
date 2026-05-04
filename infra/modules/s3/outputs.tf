output "s3_bucket_name" {
  value = aws_s3_bucket.manga_storage_bucket.bucket_regional_domain_name
}
