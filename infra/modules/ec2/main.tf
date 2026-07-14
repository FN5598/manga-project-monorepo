data "aws_ami" "server_ami" {
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-resolute-26.04-amd64-server-*"]
  }
}

resource "aws_security_group" "ec2" {
  name        = "${var.name}-ec2-sg"
  description = "Allow app traffic only from ALB"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = var.app_port
    to_port         = var.app_port
    protocol        = "tcp"
    security_groups = [var.alb_security_group_id]
    description     = "App traffic from ALB only"
  }

  dynamic "ingress" {
    for_each = var.ssh_allowed_cidr == null ? [] : [var.ssh_allowed_cidr]

    content {
      from_port   = 22
      to_port     = 22
      protocol    = "tcp"
      cidr_blocks = [ingress.value]
      description = "SSH from trusted IP"
    }
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name       = "${var.name}-ec2-sg"
    Enviroment = var.env
  }
}

resource "aws_instance" "main" {
  ami                         = data.aws_ami.server_ami.id
  instance_type               = var.instance_type
  subnet_id                   = var.subnet_id
  vpc_security_group_ids      = [aws_security_group.ec2.id]
  associate_public_ip_address = true
  iam_instance_profile        = var.iam_instance_profile_name
  key_name                    = var.key_name
  user_data                   = var.docker ? file("${path.module}/docker.install.script.tpl") : null

  tags = {
    Name       = var.name
    Enviroment = var.env
  }
}

resource "aws_lb_target_group_attachment" "main" {
  target_group_arn = var.target_group_arn
  target_id        = aws_instance.main.id
  port             = var.app_port
}
