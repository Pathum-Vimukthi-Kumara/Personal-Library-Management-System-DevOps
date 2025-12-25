#!/bin/bash

# Deploy script for Personal Library System
echo "Starting deployment to DigitalOcean..."

# Navigate to terraform directory
cd infrastructure/terraform

# Initialize and apply terraform
echo "Provisioning infrastructure..."
terraform init
terraform apply -auto-approve

# Get droplet IP
DROPLET_IP=$(terraform output -raw droplet_ip)
echo "Droplet IP: $DROPLET_IP"

# Update ansible inventory
cd ../ansible
sed -i "s/\${DROPLET_IP}/$DROPLET_IP/g" inventory.ini

# Wait for droplet to be ready
echo "Waiting for droplet to be ready..."
sleep 60

# Test connection
echo "Testing connection..."
ansible -i inventory.ini -m ping app

# Deploy application
echo "Deploying application..."
ansible-playbook -i inventory.ini site.yml

echo "Deployment complete! Access your app at: http://$DROPLET_IP"