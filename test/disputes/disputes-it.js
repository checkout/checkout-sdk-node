import { expect } from 'chai';
import nock from 'nock';
import Checkout from '../../src/Checkout.js';
import { AuthenticationError, NotFoundError } from '../../src/services/errors.js';

afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
});

const cko = new Checkout(process.env.CHECKOUT_DEFAULT_SECRET_KEY);

describe('Integration::Disputes::Arbitration', () => {
    it.skip('should submit arbitration evidence for a dispute', async () => {
        // Requires an active dispute ID that is in the correct state for arbitration
        const disputeId = 'dsp_bc94ebda8d275i461229';

        const result = await cko.disputes.submitArbitrationEvidence(disputeId);

        // 204 returns undefined
        expect(result).to.be.undefined;
    });

    it.skip('should get compiled submitted arbitration evidence', async () => {
        // Requires a dispute with previously submitted arbitration evidence
        const disputeId = 'dsp_bc94ebda8d275i461229';

        const evidence = await cko.disputes.getCompiledSubmittedArbitrationEvidence(disputeId);

        expect(evidence).to.not.be.null;
        expect(evidence.file_id).to.not.be.null;
    });

    it('should throw NotFoundError when submitting arbitration evidence for non-existent dispute', async () => {
        try {
            await cko.disputes.submitArbitrationEvidence('dsp_nonexistent_id');
            expect.fail('Should have thrown NotFoundError');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should throw NotFoundError when getting arbitration evidence for non-existent dispute', async () => {
        try {
            await cko.disputes.getCompiledSubmittedArbitrationEvidence('dsp_nonexistent_id');
            expect.fail('Should have thrown NotFoundError');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should throw AuthenticationError with invalid credentials', async () => {
        const invalidCko = new Checkout('sk_sbox_invalid_key');

        try {
            await invalidCko.disputes.submitArbitrationEvidence('dsp_bc94ebda8d275i461229');
            expect.fail('Should have thrown AuthenticationError');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });
});
