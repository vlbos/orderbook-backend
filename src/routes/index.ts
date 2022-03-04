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
import * as tokensJSONFixture from '../fixtures/tokens.json'

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

        return res.send(ordersJSONFixture);
    });

    app.post(`${API_PATH}/asset/:tokenAddress/:tokenId/whitelist/`, async (req, res) => {
        debug(req.query)
        debug(req.params)
        return res.send({ success: true });
    });

    app.get(`${API_PATH}/asset/:tokenAddress/:tokenId/`, async (req, res) => {
        debug(req.query)
        debug(req.params)
        let s = assetsJSONFixture.assets.filter(a=>a.asset_contract.address==req.params.tokenAddress && a.token_id==req.params.tokenId);
        // console.log(s)
        return res.send(s==undefined || s.length==0?assetsJSONFixture.assets[0]:s[0]);
    });

    app.get(`${API_PATH}/assets/`, async (req, res) => {
        debug(req.query)
        debug(req.params)
        const count = 3;
        return res.send({ assets: new Array(count).fill(assetsJSONFixture), estimated_count: count });
    });

    app.get(`${API_PATH}/tokens/`, async (req, res) => {
        debug("query=",req.query)
        debug("params=",req.params)
        // debug(tokensJSONFixture)
        let s = tokensJSONFixture.tokens.filter(a=>a.symbol==req.query.symbol)
        // debug("s====",s)
        return res.send(s==undefined || s.length==0?tokensJSONFixture.tokens.slice(0,1):s);
    });

    app.get(`${API_PATH}/bundle/:slug/`, async (req, res) => {


        return res.send({});
    });

    app.get(`${API_PATH}/bundles/`, async (req, res) => {


        return res.send({});
    });


};
