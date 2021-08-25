const express = require('express')
const catalyst = require('zcatalyst-sdk-node')
const axios = require('axios')
let router = express.Router()

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

// Obtener 1 registro de reporte Presupuesto
router.get('/getRecord/:id', async (req, res) => {
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
  
    // Config para axios
    const idRegistro = req.params.id
    const config = {
      method: 'get',
      url: `https://creator.zoho.com/api/v2/sistemas134/cotizadorgc/report/Presupuesto_Report/${idRegistro}`,
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

// Modificar 1 registro de reporte Presupuesto
router.post('/updateRecord/:id', async (req, res) => {
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
  
    // Config para axios
    const idRegistro = req.params.id
    const updateData = {data:{NombreContacto:"ALEJANDRO MEZA ZAMORA"},result: {fields: ["Single_Line"],message: true, tasks: true}}
    const config = {
      method: 'patch',
      url: `https://creator.zoho.com/api/v2/sistemas134/cotizadorgc/report/Presupuesto_Report/${idRegistro}`,
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
      },
      data:JSON.stringify(updateData),
    }

  // Realizar peticion con Axios
  try {
    const resp = await axios(config)
    res.send(resp.data)
    //console.log(resp.data)
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
