terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 2.70"
    }
  }
}

provider "aws" {
  profile    = "default"
  region     = var.region
  access_key = var.access_key
  secret_key = var.secret_key
}

resource "aws_s3_bucket" "online-judge-bucket" {
  bucket = "online-judge-glug"
  acl    = "public-read"
}

data "aws_iam_policy_document" "online-judge-policy-document" {
  statement {
    actions = ["s3:PutObject","s3:GetObjectAcl","s3:GetObject","s3:ListBucket","s3:DeleteObject","s3:PutObjectAcl"]
    resources = [aws_s3_bucket.online-judge-bucket.arn, join("", [aws_s3_bucket.online-judge-bucket.arn, "/*"])]
  }
}

resource "aws_iam_user" "online-judge-iam-user" {
  name = "online-judge"
}

resource "aws_iam_user_policy" "online-judge-policy" {
  name   = "online-judge-policy"
  user   = aws_iam_user.online-judge-iam-user.name
  policy = data.aws_iam_policy_document.online-judge-policy-document.json
}

resource "aws_iam_access_key" "online-judge-iam-user-access-key" {
  user = aws_iam_user.online-judge-iam-user.name
}

output "online-judge-iam-user-access-key" {
  value = aws_iam_access_key.online-judge-iam-user-access-key.id
}

output "online-judge-iam-user-secret-key" {
  value = aws_iam_access_key.online-judge-iam-user-access-key.secret
}

output "online-judge-bucket-domain" {
    value = aws_s3_bucket.online-judge-bucket.bucket_domain_name
}