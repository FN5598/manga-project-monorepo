data "aws_ami" "server_ami" {
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-resolute-26.04-amd64-server-*"]
  }
}

resource "aws_instance" "main" {
  ami           = data.aws_ami.server_ami.id
  instance_type = var.instance_type
  user_data     = var.docker == true ? file("./docker.install.script.tpl") : {}

  tags = {
    Name       = var.name
    Enviroment = var.env
  }
}
