import {expect} from "chai";
import {NotFoundError, ValidationError} from "../../src/services/errors";

const {beforeEach, cko_issuing} = require('../fixtures');

describe('Issuing [integration]', () => {
    describe('Cardholder', () => {
        it('should create a cardholder', async () => {
            const cardholderResponse = await cko_issuing.issuing.createCardholder({
                type: "individual",
                reference: "X-123456-N11",
                entity_id: "ent_mujh2nia2ypezmw5fo2fofk7ka",
                first_name: "John",
                middle_name: "Fitzgerald",
                last_name: "Kennedy",
                email: "john.kennedy@myemaildomain.com",
                phone_number: {
                    country_code: "+1",
                    number: "415 555 2671"
                },
                date_of_birth: "1985-05-15",
                billing_address: {
                    address_line1: "Checkout.com",
                    address_line2: "90 Tottenham Court Road",
                    city: "London",
                    state: "London",
                    zip: "W1T 4TJ",
                    country: "GB"
                },
                residency_address: {
                    address_line1: "Checkout.com",
                    address_line2: "90 Tottenham Court Road",
                    city: "London",
                    state: "London",
                    zip: "W1T 4TJ",
                    country: "GB"
                },
                document: {
                    type: "national_identity_card",
                    front_document_id: "file_6lbss42ezvoufcb2beo76rvwly",
                    back_document_id: "file_aaz5pemp6326zbuvevp6qroqu4"
                }
            });

            expect(cardholderResponse.id).to.not.be.null
            expect(cardholderResponse.type).to.equal("individual")
            expect(cardholderResponse.status).to.equal("active")
        });

        it('should throw ValidationError when creating a cardholder with invalid data', async () => {
            try {
                await cko_issuing.issuing.createCardholder({
                    type: "individual",
                    reference: "X-123456-N11",
                    entity_id: "ent_fa6psq242dcd6fdn5gifcq1491",
                    first_name: "John",
                    middle_name: "Fitzgerald",
                    last_name: "Kennedy",
                    email: "john.kennedy@myemaildomain.com",
                    phone_number: {
                        country_code: "+1",
                        number: "415 555 2671"
                    },
                    date_of_birth: "1985-05-15",
                    billing_address: {
                        address_line1: "Checkout.com",
                        address_line2: "90 Tottenham Court Road",
                        city: "London",
                        state: "London",
                        zip: "W1T 4TJ",
                        country: "GB"
                    },
                    residency_address: {
                        address_line1: "Checkout.com",
                        address_line2: "90 Tottenham Court Road",
                        city: "London",
                        state: "London",
                        zip: "W1T 4TJ",
                        country: "GB"
                    },
                    document: {
                        type: "national_identity_card",
                        front_document_id: "file_6lbss42ezvoufcb2beo76rvwly",
                        back_document_id: "file_aaz5pemp6326zbuvevp6qroqu4"
                    }
                });
            } catch (err) {
                expect(err).to.be.instanceOf(ValidationError);
            }
        });

        it('should get a cardholder', async () => {
            const cardholder = await createCardholder()

            const cardholderResponse = await cko_issuing.issuing.getCardholder(cardholder.id);

            expect(cardholderResponse.id).to.equal(cardholder.id);
            expect(cardholderResponse.type).to.equal(cardholder.type)
            expect(cardholderResponse.first_name).to.equal("John")
            expect(cardholderResponse.last_name).to.equal("Kennedy")
        });

        it('should throw NotFoundError when getting an unexistant cardholder', async () => {
            try {
                await cko_issuing.issuing.getCardholder("not_found");
            } catch (err) {
                expect(err).to.be.instanceOf(NotFoundError);
            }
        });

        it('should get a cardholders cards', async () => {
            const cardholder = await createCardholder()

            // TODO create cards for cardholder

            const cardsResponse = await cko_issuing.issuing.getCardholderCards(cardholder.id);

            expect(cardsResponse.cards).to.not.be.null
            for (const card in cardsResponse.cards) {
                expect(card.cardholder_id).to.equal(cardholder.id)
                expect(card.client_id).to.equal("cli_p6jeowdtuxku3azxgt2qa7kq7a")
            }
        });

        it('should throw NotFoundError when getting cards for an unexistant cardholder', async () => {
            try {
                await cko_issuing.issuing.getCardholderCards("not_found");
            } catch (err) {
                expect(err).to.be.instanceOf(NotFoundError);
            }
        });
    });
});

const createCardholder = async () => {
    return await cko_issuing.issuing.createCardholder({
        type: "individual",
        reference: "X-123456-N11",
        entity_id: "ent_mujh2nia2ypezmw5fo2fofk7ka",
        first_name: "John",
        middle_name: "Fitzgerald",
        last_name: "Kennedy",
        email: "john.kennedy@myemaildomain.com",
        phone_number: {
            country_code: "+1",
            number: "415 555 2671"
        },
        date_of_birth: "1985-05-15",
        billing_address: {
            address_line1: "Checkout.com",
            address_line2: "90 Tottenham Court Road",
            city: "London",
            state: "London",
            zip: "W1T 4TJ",
            country: "GB"
        },
        residency_address: {
            address_line1: "Checkout.com",
            address_line2: "90 Tottenham Court Road",
            city: "London",
            state: "London",
            zip: "W1T 4TJ",
            country: "GB"
        },
        document: {
            type: "national_identity_card",
            front_document_id: "file_6lbss42ezvoufcb2beo76rvwly",
            back_document_id: "file_aaz5pemp6326zbuvevp6qroqu4"
        }
    });
}
