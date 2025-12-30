# Infrastructure: DigitalOcean + Ansible

This folder provisions a DigitalOcean Droplet with Terraform and configures/deploys the app using Ansible and Docker Compose.

## Prereqs
- Terraform >= 1.5
- Ansible >= 2.14
- DigitalOcean Personal Access Token
- An SSH key in your DO account (name), and the private/public keys locally (`~/.ssh/id_rsa`)

## Terraform (DigitalOcean)
Files under `infrastructure/terraform` provision:
- VPC (10.10.0.0/16)
- Ubuntu 22.04 Droplet
- Firewall allowing 22, 80, 443, 3008, 5001

### Variables
- `do_token` (string, required)
- `region` (default `blr1`)
- `ssh_key_name` (string, required; must match an existing DO SSH key name)
- `droplet_size` (default `s-1vcpu-2gb`)
- `image` (default `ubuntu-22-04-x64`)
- `project_name` (default `personal-library`)

### Usage
```bash
# From project root (WSL shell)
cd infrastructure/terraform
export TF_VAR_do_token="<your_do_token>"
terraform init
terraform apply -var="ssh_key_name=<your-do-ssh-key-name>"
# Note the droplet_ip output
```

## Ansible (Configure + Deploy)
Inventory and roles under `infrastructure/ansible`:
- `roles/docker`: installs Docker Engine + compose plugin
- `roles/app`: clones the repo on the droplet and runs `docker compose up -d --build`

### Inventory
Edit `infrastructure/ansible/inventory.ini` and replace `${DROPLET_IP}` with the IP from Terraform output `droplet_ip`.

### Run
```bash
cd infrastructure/ansible
ansible -i inventory.ini -m ping app
ansible-playbook -i inventory.ini site.yml
```

### Notes
- The playbook builds images on the droplet using your existing `compose.yaml` and Dockerfiles.
- If you prefer pulling Docker Hub images instead, update `compose.yaml` services to use `image:` instead of `build:`.
- Default Ansible user is `ansible` created via cloud-init. It uses your local `~/.ssh/id_rsa.pub` for auth.

## CI/CD with Jenkins
The repository includes a `jenkinsfile` that automates build and deployment when you push to GitHub.

### Jenkins Requirements
- Jenkins with the GitHub plugin installed and a Linux agent.
- Ansible installed on the Jenkins agent (`ansible-playbook` in PATH).
- SSH access from Jenkins agent to the droplet. Either:
	- Ensure the private key is at `/var/lib/jenkins/.ssh/id_rsa` on the agent (pipeline default), or
	- Store the SSH key in Jenkins Credentials and pass its ID via pipeline parameter `ANSIBLE_CREDENTIALS_ID`.

### Set Up GitHub Trigger
1. In Jenkins, create a Multibranch Pipeline or Pipeline job pointing to your GitHub repo.
2. Under job settings, enable GitHub hook trigger for GITScm polling.
3. In GitHub, add a webhook to your Jenkins URL: `/github-webhook/` (content type `application/json`).

### Pipeline Behavior
- On push, Jenkins:
	- Checks out code and verifies the backend compiles.
	- Runs Ansible: `ansible-playbook -i infrastructure/ansible/inventory.ini infrastructure/ansible/site.yml` using either the credential ID or default key.
	- Performs a smoke test against the droplet (reads IP from Terraform state) at `http://<droplet_ip>:3008`.

### Parameters (Defaults)
- `ANSIBLE_INVENTORY`: `infrastructure/ansible/inventory.ini`
- `ANSIBLE_PLAYBOOK`: `infrastructure/ansible/site.yml`
- `ANSIBLE_TAGS`: empty (run full playbook)
- `ANSIBLE_CREDENTIALS_ID`: empty (uses `/var/lib/jenkins/.ssh/id_rsa`); set to your Jenkins SSH credential ID to override.

### Troubleshooting
- If smoke test fails, validate ports `3008/5001` are open and containers are healthy: `docker compose ps` on the droplet.
- Ensure the droplet IP in `inventory.ini` matches Terraform output `droplet_ip`.
