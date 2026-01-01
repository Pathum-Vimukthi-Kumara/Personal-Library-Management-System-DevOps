terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}

provider "digitalocean" {
  token = var.do_token
}

resource "digitalocean_droplet" "web" {
  image  = "ubuntu-22-04-x64"
  name   = "devops-project"
  region = var.region
  size   = "s-1vcpu-2gb"
  
  ssh_keys = [digitalocean_ssh_key.default.fingerprint]
  
  user_data = <<-EOF
    #!/bin/bash
    apt update
    apt install -y git
    useradd -m -s /bin/bash ansible
    mkdir -p /home/ansible/.ssh
    echo "${file(pathexpand(var.ssh_key_path))}" > /home/ansible/.ssh/authorized_keys
    chown -R ansible:ansible /home/ansible/.ssh
    chmod 700 /home/ansible/.ssh
    chmod 600 /home/ansible/.ssh/authorized_keys
    echo "ansible ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/ansible
  EOF
}

resource "digitalocean_ssh_key" "default" {
  name       = "devops-key"
  public_key = file(pathexpand(var.ssh_key_path))
}

output "droplet_ip" {
  value = digitalocean_droplet.web.ipv4_address
}