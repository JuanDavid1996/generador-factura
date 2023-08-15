<template>
  <div class="container-fluid mt-2">
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
          <li v-for="(product, index) in products">{{ product }}  <a href="#" @click="removeProduct(index)">Quitar</a></li>
        </ul>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-12">
        <div class="table-responsive">
          <table class="table table-striped table-hover table-bordered">
            <thead>
            <tr>
              <th>Cantidad</th>
              <th>Concepto</th>
              <th>Precio</th>
              <th>
                Descuento&nbsp;&nbsp;
                <input type="checkbox" v-model="globalDiscount"> Aplicar a todos
              </th>
              <th>Subtotal</th>
              <th>Acción</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>
                <input class="form-control" min="0" v-model="item.quantity" type="number">
              </td>
              <td>
                <select class="form-control" v-model="item.description">
                  <option v-for="product in products" :value="product">{{ product }}</option>
                </select>
              </td>
              <td>
                <input class="form-control" min="0" step="1000" v-model="item.price" type="number">
              </td>
              <td>
                <div class="input-group" v-if="item.id == 1">
                  <input class="form-control" min="0" max="100" v-model="item.discount" type="number">
                  <button class="btn btn-success" disabled>%</button>
                </div>
                <div class="input-group" v-else-if="item.id !== 1 && !globalDiscount">
                  <input class="form-control" min="0" max="100" v-model="item.discount" type="number">
                  <button class="btn btn-success" disabled>%</button>
                </div>
                <div v-else>
                  {{ items[0].discount }}
                </div>
              </td>
              <td>
                {{ calculateSubtotal(item).toLocaleString('es-CO', {currency: 'COP', style: 'currency'}) }}
              </td>
              <td>
                <button v-if="item.id !== 1" class="btn btn-danger icon" @click="remove(item.id)">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                        d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM9 11V17H11V11H9ZM13 11V17H15V11H13ZM9 4V6H15V4H9Z"></path>
                  </svg>
                </button>
                &nbsp;
                <button class="btn btn-success icon" @click="duplicate(item)">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                        d="M6.9998 6V3C6.9998 2.44772 7.44752 2 7.9998 2H19.9998C20.5521 2 20.9998 2.44772 20.9998 3V17C20.9998 17.5523 20.5521 18 19.9998 18H16.9998V20.9991C16.9998 21.5519 16.5499 22 15.993 22H4.00666C3.45059 22 3 21.5554 3 20.9991L3.0026 7.00087C3.0027 6.44811 3.45264 6 4.00942 6H6.9998ZM8.9998 6H16.9998V16H18.9998V4H8.9998V6Z"></path>
                  </svg>
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="row mt-2">
      <div class="col-sm-6">
        <button @click="add" class="btn btn-primary">Añadir otro</button>
      </div>
    </div>
    <div class="row mt-2">
      <div class="col-sm-12">
        <p>Total es: {{ total.toLocaleString('es-CO', {currency: 'COP', style: 'currency'}) }}</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const products = ref<string[]>([])
const productName = ref<string>("")

interface Item {
  id: number
  description: string
  quantity: number
  price: number
  discount: number
}

const items = ref<Item[]>([
  {
    id: 1,
    description: "",
    quantity: 1,
    price: 0,
    discount: 0,
  }
])

const lastId = ref(1)

const add = () => {
  lastId.value++
  items.value.push({
    id: lastId.value,
    description: "",
    quantity: 0,
    price: 0,
    discount: 0,
  })
}

const duplicate = (item: Item) => {
  lastId.value++
  items.value.push({
    id: lastId.value,
    description: item.description,
    quantity: item.quantity,
    price: item.price,
    discount: item.discount,
  })
}

const remove = (id: number) => {
  items.value = items.value.filter((item) => item.id !== id)
}

const total = computed(() => items.value.reduce((acc: number, item: Item) => {
  return acc + calculateSubtotal(item);
}, 0));

const globalDiscount = ref(false)

const calculateSubtotal = ({price, quantity, discount}: Item) => {
  if (price && quantity && globalDiscount.value && items.value[0].discount) {
    return (price * quantity) * (1 - (items.value[0].discount / 100))
  } else if (price && quantity && discount) {
    return (price * quantity) * (1 - (discount / 100))
  } else if (price && quantity) {
    return price * quantity
  }
  return 0
}

onMounted(() => {
  loadProductsFromLocalStorage()
})

const saveProduct = () => {
  products.value = [...products.value, productName.value]
  localStorage.setItem("products", JSON.stringify(products.value))
  productName.value = ""
}

const removeProduct = (index: number) => {
  products.value.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(products.value))
}

const loadProductsFromLocalStorage = () => {
  const localStorageProducts = localStorage.getItem("products")
  products.value = localStorageProducts != null ? JSON.parse(localStorageProducts) : []
}

</script>
<style>
button.icon {
  height: 50px;
  width: 60px;
}
</style>