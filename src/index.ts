import _ from 'lodash';
import BotPool from './BotPool';
import config from './config';
import getDesignsFromEnv from './utils/getDesignsFromEnv';

async function init() {
    const pool = new BotPool(
        config.credentials.map(c => c.username),
        getDesignsFromEnv(),
    );

    pool.start();
}

init();
