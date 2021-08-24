const express = require('express')
const catalyst = require('zcatalyst-sdk-node');
const axios = require('axios');
let router = express.Router()

router.use(express.json())
router.use(express.urlencoded({ extended: true}));

// @CRM
// Nuevo comentario, cambio nuevo...
// Nuevo comentario 2, cambio nuevo...
// Comentario 3...
// obtener Producto CRM
router.post('/getProducto/:id', async (req,res) => {
	// inicializar sdk de zoho catalyst
	const appCatalyst = catalyst.initialize(req);
	// connector para obtener access token utilizando credenciales
	const connector = appCatalyst
	.connection({
	ConnectorName: {
		client_id: process.env.CLIENT_ID,
		client_secret: process.env.CLIENT_SECRET,
		auth_url: 'https://accounts.zoho.com/oauth/v2/token',
		refresh_url: 'https://accounts.zoho.com/oauth/v2/token',
		refresh_token: process.env.REFRESH_TOKEN
	}
	}).getConnector('ConnectorName');
	// obtener access token
	const accessToken = await connector.getAccessToken()

	// Config para axios
	const idProducto = req.params.id
	const config = {
		method: 'get',
		url: `https://www.zohoapis.com/crm/v2/Products/${idProducto}`,
		headers: { 
			'Authorization': `Zoho-oauthtoken ${accessToken}`
		}
	}

	// Realizar peticion con Axios
	try {
		const resp = await axios(config)
		res.send(resp.data.data[0])
		// console.log(resp.data)
	}catch(error){
		console.log(error);
	}
})

module.exports = router;
