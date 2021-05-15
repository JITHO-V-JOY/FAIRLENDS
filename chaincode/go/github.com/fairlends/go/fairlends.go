package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"github.com/hyperledger/fabric/common/flogging"
)

type SmartContract struct {
	contractapi.Contract
}

var logger = flogging.MustGetLogger("fabcar_cc")

type User struct {
	Adhar_ID    string `json:"adhar_id"`
	Name    	string `json:"name"`
	Role 	    string `json:"role"`
	Address   	string `json:"address"`
	UPI_ID   	string `json:"upi_id"`
	State 		string `json:"state"`
	City 		string `json:"city"`
	Pincode 	string `json:"pincode"`
}


func (s *SmartContract) CreateUser(ctx contractapi.TransactionContextInterface, userData string) (string, error) {

	if len(userData) == 0 {
		return "", fmt.Errorf("Please pass the correct car data")
	}

	var user User
	err := json.Unmarshal([]byte(userData), &user)
	if err != nil {
		return "", fmt.Errorf("Failed while unmarshling car. %s", err.Error())
	}

	userAsBytes, err := json.Marshal(user)
	if err != nil {
		return "", fmt.Errorf("Failed while marshling car. %s", err.Error())
	}

	ctx.GetStub().SetEvent("CreateAsset", userAsBytes)

	return ctx.GetStub().GetTxID(), ctx.GetStub().PutState(user.Adhar_ID, userAsBytes)
}


func main() {

	chaincode, err := contractapi.NewChaincode(new(SmartContract))
	if err != nil {
		fmt.Printf("Error create fabcar chaincode: %s", err.Error())
		return
	}
	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting chaincodes: %s", err.Error())
	}

}
