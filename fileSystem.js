const fs = require('fs')

class ProductManager {
    constructor(filename) {
        this.filename = filename
        try {
            this.products = fs.readFileSync(this.filename, 'utf-8')
            this.products = JSON.parse(this.products)
        } catch(error) {
            this.products = []
        }
    }
    getProducts(){
        return this.products
    }
    getProductsById(id){
        try {
            return this.products.filter(product => product.id === id)
        }catch (error){
            return "No existen productos"
        }
    }
   async save(producto) {
        if(this.products.length === 0) {
            producto.id = 1
        } else {
            producto.id = this.products[this.products.length - 1].id + 1
        }

        this.products.push(producto)

        try {
            await fs.promises.writeFile(this.filename, JSON.stringify(this.products, null, '\t'))
            console.log('Producto guardado')
        } catch(error) {
            console.log ("Error al guardar producto", error)
        }
    }
    delete() {
        fs.truncateSync(this.filename, 0, () => console.log('Productos elimnados'))
    }

  async deleteById(id) {
        try {
            const product = this.products.findIndex((producto) => producto.id === id)
            
            if(product !== -1) {
                this.products.splice(product, 1)
                await fs.promises.writeFile(this.filename, JSON.stringify(this.products, null, '\t'))
            } else {
                console.log('No Existen Productos')
            }
        }catch(error) {
            console.log('Error al borrar producto', error)
        }

    }
    async update(id, product) {
        try {
           const oldProduct = this.products.find((product) => product.id === id)
           const index = this.products.findIndex((producto) => producto.id === id)
           
           if(index !== -1) {
            const newProduct = {...oldProduct, ...product}
            this.products[index] = newProduct
            await fs.promises.writeFile(this.filename, JSON.stringify(this.products, null, '\t'))
            console.log('Producto Actualizado')
           }
        }catch(error) {
            console.log('Error al actualizar producto', error);
        }
    }
}

const file = new ProductManager("./savedProducts.json")

// file.save({title: 'Monitor Sony CPD E200',  description: 'Monitor CRT 19 pulgadas Trinitron',  price: 22400, code: 'SN19', thumbnail: 'www.google.com/sonycpde200',stock: 5})
// file.save({title: 'Monitor Dell UltraScan P800', description: 'Monitor CRT 17 pulgadas Trinitron', price: 19220, code: 'AR21', thumbnail: 'www.google.com/dellp800', stock: 3})
// file.save({title: 'Monitor Samsung Syncmaster 3', description: 'Monitor CRT 14 pulgadas', price: 3200, code: 'SM3', thumbnail: 'www.google.com/samsungsync3', stock: 1})

// console.log(file.getProducts())

// file.deleteById(2)
// console.log(file.getProducts())

file.update(3, {title: 'Monitor Samsung Syncmaster 995MB'})
console.log(file.getProducts())
