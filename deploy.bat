@echo off
echo Starting deployment to DigitalOcean...

cd infrastructure\terraform

echo Provisioning infrastructure...
terraform init
terraform apply -auto-approve

echo Getting droplet IP...
for /f "tokens=*" %%i in ('terraform output -raw droplet_ip') do set DROPLET_IP=%%i
echo Droplet IP: %DROPLET_IP%

cd ..\ansible

echo Waiting for droplet to be ready...
timeout /t 60 /nobreak

echo Testing connection...
ansible -i inventory.ini -m ping app

echo Deploying application...
ansible-playbook -i inventory.ini site.yml

echo Deployment complete! Access your app at: http://%DROPLET_IP%