resource "aws_cloudfront_origin_access_control" "default" {
  name                              = "default-oec"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "main" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  origin {
    domain_name              = var.s3_bucket_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.default.id
    origin_id                = var.s3_bucket_id
  }

  default_cache_behavior {
    target_origin_id       = var.s3_bucket_id
    viewer_protocol_policy = "redirect-to-https"

    allowed_methods = ["GET", "OPTIONS", "HEAD"]
    cached_methods  = ["GET", "OPTIONS", "HEAD"]

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = {
    Name       = var.cloudfront_name
    Enviroment = var.env
  }
}
