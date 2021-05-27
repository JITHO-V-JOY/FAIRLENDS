package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"github.com/hyperledger/fabric/common/flogging"
)

type SmartContract struct {
	contractapi.Contract
}

var logger = flogging.MustGetLogger("fairlends_cc")

type User struct {
	Adhar_ID string `json:"adhar_id"`
	Name     string `json:"name"`
	Role     string `json:"role"`
	Address  string `json:"address"`
	Phone    string `json:"phone"`
	UPI_ID   string `json:"upi_id"`
	State    string `json:"state"`
	City     string `json:"city"`
	Pincode  string `json:"pincode"`
}

// ******************************************** Create User function *************************************************************

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

// ******************************************** Query User function *************************************************************
func (s *SmartContract) QueryUser(ctx contractapi.TransactionContextInterface, adhar_id string) (*User, error) {
	if len(adhar_id) == 0 {
		return nil, fmt.Errorf("Please pass the correct car data")
	}

	userAsBytes, err := ctx.GetStub().GetState(adhar_id)

	if err != nil {
		return nil, fmt.Errorf("failed to read from world state. %s", err.Error())

	}

	if userAsBytes == nil {
		return nil, fmt.Errorf("%s does not exist", adhar_id)

	}

	user := new(User)
	_ = json.Unmarshal(userAsBytes, user)

	return user, nil
}

// ******************************************** main function *************************************************************

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
