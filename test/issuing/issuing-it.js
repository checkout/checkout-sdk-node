import {expect} from "chai";
import { determineError, NotFoundError, ValidationError } from "../../src/services/errors";

const {afterEach, cko_issuing} = require('../fixtures');

describe('Integration::Issuing', () => {
    describe('Cardholder', () => {

        let cardholder;

        before(async () => {
            cardholder = await createCardholder()
        })

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

    describe('Cards', () => {

        let cardholder;
        let card;

        before(async () => {
            cardholder = await createCardholder()
            card = await createCard(cardholder)
        })

        it('should create a virtual card', async () => {
            const cardResponse = await cko_issuing.issuing.createCard({
                type: "virtual",
                cardholder_id: cardholder.id,
                lifetime: {
                    unit: "Months",
                    value: 6
                },
                reference: "X-123456-N11",
                card_product_id: "pro_2ebzpnw3wvcefnu7fqglqmg56m",
                display_name: "JOHN KENNEDY",
                is_single_use: false,
                activate_card: false
            })

            expect(cardResponse.id).to.not.be.null
            expect(cardResponse.display_name).to.equal("JOHN KENNEDY")
            expect(cardResponse.reference).to.equal("X-123456-N11")
        });

        it('should throw ValidationError when creating a card with invalid data', async () => {
            try {
                await cko_issuing.issuing.createCard({
                    type: "physical",
                    cardholder_id: cardholder.id,
                    lifetime: {
                        unit: "Months",
                        value: 6
                    },
                    reference: "X-123456-N11",
                    card_product_id: "pro_2ebzpnw3wvcefnu7fqglqmg56m",
                    display_name: "JOHN KENNEDY",
                    activate_card: false
                });
            } catch (err) {
                expect(err).to.be.instanceOf(ValidationError);
            }
        });

        it('should get card', async () => {
            const cardResponse = await cko_issuing.issuing.getCardDetails(card.id)

            expect(cardResponse.id).to.equal(card.id)
            expect(cardResponse.cardholder_id).to.equal(cardholder.id)
            expect(cardResponse.card_product_id).to.equal("pro_2ebzpnw3wvcefnu7fqglqmg56m")
            expect(cardResponse.reference).to.equal("X-123456-N11")
        });

        it('should throw NotFoundError when getting an unexistant card', async () => {
            try {
                await cko_issuing.issuing.createCard({
                    type: "physical",
                    cardholder_id: cardholder.id,
                    lifetime: {
                        unit: "Months",
                        value: 6
                    },
                    reference: "X-123456-N11",
                    card_product_id: "pro_2ebzpnw3wvcefnu7fqglqmg56m",
                    display_name: "JOHN KENNEDY",
                    activate_card: false
                });
            } catch (err) {
                expect(err).to.be.instanceOf(ValidationError);
            }
        });


        it.skip('should enroll card into 3DS', async () => {
            const enrollResponse = await cko_issuing.issuing.enrollThreeDS(card.id, {
                password: "Xtui43FvfiZ",
                    locale: "en-US",
                    phone_number: {
                    country_code: "+1",
                        number: "415 555 2671"
                }
            })

            expect(enrollResponse).to.not.be.null
        });

        it.skip('should update enrollment into 3DS', async () => {
            const enrollResponse = await cko_issuing.issuing.updateThreeDS(card.id, {
                security_pair: {
                    question: "Who are you?",
                    answer: "Bond. James Bond."
                },
                password: "Xtui43FvfiZ",
                locale: "en-US",
                phone_number: {
                    country_code: "+1",
                    number: "415 555 2671"
                }
            })

            expect(enrollResponse).to.not.be.null
        });

        it.skip('should get enrollment into 3DS', async () => {
            const enrollmentResponse = await cko_issuing.issuing.getThreeDSDetails(card.id)

            expect(enrollmentResponse).to.not.be.null
            expect(enrollmentResponse.locale).to.equal("en-US");
            expect(enrollmentResponse.phone_number.country_code).to.equal("+1")
            expect(enrollmentResponse.phone_number.number).to.equal("415 555 2671")
        });

        it('should activate a card', async () => {
            const activationResponse = await cko_issuing.issuing.activateCard(card.id)

            expect(activationResponse).to.not.be.null

            const cardResponse = await cko_issuing.issuing.getCardDetails(card.id)

            expect(cardResponse.id).to.equal(card.id)
            expect(cardResponse.status).to.equal("active")
        });

        it('should get card credentials', async () => {
            const credentialsResponse = await cko_issuing.issuing.getCardCredentials(card.id, {
                credentials: "number, cvc2"
            })

            expect(credentialsResponse.number).to.not.be.null
            expect(credentialsResponse.cvc2).to.not.be.null
        });

        it('should suspend a card', async () => {
            const suspendedResponse = await cko_issuing.issuing.suspendCard(card.id, {
                reason: "suspected_lost"
            })

            expect(suspendedResponse).to.not.be.null

            const cardResponse = await cko_issuing.issuing.getCardDetails(card.id)

            expect(cardResponse.id).to.equal(card.id)
            expect(cardResponse.status).to.equal("suspended")
        });

        it('should revoke a card', async () => {
            const suspendedResponse = await cko_issuing.issuing.revokeCard(card.id, {
                reason: "reported_lost"
            })

            expect(suspendedResponse).to.not.be.null

            const cardResponse = await cko_issuing.issuing.getCardDetails(card.id)

            expect(cardResponse.id).to.equal(card.id)
            expect(cardResponse.status).to.equal("revoked")
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

const createCard = async (cardholder) => {
    return await cko_issuing.issuing.createCard({
        type: "virtual",
        cardholder_id: cardholder.id,
        lifetime: {
            unit: "Months",
            value: 6
        },
        reference: "X-123456-N11",
        card_product_id: "pro_2ebzpnw3wvcefnu7fqglqmg56m",
        display_name: "JOHN KENNEDY",
        is_single_use: false,
        activate_card: false
    });
}
