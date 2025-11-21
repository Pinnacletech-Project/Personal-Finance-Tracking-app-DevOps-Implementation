import * as chai from 'chai';  
import chaiHttp from 'chai-http';
import request from 'supertest';
import app from '../server.js';

const { expect } = chai;
chai.use(chaiHttp);

describe('Transaction API Tests', () => {
    let transactionId;

    it('GET /transactions should return an array', async () => {
        const res = await request(app).get('/transactions');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
    });

    it('POST /transactions should add a new transaction', async () => {
        const newTransaction = {
            description: "Test Expense",
            amount: 100,
            type: "expense"
        };

        const res = await request(app).post('/transactions').send(newTransaction);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('transaction');
        transactionId = res.body.transaction.id;
    });

    it('PUT /transactions/:id should update a transaction', async () => {
        const updatedTransaction = {
            description: "Updated Test Expense",
            amount: 200,
            type: "expense"
        };

        const res = await request(app).put(`/transactions/${transactionId}`).send(updatedTransaction);
        expect(res.status).to.equal(200);
        expect(res.body.transaction.amount).to.equal(200);
    });

    it('DELETE /transactions/:id should delete a transaction', async () => {
        const res = await request(app).delete(`/transactions/${transactionId}`);
        expect(res.status).to.equal(200);
    });
});
