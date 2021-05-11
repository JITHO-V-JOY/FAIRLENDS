'use strict';

const {Contract} = require('fabric-contract-api');

class Fairlends extends Contract{

    async createUser(ctx, adharNo, name, role, state, city, address, pincode){
        console.info("*************** Creating User ***************")

        const user = {
            adharNo,
            name,
            role,
            state,
            city,
            address, 
            pincode
        };

        await ctx.stub.putState(adharNo, Buffer.from(JSON.stringify(user)));
        console.info("*************** Created New User ***************")

    }

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


    async approveLoan(ctx, loanNumber, tax){

        console.info("*************** Approving Loan ***************");

        const loanAsBytes = await ctx.stub.getState(loanNumber);

        if(!loanAsBytes|| loanAsBytes.length === 0){
            throw new Error(`${loanNumber} does not exist`);
        }

        const loan = JSON.parse(loanAsBytes.toString());

        loan.approved = true;
        loan.status = "active";

        var today = new Date();
        loan.approvedDate = today;
        loan.endDate = new Date(today.setMonth(today.getMonth()+loan.tenure));
        loan.bankTax = tax;

        // adding emi schedule for borrower to pay;
        for(let i = 0; i<=tenure; i++){
            let date = new Date(today.setMonth(today.getMonth()+i));
            loan.emi[date] = false;
        }

        // adding schedule to pay tax by lender;
        for(let i = 0; i<=tenure; i++){
            let date = new Date(today.setMonth(today.getMonth()+i));
            loan.tax[date] = false;
        }

        await ctx.stub.putState(loanNumber, Buffer.from(JSON.stringify(loan)));

        console.info("*************** Loan Approved Successfully ***************");


    }


}

module.exports = Fairlends;
