const { setTimeout } = require('timers/promises');
const { Client } = require('undici');
const TimeoutException = require('./exceptions/TimeoutException');

class Http {
    #client;

    /**
     * @param {string} url 
     */
    constructor(url) {
        this.#client = new Client(url);
    }

    /**
     * @param {import('undici').Dispatcher.ResponseData} params
     * @param {{timeout: number}} options
     */
    async request(params, { timeout } = {}) {
        const cancelTimeout = new AbortController();
        const cancelRequest = new AbortController();

        try {
            const response = await Promise.race([
                this.#makeRequest(params, { cancelTimeout, cancelRequest }),
                this.#timeout(timeout, { cancelTimeout, cancelRequest }),
            ]);

            return response;
        } catch (error) {
            if (error instanceof TimeoutException) {
                console.log('Timeout exceeded');
            }

            throw error;
        }
    }

    async #makeRequest(params, { cancelTimeout, cancelRequest }) {
        try {
            const response = await this.#client.request({
                ...params,
                throwOnError: true,
                signal: cancelRequest.signal,
            });

            const data = await response.body.json();

            return data;
        } finally {
            cancelTimeout.abort();
        }
    }

    async #timeout(delay, { cancelTimeout, cancelRequest }) {
        try {
            await setTimeout(delay, undefined, { signal: cancelTimeout.signal });
            cancelRequest.abort();
        } catch (error) {
            return;
        }

        throw new TimeoutException();
    }
}

module.exports = Http;