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

var logger = flogging.MustGetLogger("fabcar_cc")

type Repayment struct {
	Date    string `json:"date"`
	Payment bool   `json:"payment"`
}

type User struct {
	Adhar_ID string `json:"adhar_id"`
	Name     string `json:"name"`
	Role     string `json:"role"`
	Address  string `json:"address"`
	UPI_ID   string `json:"upi_id"`
	State    string `json:"state"`
	City     string `json:"city"`
	Pincode  string `json:"pincode"`
}

type Loan struct {
	Loan_ID      string      `json:"loan_id"`
	Issuer       string      `json:"issuer"`
	Lender       string      `json:"lender"`
	Amount       int64       `json:"amount"`
	Interest     int         `json:"interest"`
	Tenure       int         `json:"tenure"`
	Approved     bool        `json:"approved"`
	IssuedDate   string      `json:"issued_date"`
	ApprovedDate string      `json:"approved_date"`
	EndDate      string      `json:"end_date"`
	Emi          []Repayment `json:"emi"`
	Tax          []Repayment `json:"tax"`
	Status       string      `json:"status"`
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

// ******************************************** Issue Loan function *************************************************************

func (s *SmartContract) IssueLoan(ctx contractapi.TransactionContextInterface, loanData string) (string, error) {

	if len(loanData) == 0 {
		return "", fmt.Errorf("Please pass the correct loan data")
	}

	var loan Loan
	err := json.Unmarshal([]byte(loanData), &loan)
	if err != nil {
		return "", fmt.Errorf("Failed while unmarshling loan. %s", err.Error())
	}

	loanAsBytes, err := json.Marshal(loan)
	if err != nil {
		return "", fmt.Errorf("Failed while marshling car. %s", err.Error())
	}

	ctx.GetStub().SetEvent("CreateAsset", loanAsBytes)

	return ctx.GetStub().GetTxID(), ctx.GetStub().PutState(loan.Loan_ID, loanAsBytes)
}

// ******************************************** Adding Lenderfunction *************************************************************

func (s *SmartContract) AddLender(ctx contractapi.TransactionContextInterface, adhar_id string, loan_id string) (string, error) {
	if len(adhar_id) == 0 || len(loan_id) == 0 {
		return "", fmt.Errorf("Please pass the correct loan data")
	}

	loanAsBytes, err := ctx.GetStub().GetState(loan_id)

	if err != nil {
		return "", fmt.Errorf("Failed to get loan data. %s", err.Error())
	}

	if loanAsBytes == nil {
		return "", fmt.Errorf("%s does not exist", loan_id)
	}

	loan := new(Loan)
	_ = json.Unmarshal(loanAsBytes, loan)

	loan.Lender = adhar_id

	loanAsBytes, err = json.Marshal(loan)
	if err != nil {
		return "", fmt.Errorf("Failed while marshling loan. %s", err.Error())
	}

	return ctx.GetStub().GetTxID(), ctx.GetStub().PutState(loan.Loan_ID, loanAsBytes)

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
