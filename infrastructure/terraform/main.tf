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
  size   = var.droplet_size
  
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

# Keep a stable public IP even when resizing/recreating the droplet
resource "digitalocean_reserved_ip" "main" {
  region = var.region
}

resource "digitalocean_reserved_ip_assignment" "main" {
  ip_address = digitalocean_reserved_ip.main.ip_address
  droplet_id = digitalocean_droplet.web.id
}

resource "digitalocean_ssh_key" "default" {
  name       = "devops-key"
  public_key = file(pathexpand(var.ssh_key_path))
}

output "droplet_ip" {
  value = digitalocean_droplet.web.ipv4_address
}

output "public_ip" {
  description = "Reserved public IP attached to the droplet"
  value       = digitalocean_reserved_ip.main.ip_address
}