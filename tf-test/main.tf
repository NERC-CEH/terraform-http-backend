resource "openstack_compute_instance_v2" "load_balancer" {
  name       = "test-state"
  image_name = "ubuntu-1604-20180223"
  flavor_id = "11"
  key_pair   = "llogr-c9834a39ddef2dd489d7bd976d0ac79c"

  network {
    name = "nerc-datalab-U-internal"
  }

  metadata = {
    ssh_user    = "ubuntu"
    groups      = "load-balancers,prod-load-balancers,proxied"
  }
}