# Infrastructure Setup

This setup is designed for a free-tier CloudFront deployment without Route 53 or ACM certificates.

## Structure

- `bootstrap` contains the scripts for provisioning shared infrastructure, including DocumentDB and S3 storage. It also manages the lock file used by the setup process.
- `docs` contains documentation for the project infrastructure.
- `environments` contains deployment-specific configuration for each app environment.
- `modules` contains reusable Terraform modules for the AWS services used by the app.

## Current Limitations

CloudFront is currently configured only for serving static files from S3.

ECR is used to store Docker images for the application.

## Dev Environment

Create a local variables file before planning the dev stack:

```bash
cd infra/enviroments/dev
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` and set a globally unique `static_assets_bucket_name`.

Then run:

```bash
terraform init
terraform plan
```

The dev stack creates:

- a VPC with two public subnets
- an S3 bucket fronted by CloudFront for static assets
- an ECR repository for the backend image
- an internet-facing ALB
- one EC2 instance registered behind the ALB

The default AWS profile is `terraform-fcc`. Override `aws_profile` in `terraform.tfvars` if needed.
