<template>
<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
  <div class="container-fluid">

    <a class="navbar-brand" href="#">Send2.name</a>

    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarColor01">

      <ul class="navbar-nav ms-auto">

        <li class="nav-item">
          <button class="btn btn-primary">About</button>
        </li>

        <li class="nav-item dropdown">
          <button class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" type="button" aria-haspopup="true" aria-expanded="false">Dropdown</button>
          <div class="dropdown-menu dropdown-menu-end">
            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
            <a class="dropdown-item" href="#">Something else here</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#">Separated link</a>
          </div>
        </li>

      </ul>

    </div>
  </div>
</nav>
</template>

<script>
import { useBoard, useEthers, useWallet, shortenAddress } from 'vue-dapp';

export default {
  name: "Navbar",

  setup() {
    const { open } = useBoard();
		const { address, isActivated } = useEthers();
		const { disconnect } = useWallet();

		return {
			address,
			disconnect,
			isActivated,
			open,
			shortenAddress
		}
  },
}
</script>
