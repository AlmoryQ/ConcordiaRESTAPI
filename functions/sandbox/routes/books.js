const express = require('express')
const catalyst = require('zcatalyst-sdk-node');
const axios = require('axios');
let router = express.Router()

router.use(express.json())
router.use(express.urlencoded({ extended: true}));

// obtener contacto de books utilizando correo de contacto en crm
router.get('/getIdProducto', async (req, res) => {
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

	// 2234337000028805061
	// Logica: Obtener ID Producto en Books
	const idProducto = '2234337000023667433'

	const config = {
		method: 'get',
		url: `https://books.zoho.com/api/v3/items?zcrm_product_id=${idProducto}&organization_id=651425182`,
		// url: 'https://books.zoho.com/api/v3/invoices?organization_id=709830857',
		headers: { 
			'Authorization': `Zoho-oauthtoken ${accessToken}`
		}
	}

	// Realizar peticion con Axios
	try {
		const resp = await axios(config)
		res.send(resp.data.items[0].item_id)
		// console.log(resp.data)
	}catch(error){
		console.log(error);
	}
})

// Prueba, comentario nuevo
// obtener id contacto con correo
router.get('/getIdContacto', async (req, res) => {
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

	// 2234337000028805061
	// Logica: Obtener ID Producto en Books
	const correo = 'alejandro@villaprueba.com'

	const config = {
		method: 'get',
		url: `https://books.zoho.com/api/v3/contacts?email=${correo}&organization_id=651425182`,
		// url: 'https://books.zoho.com/api/v3/invoices?organization_id=709830857',
		headers: { 
			'Authorization': `Zoho-oauthtoken ${accessToken}`
		}
	}

	// Realizar peticion con Axios
	try {
		const resp = await axios(config)
		res.send(resp.data.contacts[0].contact_id)
		// console.log(resp.data)
	}catch(error){
		console.log(error);
	}
})

module.exports = router;
