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
