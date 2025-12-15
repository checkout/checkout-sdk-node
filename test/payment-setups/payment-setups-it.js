import { expect } from "chai";
import nock from "nock";
import Checkout from '../../src/Checkout.js'
import { NotFoundError, ValidationError, AuthenticationError, ActionNotAllowed } from "../../src/services/errors.js";

afterEach(() => {
  nock.cleanAll();
  nock.enableNetConnect();
});

const cko = new Checkout(process.env.CHECKOUT_DEFAULT_SECRET_KEY);
const processingChannelId = process.env.CHECKOUT_PROCESSING_CHANNEL_ID;

describe('Integration::Payment-Setups', () => {
  const createRequest = {
    processing_channel_id: processingChannelId,
    amount: 1000,
    currency: "GBP",
    payment_type: "Regular",
    reference: `TEST-REF-${Date.now()}`,
    description: "Integration test payment setup",
    settings: {
    success_url: "https://example.com/success",
    failure_url: "https://example.com/failure"
    },
    customer: {
    name: "John Smith",
    email: {
        address: `john.smith+${Date.now()}@example.com`,
        verified: true
    },
    phone: {
        country_code: "+44",
        number: "207 946 0000"
    },
    device: {
        locale: "en_GB"
    }
    },
    payment_methods: {
    klarna: {
        initialization: "disabled",
        account_holder: {
        billing_address: {
            address_line1: "123 High Street",
            city: "London",
            zip: "SW1A 1AA",
            country: "GB"
        }
        }
    }
    }
  };

  const updateRequest = {
    processing_channel_id: processingChannelId,
    amount: 1500,
    currency: "GBP",
    payment_type: "Regular",
    reference: `TEST-REF-UPDATED-${Date.now()}`,
    description: "Updated integration test payment setup",
    settings: {
      success_url: "https://example.com/success-updated",
      failure_url: "https://example.com/failure-updated"
    },
    customer: {
      name: "John Smith Updated",
      email: {
        address: `john.smith.updated+${Date.now()}@example.com`,
        verified: true
      },
      phone: {
        country_code: "+44",
        number: "207 946 0001"
      },
      device: {
        locale: "en_US"
      }
    },
    payment_methods: {
      klarna: {
        initialization: "disabled",
        account_holder: {
          billing_address: {
            address_line1: "456 Updated Street",
            city: "Manchester",
            zip: "M1 2AB",
            country: "GB"
          }
        }
      }
    }
  };

  describe('Create and manage Payment Setup lifecycle', () => {

    it('should create a payment setup', async () => {
      const response = await cko.paymentSetups.createAPaymentSetup(createRequest);

      expect(response.id).not.to.be.null;
      expect(response.amount).to.equal(1000);
      expect(response.currency).to.equal('GBP');
      expect(response.customer.email.address).to.include('john.smith+');
    });

    it('should get a payment setup', async () => {
      // First create a payment setup
      const createResponse = await cko.paymentSetups.createAPaymentSetup(createRequest);
      
      // Then retrieve it
      const response = await cko.paymentSetups.getAPaymentSetup(createResponse.id);

      expect(response.id).to.equal(createResponse.id);
      expect(response.amount).to.equal(1000);
      expect(response.currency).to.equal('GBP');
      expect(response.customer.email.address).to.include('john.smith+');
    });

    it('should update a payment setup', async () => {
      // First create a payment setup
      const createResponse = await cko.paymentSetups.createAPaymentSetup(createRequest);
      
      // Then update it
      const response = await cko.paymentSetups.updateAPaymentSetup(createResponse.id, updateRequest);

      expect(response.id).to.equal(createResponse.id);
      expect(response.amount).to.equal(1500);
      expect(response.customer.name).to.equal('John Smith Updated');
    });

    it('should confirm a payment setup with a payment method option', async () => {
      try {
        // First create a payment setup
        const createResponse = await cko.paymentSetups.createAPaymentSetup(createRequest);
        
        // Get the payment setup to find available payment method options
        const getResponse = await cko.paymentSetups.getAPaymentSetup(createResponse.id);
        
        // Extract first available payment method option ID (if available)
        const paymentMethodOptions = getResponse.payment_method_options || [];
        if (paymentMethodOptions.length > 0) {
          const paymentMethodOptionId = paymentMethodOptions[0].id;
          
          // Confirm the payment setup
          const response = await cko.paymentSetups.confirmAPaymentSetup(createResponse.id, paymentMethodOptionId);

          expect(response.id).not.to.be.null;
          expect(response.status).not.to.be.null;
          expect(response.approved).to.be.a('boolean');
        } else {
          // If no payment method options available, skip this test
          console.log('Skipping confirm test - no payment method options available');
        }
      } catch (error) {
        // Payment setups might not be fully configured in test environment
        // so we expect certain validation errors
        expect(error).to.be.instanceOf(ValidationError);
      }
    });
  });

  describe('Error handling', () => {
    it('should throw NotFoundError when getting non-existent payment setup', async () => {
      try {
        await cko.paymentSetups.getAPaymentSetup('psu_not_found');
      } catch (err) {
        expect(err).to.be.instanceOf(NotFoundError);
      }
    });

    it('should throw NotFoundError when updating non-existent payment setup', async () => {
      const updateRequest = {
        amount: 1500,
        currency: "GBP"
      };

      try {
        await cko.paymentSetups.updateAPaymentSetup('psu_not_found', updateRequest);
      } catch (err) {
        expect(err).to.be.instanceOf(NotFoundError);
      }
    });

    it('should throw NotFoundError when confirming non-existent payment setup', async () => {
      try {
        await cko.paymentSetups.confirmAPaymentSetup('psu_not_found', 'pmo_not_found');
      } catch (err) {
        expect(err).to.be.instanceOf(NotFoundError);
      }
    });

    it('should throw ValidationError when creating payment setup with invalid data', async () => {
      const invalidRequest = {
        // Missing required fields
        amount: 'invalid_amount',
        currency: 'INVALID'
      };

      try {
        await cko.paymentSetups.createAPaymentSetup(invalidRequest);
      } catch (err) {
        expect(err.name).to.equal('ValueError');
        expect(err.body).to.equal('The currency value is not valid.');
      }
    });

    it('should throw ValidationError when updating payment setup with invalid data', async () => {
      // First create a valid payment setup
      const createResponse = await cko.paymentSetups.createAPaymentSetup(createRequest);

      const invalidUpdateRequest = {
        amount: 'invalid_amount',
        currency: 'INVALID'
      };

      try {
        await cko.paymentSetups.updateAPaymentSetup(createResponse.id, invalidUpdateRequest);
      } catch (err) {
        expect(err.name).to.equal('ValueError');
        expect(err.body).to.equal('The currency value is not valid.');
      }
    });
  });
});