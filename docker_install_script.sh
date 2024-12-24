#!/bin/bash

# Update the package list
sudo apt-get update -y

# Install required dependencies for Docker
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Set up the Docker stable repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update the package list with Docker packages
sudo apt-get update -y

# Install Docker Engine, CLI, and Compose
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Install standalone Docker Compose (optional, if not using the plugin)
sudo apt-get install -y docker-compose

# Start and enable the Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add the current user to the Docker group for non-root access
sudo usermod -aG docker $USER

# Adjust permissions for the Docker socket (optional but useful for some CI/CD setups)
sudo chmod 666 /var/run/docker.sock

# Restart Docker to apply changes
sudo systemctl restart docker

# Output Docker version to verify installation
docker --version

# Output Docker Compose version to verify installation
docker-compose --version

echo "Docker installation completed successfully."


# Set Terraform GPG key and repository URL
TERRAFORM_GPG_URL="https://apt.releases.hashicorp.com/gpg"
TERRAFORM_REPO="https://apt.releases.hashicorp.com"
KEYRING_PATH="/usr/share/keyrings/hashicorp-archive-keyring.gpg"
SOURCE_LIST_PATH="/etc/apt/sources.list.d/hashicorp.list"

# Step 1: Download and add HashiCorp GPG key securely
echo "Adding HashiCorp GPG key..."
sudo wget -qO - "$TERRAFORM_GPG_URL" | sudo gpg --dearmor -o "$KEYRING_PATH"
sudo chmod 644 "$KEYRING_PATH"

# Step 2: Add HashiCorp APT repository with proper GPG keyring
echo "Setting up HashiCorp APT repository..."
echo "deb [arch=$(dpkg --print-architecture) signed-by=$KEYRING_PATH] $TERRAFORM_REPO $(lsb_release -cs) main" | sudo tee "$SOURCE_LIST_PATH" > /dev/null

# Step 3: Update package list and install Terraform
echo "Updating package list and installing Terraform..."
sudo apt-get update -y
sudo apt-get install -y terraform

# Step 4: Verify the installation of Terraform
echo "Terraform installation completed. Verifying version..."
terraform --version

# Output completion message
echo "Terraform installation is complete."

sudo apt-get install zip

zip --version

echo "Zip installation completed successfully."