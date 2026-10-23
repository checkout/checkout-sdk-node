import { expect } from 'chai';
import http from 'http';
import { get, post, patch, put, _delete } from '../../src/services/http.js';

// nock matches the method case-insensitively, so it cannot catch a verb sent in
// lowercase. These tests use a real local server and read the method as it
// arrives on the wire, for both HTTP clients.
describe('HTTP method on the wire', () => {
    let server;
    let baseUrl;
    let received;

    before((done) => {
        server = http.createServer((req, res) => {
            received.push(req.method);
            req.resume();
            req.on('end', () => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end('{}');
            });
        });
        server.listen(0, '127.0.0.1', () => {
            baseUrl = `http://127.0.0.1:${server.address().port}`;
            done();
        });
    });

    after((done) => {
        server.close(done);
    });

    beforeEach(() => {
        received = [];
    });

    const config = { headers: {} };
    const calls = [
        ['GET', (client) => get(client, `${baseUrl}/x`, config, 'Bearer sk_test')],
        ['POST', (client) => post(client, `${baseUrl}/x`, config, 'Bearer sk_test', { a: 1 })],
        ['PATCH', (client) => patch(client, `${baseUrl}/x`, config, 'Bearer sk_test', { a: 1 })],
        ['PUT', (client) => put(client, `${baseUrl}/x`, config, 'Bearer sk_test', { a: 1 })],
        ['DELETE', (client) => _delete(client, `${baseUrl}/x`, config, 'Bearer sk_test')],
    ];

    for (const client of ['fetch', 'axios']) {
        for (const [verb, call] of calls) {
            it(`sends ${verb} in uppercase with the ${client} client`, async () => {
                await call(client);
                expect(received).to.deep.equal([verb]);
            });
        }
    }
});
