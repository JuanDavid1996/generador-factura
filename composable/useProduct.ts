const products = ref<string[]>([])
const productName = ref<string>("")

export const useProduct = () => {
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

    return {products, productName, saveProduct, removeProduct, loadProductsFromLocalStorage}
}