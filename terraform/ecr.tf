# ECR repository for storing Docker images of the backend
resource "aws_ecr_repository" "backend" {
  name                 = "cloud-native-app-backend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "${var.project_name}-ecr"
  }
}

output "ecr_repository_url" {
  value       = aws_ecr_repository.backend.repository_url
  description = "ECR URL used to push/pull Docker images"
}
