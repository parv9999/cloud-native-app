# Cloud-Native App — Project Overview

## Architecture
```
User → CloudFront (CDN/HTTPS) → S3 (React build)
User → EC2 (Docker: Node/Express) → RDS MySQL
CI/CD → GitHub Actions → ECR (Docker images) → EC2 / S3
```

## Local Development

### Prerequisites
- Docker & Docker Compose installed

### Run everything locally with one command
```bash
docker-compose up --build
```
| Service  | URL                    |
|----------|------------------------|
| Frontend | http://localhost:3000  |
| Backend  | http://localhost:5000  |
| MySQL    | localhost:3306         |

---

## AWS Infrastructure (Terraform)

### Resources Provisioned
| File                    | Resources                                         |
|-------------------------|---------------------------------------------------|
| `vpc.tf`                | VPC                                               |
| `subnets.tf`            | Public + Private Subnets                          |
| `internet_gateway.tf`   | Internet Gateway + Public Route Table             |
| `security_groups.tf`    | EC2 Security Group (22, 80, 5000) + RDS SG (3306) |
| `ec2.tf`                | EC2 instance (Docker + auto-deploy on boot)       |
| `rds.tf`                | RDS MySQL 8.0 + DB Subnet Group                   |
| `s3.tf`                 | S3 Bucket + Website hosting + Bucket Policy       |
| `cloudfront.tf`         | CloudFront CDN with HTTPS + SPA routing           |
| `ecr.tf`                | ECR Docker image repository                       |
| `outputs.tf`            | EC2 IP, S3 name, CloudFront URL, RDS endpoint     |

### Apply Infrastructure
```bash
cd terraform
terraform init
terraform plan
terraform apply
```

---

## CI/CD Pipeline (GitHub Actions)

### Trigger
Automatically runs on every `git push` to `main`.

### Jobs
1. **Build & Push** — Builds Docker image, pushes to Amazon ECR.
2. **Deploy Backend** — SSHs into EC2, pulls new image, restarts container.
3. **Deploy Frontend** — Runs `npm run build`, syncs to S3, invalidates CloudFront cache.

### Required GitHub Secrets
Go to: **Repository → Settings → Secrets and variables → Actions → New secret**

| Secret Name                  | Description                                  |
|------------------------------|----------------------------------------------|
| `AWS_ACCESS_KEY_ID`          | AWS IAM access key                           |
| `AWS_SECRET_ACCESS_KEY`      | AWS IAM secret key                           |
| `AWS_REGION`                 | e.g., `ap-south-1`                           |
| `EC2_HOST`                   | EC2 public IP (from `terraform output`)      |
| `EC2_USER`                   | `ec2-user` (for Amazon Linux)                |
| `EC2_PRIVATE_KEY`            | Contents of your `.pem` key file             |
| `S3_BUCKET_NAME`             | S3 bucket name (from `terraform output`)     |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront ID (from AWS Console)             |
| `DB_HOST`                    | RDS endpoint (from `terraform output`)       |
| `DB_PASSWORD`                | `parvrds@123`                                |
| `JWT_SECRET`                 | `parvsupersecretkey123`                      |

---

## Deployment Order (First Time)
1. `terraform apply` — provision all AWS infrastructure
2. Push to `main` — GitHub Actions will build images, deploy backend to EC2, and frontend to S3
3. Visit the `cloudfront_url` from `terraform output`
