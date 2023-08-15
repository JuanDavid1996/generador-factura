<script setup lang="ts">
const route = useRoute()

const isActive = (path: string): boolean => {
  return route.path == path || route.name as string == path
}

</script>

<template>
  <nav class="navbar navbar-dark bg-dark navbar-expand-lg no-print">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Generador-Factura</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <NuxtLink :class="{'active': isActive('/')}" class="nav-link" aria-current="page" to="/">Nueva Factura
            </NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink :class="{'active': isActive('/products')}" class="nav-link" to="/products">Productos</NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar-brand, .nav-item .nav-link {
  color: white;
}

.nav-link.active {
  color: #0d6efd;
}
</style>