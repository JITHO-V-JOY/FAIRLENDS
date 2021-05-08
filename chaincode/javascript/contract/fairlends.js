'use strict';

const {Contract} = require('fabric-contract-api');

class Fairlends extends Contract{

    async issueLoan(ctx, issuer, loanNumber, loanAmount, interest, tenure){
        console.info("*************** Creating Loan request ***************");
        
        const d = new Date();

        const loan = {
            "id":loanNumber,
            "issuer" : issuer,
            "lender" : null,
            "approved":false,
            "loanAmount": loanAmount,
            "interest": interest,
            "tenure":tenure,
            "issuedDate": d,
            "approvedDate":null,
            "endDate":null,
            "emi":{},
            "tax":{},
            "bankTax":null,
            "status":"issued",

        };

        await ctx.stub.putState(loanNumber, Buffer.from(JSON.stringify(loan)));
        console.info("*************** Created Loan request ***************");

    }

    

    async addLender(ctx, lender, loanNumber){

        console.info("*************** Adding Lender ***************");


        const loanAsBytes = await ctx.stub.getState(loanNumber);
        if(!loanAsBytes|| loanAsBytes.length === 0){
                throw new Error(`${loanNumber} does not exist`);
        }

        const loan = JSON.parse(loanAsBytes.toString());

        loan.lender = lender;

        await ctx.stub.putState(loanNumber, Buffer.from(JSON.stringify(loan)));
        console.info("*************** Lender added Successfully ***************");


    }


}

module.exports = Fairlends;