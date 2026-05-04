data "aws_iam_policy_document" "cloudfront_s3_access_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${var.cloudfront_arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      values   = [var.cloudfront_arn]
      variable = "AWS:SourceArn"
    }
  }
}

resource "aws_s3_bucket_policy" "example" {
  bucket = var.s3_bucket_id
  policy = data.aws_iam_policy_document.cloudfront_s3_access_policy.json
}
