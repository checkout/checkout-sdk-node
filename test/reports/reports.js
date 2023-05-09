import {
    BadGateway,
    TooManyRequestsError,
    ValidationError,
    ValueError,
    AuthenticationError,
    NotFoundError,
    ActionNotAllowed,
} from '../../src/services/errors';
import { Checkout } from '../../src/index';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_sbox_o2nulev2arguvyf6w7sc5fkznas';

describe('Reports', () => {
    it('should get all reports', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/reports?entity_id=ent_fz5knnpfjkceta7kpzlbu6dkt4&created_after=2022-02-17T00:00:00&created_before=2022-02-19T00:00:00')
            .reply(200, {
                count: 1,
                limit: 5,
                data: [
                    {
                        id: 'rpt_lmmldzousk7etoqijqundqexa4',
                        created_on: '2022-02-18T13:00:12.357Z',
                        last_modified_on: '2022-02-18T13:16:12.357Z',
                        type: 'FinancialActionsByPayoutId',
                        description: 'Reconciliation Report for X.',
                        account: {
                            client_id: 'cli_bvaelhppmfiufdnatam37wrfc4',
                            entity_id: 'ent_znj4ih5kn4fuxiaquoudv5mvwy',
                        },
                        tags: ['payout_id:pay_123456789'],
                        from: '2022-02-17T12:00:00Z',
                        to: '2022-02-18T12:00:00Z',
                        files: [
                            {
                                id: 'file_7ysmgfkj4ipunduud22uf73iey',
                                filename:
                                    'financial-actions_ent_znj4ih5kn4fuxiaquoudv5mvwy_20220218_000000001drl_1.csv',
                                format: 'CSV',
                                _links: {
                                    self: {
                                        href: 'https://api.checkout.com/reports/rpt_lmmldzousk7etoqijqundqexa4/files/file_lmmldzousk7etoqijqundqexa4',
                                    },
                                },
                            },
                        ],
                        _links: {
                            self: {
                                href: 'https://api.checkout.com/reports/rpt_lmmldzousk7etoqijqundqexa4',
                            },
                        },
                    },
                ],
                _links: {
                    self: {
                        href: 'https://api.checkout.com/reports?entity_id=ent_znj4ih5kn4fuxiaquoudv5mvwy&created_after=2022-02-17T00:00:00.000Z&limit=5',
                    },
                    next: {
                        href: 'https://api.checkout.com/reports?pagination_token=NaZMwq3KbreYcXg0dg752Dg8ps4orkwVK9pj9WFzkXk8rPoR32Wf74QWX0EkZ&entity_id=ent_znj4ih5kn4fuxiaquoudv5mvwy&created_after=2022-02-17T00:00:00.000Z&limit=5',
                    },
                },
            });

        const cko = new Checkout(SK);

        const reports = await cko.reports.getAllReports({
            created_after: '2022-02-17T00:00:00',
            created_before: '2022-02-19T00:00:00',
            entity_id: 'ent_fz5knnpfjkceta7kpzlbu6dkt4',
        });
    });

    it('should throw auth error getting all reports', async () => {
        nock('https://api.sandbox.checkout.com').get('/reports').reply(401);

        try {
            const cko = new Checkout();

            const reports = await cko.reports.getAllReports();
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should get report details', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/reports/rpt_6spt2r7yaheutcaoo2pxplt5fq')
            .reply(200, {
                id: 'rpt_6spt2r7yaheutcaoo2pxplt5fq',
                created_on: '2022-12-11T03:00:23.859192',
                type: 'FinancialActions',
                description: 'Financial Actions by Date Range',
                account: {
                    client_id: 'cli_g6rogb3hhfeu3ghtxcv3bw4qpy',
                    entity_id: 'ent_djigcqx4clmufo2sasgomgpqsq',
                },
                tags: [],
                from: '2022-12-10T00:00:00Z',
                to: '2022-12-11T00:00:00Z',
                files: [
                    {
                        id: 'file_fmrafd4nnseuro3hnvjsmwkcqq',
                        filename:
                            'financial-actions_ent_djigcqx4clmufo2sasgomgpqsq_20221210_20221211_1.csv',
                        format: 'CSV',
                        _links: [Object],
                    },
                ],
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/reports/rpt_6spt2r7yaheutcaoo2pxplt5fq',
                    },
                },
            });

        const cko = new Checkout(SK);

        const reports = await cko.reports.getReportDetails('rpt_6spt2r7yaheutcaoo2pxplt5fq');
    });

    it('should throw auth error getting report details', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/reports/rpt_6spt2r7yaheutcaoo2pxplt5fq')
            .reply(401);

        try {
            const cko = new Checkout();

            const reports = await cko.reports.getReportDetails('rpt_6spt2r7yaheutcaoo2pxplt5fq');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should get report file', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/reports/rpt_6spt2r7yaheutcaoo2pxplt5fq/files/file_fmrafd4nnseuro3hnvjsmwkcqq')
            .replyWithFile(200, __dirname + '/report.csv', {
                'Content-Type': 'application/json',
            });

        const cko = new Checkout(SK);

        const file = await cko.reports.getReportFile(
            'rpt_6spt2r7yaheutcaoo2pxplt5fq',
            'file_fmrafd4nnseuro3hnvjsmwkcqq'
        );

        expect(file).to.be.instanceof(Buffer);
    });

    it('should auth error getting report file', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/reports/rpt_6spt2r7yaheutcaoo2pxplt5fq/files/file_fmrafd4nnseuro3hnvjsmwkcqq')
            .reply(401);

        try {
            const cko = new Checkout(SK);

            const file = await cko.reports.getReportFile(
                'rpt_6spt2r7yaheutcaoo2pxplt5fq',
                'file_fmrafd4nnseuro3hnvjsmwkcqq'
            );
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });
});
