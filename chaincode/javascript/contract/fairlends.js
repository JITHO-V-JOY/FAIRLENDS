'use strict';

const {Contract} = require('fabric-contract-api');

class Fairlends extends Contract{

    async issueLoan(ctx, issuer, loanNumber, loanAmount, interest, tenure, ){
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

}

module.exports = Fairlends;