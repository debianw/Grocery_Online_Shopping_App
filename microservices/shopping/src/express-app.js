import express from 'express';
import cors from 'cors';
import * as API from './api/index.js';
import HandleErrors from './utils/error-handler.js'
import registerToEvents from './api/webhook.js';

export default async (app, channel) => {

    app.use(express.json({ limit: '1mb'}));
    app.use(express.urlencoded({ extended: true, limit: '1mb'}));
    app.use(cors());

    //api
    API.shopping(app, channel);

    registerToEvents(app);

    // error handling
    app.use(HandleErrors);
    
}