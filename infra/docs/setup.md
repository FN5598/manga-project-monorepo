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
