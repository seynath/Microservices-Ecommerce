locals {
  first_public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQC2nhqis39E5ubX021Pmf/D0UkGbqsrX0a+CJkFfyDZtiy3rUZTEn94tBBwtpEykLUGk9dd3a02HC0qhNonYEO+MI1iOYkoenovsl0WaqndxYGxj5+Y75BU1McmKbpBeUhTg/tLrX7ngZe9iKrKOS0aYNY9OnmS8uuyfUXd2BGAl0O76QldR0ABOpVLs3AjAzs676VgWT6Gt8hG4jzHUDGJMFMMLHrcsCi3ji1z463QReJ3m4MNAjzZshO1NjkjuN8FYQCzCIiBEwMmVY3rELwQqVZMUm5AOcxNr26Tefi8fvGfieGmrhPNtltei7tjVjNeXn1RDzNPr8eYqH5UYjCsHmfUj2TkFYpaQdqtncmnOD2QqdZLzzvpQgFRzL+m7yG1u+TmDBkYM3/wjUaynJIsBEm0kTbswlvmRly5LqGSaxONp7ALGuGPu9aNj/K1Hfwrn/p7qOlFYtN9aby7cdZgKlbscrXNTAW15gBQ1hrEMMbKOqV0dboon+vCK1BU3Sqso2qT6MJHrdbFbHaVLVKz/+VEbju22is7B28xHLUsZQLjHCKRn3AWduJc9UANUFRYDCdZxQHgwRyWPz8/BxiWh76jbYEKCmO1Ndsj4s+NWmaCGPlwnqzpbRwNoHXAyfS4qfSa93RDGz1G6qmuiI71h5RrHpViG9rdHe5voCB40w== seynath@outlook.com"
}

resource "azurerm_resource_group" "example" {
  name     = "${var.prefix}-resources"
  location = var.location
}

resource "azurerm_virtual_network" "example" {
  name                = "example-network"
  resource_group_name = azurerm_resource_group.example.name
  location            = azurerm_resource_group.example.location
  address_space       = ["10.0.0.0/16"]
}

resource "azurerm_subnet" "internal" {
  name                 = "internal"
  resource_group_name  = azurerm_resource_group.example.name
  virtual_network_name = azurerm_virtual_network.example.name
  address_prefixes     = ["10.0.2.0/24"]
}

resource "azurerm_linux_virtual_machine_scale_set" "example" {
  name                = "example-vmss"
  resource_group_name = azurerm_resource_group.example.name
  location            = azurerm_resource_group.example.location
  sku                 = "Standard_B1s"
  instances           = 2
  admin_username      = "adminuser"

  admin_ssh_key {
    username   = "adminuser"
    public_key = local.first_public_key
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts"
    version   = "latest"
  }

  os_disk {
    storage_account_type = "Standard_LRS"
    caching              = "ReadWrite"
  }

  network_interface {
    name    = "example"
    primary = true

    ip_configuration {
      name      = "internal"
      primary   = true
      subnet_id = azurerm_subnet.internal.id
    }
  }
}
