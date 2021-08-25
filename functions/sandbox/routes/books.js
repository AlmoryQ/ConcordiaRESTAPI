const express = require('express')
const catalyst = require('zcatalyst-sdk-node')
const axios = require('axios')
let router = express.Router()

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

// obtener contacto de books utilizando correo de contacto en crm
router.get('/getIdProducto', async (req, res) => {
  // inicializar sdk de zoho catalyst
  const appCatalyst = catalyst.initialize(req)
  // connector para obtener access token utilizando credenciales
  const connector = appCatalyst
    .connection({
      ConnectorName: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        auth_url: 'https://accounts.zoho.com/oauth/v2/token',
        refresh_url: 'https://accounts.zoho.com/oauth/v2/token',
        refresh_token: process.env.REFRESH_TOKEN,
      },
    })
    .getConnector('ConnectorName')
  // obtener access token
  const accessToken = await connector.getAccessToken()

  // 2234337000028805061
  // Logica: Obtener ID Producto en Books
  const idProducto = '2234337000023667433'

  const config = {
    method: 'get',
    url: `https://books.zoho.com/api/v3/items?zcrm_product_id=${idProducto}&organization_id=${process.env.ORGANIZATION_BOOKS}`,
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
    },
  }

  // Realizar peticion con Axios
  try {
    const resp = await axios(config)
    res.send(resp.data.items[0].item_id)
    // console.log(resp.data)
  } catch (error) {
    console.log(error)
  }
})

// obtener id contacto con correo
router.get('/getIdContacto', async (req, res) => {
  // inicializar sdk de zoho catalyst
  const appCatalyst = catalyst.initialize(req)
  // connector para obtener access token utilizando credenciales
  const connector = appCatalyst
    .connection({
      ConnectorName: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        auth_url: 'https://accounts.zoho.com/oauth/v2/token',
        refresh_url: 'https://accounts.zoho.com/oauth/v2/token',
        refresh_token: process.env.REFRESH_TOKEN,
      },
    })
    .getConnector('ConnectorName')
  // obtener access token
  const accessToken = await connector.getAccessToken()

  // 2234337000028805061
  // Logica: Obtener ID Producto en Books
  const correo = 'alejandro@villaprueba.com'

  const config = {
    method: 'get',
    url: `https://books.zoho.com/api/v3/contacts?email=${correo}&organization_id=${process.env.ORGANIZATION_BOOKS}`,
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
    },
  }

  // Realizar peticion con Axios
  try {
    const resp = await axios(config)
    res.send(resp.data.contacts[0].contact_id)
    // console.log(resp.data)
  } catch (error) {
    console.log(error)
  }
})

// obtener factura por ID
router.get('/getInvoiceById', async (req, res) => {
  // inicializar sdk de zoho catalyst
  const appCatalyst = catalyst.initialize(req)
  // connector para obtener access token utilizando credenciales
  const connector = appCatalyst
    .connection({
      ConnectorName: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        auth_url: 'https://accounts.zoho.com/oauth/v2/token',
        refresh_url: 'https://accounts.zoho.com/oauth/v2/token',
        refresh_token: process.env.REFRESH_TOKEN,
      },
    })
    .getConnector('ConnectorName')
  // obtener access token
  const accessToken = await connector.getAccessToken()

  const idInvoice = '888587000172622918'

  const config = {
    method: 'get',
    url: `https://books.zoho.com/api/v3/invoices/${idInvoice}?organization_id=${process.env.ORGANIZATION_BOOKS}`,
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
    },
  }

  // Realizar peticion con Axios
  try {
    const resp = await axios(config)
    res.send(resp.data)
    // console.log(resp.data)
  } catch (error) {
    console.log(error)
  }
})

// obtener facturas
router.get('/getInvoices/:customer_name&:item_name', async (req, res) => {
  // inicializar sdk de zoho catalyst
  const appCatalyst = catalyst.initialize(req)
  // connector para obtener access token utilizando credenciales
  const connector = appCatalyst
    .connection({
      ConnectorName: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        auth_url: 'https://accounts.zoho.com/oauth/v2/token',
        refresh_url: 'https://accounts.zoho.com/oauth/v2/token',
        refresh_token: process.env.REFRESH_TOKEN,
      },
    })
    .getConnector('ConnectorName')
  // obtener access token
  const accessToken = await connector.getAccessToken()
  const config = {
    method: 'get',
    url: `https://books.zoho.com/api/v3/invoices?customer_name=${req.params.customer_name}&item_name=${req.params.item_name}&page=1&sort_column=created_time&sort_order=A&organization_id=${process.env.ORGANIZATION_BOOKS}`,
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
    },
  }

  // Realizar peticion con Axios
  try {
    const respInvoices = await axios(config)
    if (respInvoices.data.page_context.has_more_page == true) {
      console.log('Consiguiendo mas facturas...')
      let config2 = {
        method: 'get',
        url: `https://books.zoho.com/api/v3/invoices?customer_name=${req.params.customer_name}&item_name=${req.params.item_name}&page=2&sort_column=created_time&sort_order=A&organization_id=${process.env.ORGANIZATION_BOOKS}`,
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
        },
      }
      const resp2 = await axios(config2)
      const allInvoices = [
        ...respInvoices.data.invoices,
        ...resp2.data.invoices,
      ]
      console.log('size', allInvoices.length)
      res.send(allInvoices)
    } else {
      res.send(respInvoices.data.invoices)
    }
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
