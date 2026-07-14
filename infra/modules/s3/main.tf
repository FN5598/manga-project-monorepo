resource "aws_s3_bucket" "main" {
  bucket = var.s3_bucket_name

  tags = {
    Name       = var.s3_bucket_name
    Enviroment = var.env
  }
}

resource "aws_s3_bucket_cors_configuration" "main" {
  bucket = aws_s3_bucket.main.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD", "PUT"]
    allowed_origins = var.allowed_cors_origins
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}
