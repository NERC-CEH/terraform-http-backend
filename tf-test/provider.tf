terraform {
  backend "http" {
    address = "http://localhost:8000/state/datalabs"
    lock_address = "http://localhost:8000/state/datalabs"
    unlock_address = "http://localhost:8000/state/datalabs"
    username = "username"
    password = "password"
  }
}

provider "openstack" {
  cloud = "jasmin"
  insecure = true
}
