output "ec2_public_ip" {
  value       = aws_instance.backend.public_ip
  description = "Public IP address of the backend EC2 instance"
}

output "s3_bucket_name" {
  value       = aws_s3_bucket.frontend.bucket
  description = "S3 bucket name for the React frontend"
}

output "cloudfront_url" {
  value       = "https://${aws_cloudfront_distribution.frontend.domain_name}"
  description = "CloudFront public URL for the frontend (HTTPS)"
}

output "rds_endpoint" {
  value       = aws_db_instance.mysql.address
  description = "RDS MySQL endpoint to be used by the backend"
}

output "private_key_pem" {
  value       = tls_private_key.pk.private_key_pem
  description = "Private key for SSH access to EC2"
  sensitive   = true
}
