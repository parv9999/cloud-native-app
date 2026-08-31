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
              apt-get update -y
              apt-get install -y docker.io awscli git
              systemctl start docker
              systemctl enable docker
              usermod -aG docker ubuntu
              EOF

}
