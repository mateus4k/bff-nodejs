const { setTimeout } = require('timers/promises');
const { Client } = require('undici');
const TimeoutException = require('./exceptions/Timeout');

class Http {
    #client;

    constructor(url) {
        this.#client = new Client(url);
    }

    /**
     * @param {import('undici').Dispatcher.RequestOptions & {timeout:number}} params
     */
    async request({ timeout = 10000, ...params }) {
        const cancelTimeout = new AbortController();
        const cancelRequest = new AbortController();

        const response = await Promise.race([
            this.#sendRequest({ params, cancelRequest, cancelTimeout }),
            this.#timeout({ delay: timeout, cancelRequest, cancelTimeout }),
        ]);

        return response;
    }

    async #sendRequest({ params, cancelTimeout, cancelRequest }) {
        try {
            const response = await this.#client.request({
                ...params,
                throwOnError: true,
                signal: cancelRequest.signal,
            });

            return response;
        } catch (error) {
            if (error.code === 'UND_ERR_ABORTED') throw new TimeoutException();

            throw error;
        } finally {
            cancelTimeout.abort();
        }
    }

    async #timeout({ delay, cancelTimeout, cancelRequest }) {
        await setTimeout(delay, undefined, { signal: cancelTimeout.signal, });
        cancelRequest.abort();
    }
}

module.exports = Http;