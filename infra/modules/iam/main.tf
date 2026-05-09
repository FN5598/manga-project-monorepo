data "aws_iam_policy_document" "cloudfront_s3_access_policy" {
  statement {
    sid    = "AllowCloudFrontReadObjects"
    effect = "Allow"

    actions = [
      "s3:GetObject"
    ]

    resources = [
      "${var.s3_bucket_arn}/*"
    ]

    principals {
      type = "Service"

      identifiers = [
        "cloudfront.amazonaws.com",
      ]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"

      values = [
        var.cloudfront_distribution_arn
      ]
    }
  }
}

resource "aws_s3_bucket_policy" "example" {
  bucket = var.s3_bucket_id
  policy = data.aws_iam_policy_document.cloudfront_s3_access_policy.json
}

data "aws_iam_policy_document" "ec2_secrets_manager_policy" {
  count = var.secrets_manager_arn == null ? 0 : 1

  statement {
    sid    = "AllowReadSpecificSecret"
    effect = "Allow"

    actions = [
      "secretsmanager:GetSecretValue",
    ]

    resources = [
      var.secrets_manager_arn
    ]
  }
}

data "aws_iam_policy_document" "ec2_assume_role" {
  statement {
    effect = "Allow"

    actions = [
      "sts:AssumeRole",
    ]

    principals {
      type = "Service"

      identifiers = [
        "ec2.amazonaws.com",
      ]
    }
  }
}

data "aws_iam_policy_document" "ec2_s3_app_policy" {
  statement {
    sid    = "AllowListAppBucket"
    effect = "Allow"

    actions = [
      "s3:ListBucket",
    ]

    resources = [
      var.s3_bucket_arn,
    ]
  }

  statement {
    sid    = "AllowManageAppObjects"
    effect = "Allow"

    actions = [
      "s3:DeleteObject",
      "s3:DeleteObjectVersion",
      "s3:GetObject",
      "s3:PutObject",
    ]

    resources = [
      "${var.s3_bucket_arn}/*",
    ]
  }
}

data "aws_iam_policy_document" "ec2_ecr_pull_policy" {
  statement {
    sid    = "AllowEcrAuthToken"
    effect = "Allow"

    actions = [
      "ecr:GetAuthorizationToken",
    ]

    resources = ["*"]
  }

  statement {
    sid    = "AllowPullAppImage"
    effect = "Allow"

    actions = [
      "ecr:BatchCheckLayerAvailability",
      "ecr:BatchGetImage",
      "ecr:GetDownloadUrlForLayer",
    ]

    resources = [
      var.ecr_repository_arn,
    ]
  }
}

resource "aws_iam_role" "ec2_role" {
  name               = "${var.name}-ec2-role"
  assume_role_policy = data.aws_iam_policy_document.ec2_assume_role.json

  tags = {
    Name       = "${var.name}-ec2-role"
    Enviroment = var.env
  }
}

resource "aws_iam_policy" "ec2_s3_app" {
  name   = "${var.name}-ec2-s3-app"
  policy = data.aws_iam_policy_document.ec2_s3_app_policy.json

  tags = {
    Name       = "${var.name}-ec2-s3-app"
    Enviroment = var.env
  }
}

resource "aws_iam_role_policy_attachment" "ec2_s3_app" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = aws_iam_policy.ec2_s3_app.arn
}

resource "aws_iam_policy" "ec2_ecr_pull" {
  name   = "${var.name}-ec2-ecr-pull"
  policy = data.aws_iam_policy_document.ec2_ecr_pull_policy.json

  tags = {
    Name       = "${var.name}-ec2-ecr-pull"
    Enviroment = var.env
  }
}

resource "aws_iam_role_policy_attachment" "ec2_ecr_pull" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = aws_iam_policy.ec2_ecr_pull.arn
}

resource "aws_iam_policy" "ec2_secrets_manager" {
  count = var.secrets_manager_arn == null ? 0 : 1

  name   = "${var.name}-ec2-secrets"
  policy = data.aws_iam_policy_document.ec2_secrets_manager_policy[0].json

  tags = {
    Name       = "${var.name}-ec2-secrets"
    Enviroment = var.env
  }
}

resource "aws_iam_role_policy_attachment" "ec2_secrets_manager" {
  count = var.secrets_manager_arn == null ? 0 : 1

  role       = aws_iam_role.ec2_role.name
  policy_arn = aws_iam_policy.ec2_secrets_manager[0].arn
}

resource "aws_iam_instance_profile" "ec2" {
  name = "${var.name}-ec2-profile"
  role = aws_iam_role.ec2_role.name
}
