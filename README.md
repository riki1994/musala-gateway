# Musala Gateway Instalation Guide
  * Clone the project using `git clone https://github.com/riki1994/musala-gateway.git`
  * Move to project directory root and run `npm run init:project` and wait for the instalation finish
  * Copy and rename to `.env` the file `.env.copy` and configure you `MONGO_URI` `MONGO_DATABASE` `MONGO_TEST_DATABASE`
  * Run the server and the web scripts `npm run build:server` `npm run build:client` then access to the client with the URI `http://localhost:3000` and for the API REST `http://localhost:8080`
  * To run the test `npm test`

  ## Endpoints
   * `GET /gateway` to get all gateways
   * `GET /gateway/:id` to get a gateway by ID
   * `POST /gateway` to create a gateway `{gateway_name: 'Some Gateway', ipv4_address: '1.1.1.1'}`
   * `POST /gateway/:id` to update a gateway `{gateway_name: 'Some Gateway', ipv4_address: '1.1.1.1'}`
   * `DELETE /gateway/:id` to remove a gateway and the related peripherals
   * `GET /peripheral` to get all peripherals
   * `GET /peripheral/:id` to get a peripheral by ID
   * `POST /peripheral` to create a peripheral and assign to the gateway `{vendor: 'Some Vendor', uid: '12345', status: 'offline', gateway: gateway._id}`
   * `POST /peripheral/:id` to update a peripheral `{vendor: 'Some Vendor', uid: '12345', status: 'offline'}`
   * `DELETE /peripheral/:id` to remove a peripheral
