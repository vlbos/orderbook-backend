import { TRoutesInput } from '../types/routes';
import UserController from '../controllers/user.controller';
import PetController from '../controllers/pet.controller';
import {
    API_PATH,
    ORDERBOOK_PATH,
    ORDERBOOK_VERSION,
} from '../constants'
import * as ordersJSONFixture from '../fixtures/orders.json'
import * as assetsJSONFixture from '../fixtures/assets.json'

import Debug from "debug";
const debug = Debug("MyApp");
Debug.enable("*");
export default ({ app }: TRoutesInput) => {
    app.post('/api/user', async (req, res) => {
        const user = await UserController.CreateUser({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email
        });

        const pet = await PetController.CreatePet({
            owner: user._id,
            name: req.body.petName
        });

        return res.send({ user, pet });
    });


    app.post(`${ORDERBOOK_PATH}/orders/post/`, async (req, res) => {

        debug(req.query)
        return res.send(req.query);
    });

    app.get(`${ORDERBOOK_PATH}/orders/`, async (req, res) => {
        debug(req.query)
        return res.send({ orders: ordersJSONFixture });
    });

    app.post(`${API_PATH}/asset/:tokenAddress/:tokenId/whitelist/`, async (req, res) => {
        debug(req.query)
        debug(req.params)
        return res.send({ success: true });
    });



    app.get(`${API_PATH}/asset/:tokenAddress/:tokenId/`, async (req, res) => {
        debug(req.query)
        debug(req.params)

        return res.send(assetsJSONFixture);
    });

    app.get(`${API_PATH}/assets/`, async (req, res) => {
        debug(req.query)
        debug(req.params)
        const count = 3;
        return res.send({ assets: new Array(count).fill(assetsJSONFixture), estimated_count: count });
    });

    app.get(`${API_PATH}/tokens/`, async (req, res) => {
        debug(req.query)
        debug(req.params)
        return res.send({
            name: "token.name",
            symbol: "token.symbol",
            decimals: "token.decimals",
            address: "token.address",
            image_url: "token.image_url",
            eth_price: "token.eth_price",
            usd_price: "token.usd_price",
        });
    });

    app.get(`${API_PATH}/bundle/:slug/`, async (req, res) => {


        return res.send({});
    });

    app.get(`${API_PATH}/bundles/`, async (req, res) => {


        return res.send({});
    });


};
