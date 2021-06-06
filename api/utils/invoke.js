const { Gateway, Wallets, TxEventHandler, GatewayOptions, DefaultEventHandlerStrategies, TxEventHandlerFactory } = require('fabric-network');
const fs = require('fs');
const EventStrategies = require('fabric-network/lib/impl/event/defaulteventhandlerstrategies');
const path = require("path")
//const log4js = require('log4js');
//const logger = log4js.getLogger('BasicNetwork');
//const util = require('util')

const helper = require('./helper');
const { Console } = require('console');
//const { blockListener, contractListener } = require('./Listeners');

const invokeTransaction = async (channelName, chaincodeName, fcn, args, username, org_name, transientData) => {
    try {
        const ccp = await helper.getCCP(org_name);
        console.log(ccp);
        const walletPath = await helper.getWalletPath(org_name);
        console.log(walletPath);
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        let identity = await wallet.get(username);
        if (!identity) {
            console.log(`An identity for the user ${username} does not exist in the wallet, so registering user`);
            await helper.getRegisteredUser(username, org_name, true)
            identity = await wallet.get(username);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        

        const connectOptions = {
            wallet, identity: username, discovery: { enabled: true, asLocalhost: true },
            eventHandlerOptions: EventStrategies.NONE
        }

        const gateway = new Gateway();
        await gateway.connect(ccp, connectOptions);

        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);

        // await contract.addContractListener(contractListener);
        // await network.addBlockListener(blockListener);
       

        // Multiple smartcontract in one chaincode
        let result;
        let message;

        switch (fcn) {
            case "CreateUser":
                result = await contract.submitTransaction(fcn, JSON.stringify(args[0]));
                console.log("invoke transaction...3");
                console.log(result.toString())
                result = {txid: result.toString()}
                break;
            case "QueryUser":
                result = await contract.submitTransaction(fcn, args);
                console.log("QueryUser");
                console.log(result.toString())
                result = {txid: result.toString()}
                break;
            case "IssueLoan":
                console.log("invoke transaction...loan");
                result = await contract.submitTransaction(fcn, args[0]);
                console.log("result", result)
                result = {txid: result}
                break;
            case "GetLoanById":
                console.log("invoke transaction...Get Loan");
                result = await contract.submitTransaction(fcn, args);
                //console.log("result", result.toString())
                result = {txid: result.toString()}
                break;
            case "AddLender":
                result = await contract.submitTransaction(fcn, args[0], args[1]);
                console.log(result.toString())
                result = {txid: result.toString()}
                break;
            case "ApproveLoan":
                result = await contract.submitTransaction(fcn, args[0]);
                console.log(result.toString())
                result = {txid: result.toString()}
                break;
            case "Redeem":
                result = await contract.submitTransaction(fcn, args[0]);
                console.log(result.toString())
                result = {txid: result.toString()}
                break;
            case "PayEMI":
                result = await contract.submitTransaction(fcn, args[0], args[1]);
                console.log(result.toString())
                result = {txid: result.toString()}
                break;
            case "PayTax":
                result = await contract.submitTransaction(fcn, args[0], args[1]);
                console.log(result.toString())
                result = {txid: result.toString()}
                break;
          
                    
            default:
                break;
        }


        // let result
        // let message;
        // if (fcn === "createCar" || fcn === "createPrivateCarImplicitForOrg1"
        //     || fcn == "createPrivateCarImplicitForOrg2") {
        //     result = await contract.submitTransaction(fcn, args[0], args[1], args[2], args[3], args[4]);
        //     message = `Successfully added the car asset with key ${args[0]}`

        // } else if (fcn === "changeCarOwner") {
        //     result = await contract.submitTransaction(fcn, args[0], args[1]);
        //     message = `Successfully changed car owner with key ${args[0]}`
        // } else if (fcn == "createPrivateCar" || fcn =="updatePrivateData") {
        //     console.log(`Transient data is : ${transientData}`)
        //     let carData = JSON.parse(transientData)
        //     console.log(`car data is : ${JSON.stringify(carData)}`)
        //     let key = Object.keys(carData)[0]
        //     const transientDataBuffer = {}
        //     transientDataBuffer[key] = Buffer.from(JSON.stringify(carData.car))
        //     result = await contract.createTransaction(fcn)
        //         .setTransient(transientDataBuffer)
        //         .submit()
        //     message = `Successfully submitted transient data`
        // }
        // else {
        //     return `Invocation require either createCar or changeCarOwner as function but got ${fcn}`
        // }

        await gateway.disconnect();

        // result = JSON.parse(result.toString());

        let response = {
            message: message,
            result
        }

        return response;


    } catch (error) {
    
        console.log(`Getting error: ${error}`)
        return error.message

    }
}

exports.invokeTransaction = invokeTransaction;