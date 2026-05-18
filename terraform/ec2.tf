resource "aws_instance" "backend" {
  ami                    = "ami-0f5ee92e2d63afc18" # Amazon Linux 2023 (Mumbai)
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.web_sg.id]
  key_name               = aws_key_pair.kp.key_name
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name

  tags = {
    Name = "backend-ec2"
  }

  user_data = <<-EOF
              #!/bin/bash
              # Update OS
              yum update -y
              
              # Install Git and Docker
              yum install -y git docker
              
              # Start and enable Docker service
              systemctl start docker
              systemctl enable docker
              
              # Add ec2-user to docker group
              usermod -aG docker ec2-user
              
              # Clone your repository
              git clone https://github.com/parv9999/cloud-native-app.git /home/ec2-user/app
              cd /home/ec2-user/app/backend
              
              # Build the docker image
              docker build -t my-backend .
              
              # Run the container (Make sure to pass the RDS database environment variables)
              docker run -d -p 5000:5000 \
               -e DB_HOST=${aws_db_instance.mysql.address} \
               -e DB_USER=admin \
               -e DB_PASSWORD=ParvRds123 \
               -e DB_NAME=cloud_native_app \
               -e JWT_SECRET=parvsupersecretkey123 \
               my-backend
              EOF
}
