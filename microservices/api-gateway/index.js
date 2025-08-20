import express from 'express'
import cors from 'cors';
import proxy from 'express-http-proxy'

const app = express()
const PORT = process.env.PORT || 9000

const customerService = process.env.CUSTOMER_SERVICE
const productService = process.env.PRODUCT_SERVICE
const shoppingService = process.env.SHOPPING_SERVICE

app.use(express.json())
app.use(cors());

app.use('/customer', proxy(customerService))
app.use('/product', proxy(productService))
app.use('/shopping', proxy(shoppingService))

app.listen(PORT, () => {
  console.log(`API Gateway Service is running on port ${PORT}`)
})