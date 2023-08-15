<script setup lang="ts">
import Navbar from "~/components/Navbar.vue";
import {useProduct} from "~/composable/useProduct";

const {products, productName, saveProduct, removeProduct, loadProductsFromLocalStorage} = useProduct()

onMounted(() => {
  loadProductsFromLocalStorage()
})


</script>

<template>
  <Navbar/>
  <div class="container-fluid mt-2">
    <div class="row">
      <div class="col">
        Añade productos aquí
      </div>
    </div>
    <div class="row">
      <div class="col-sm-6">
        <div class="input-group">
          <input v-model="productName" type="text" class="form-control">
          <button @click.prevent="saveProduct" class="btn btn-success">Guardar</button>
        </div>
      </div>
    </div>
    <div class="row mt-2">
      <div class="col-sm-6">
        <ul>
          <li v-for="(product, index) in products">{{ product }} <a href="#" @click="removeProduct(index)">Quitar</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>