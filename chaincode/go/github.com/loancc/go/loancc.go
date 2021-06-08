package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"github.com/hyperledger/fabric/common/flogging"
)

type LoanContract struct {
	contractapi.Contract
}

var logger = flogging.MustGetLogger("loancc_cc")

type Repayment struct {
	Date    string `json:"date"`
	Payment bool   `json:"payment"`
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

func (s *LoanContract) IssueLoan(ctx contractapi.TransactionContextInterface, loanData string) (string, error) {

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

// ******************************************** Add Lender function *************************************************************

func (s *LoanContract) AddLender(ctx contractapi.TransactionContextInterface, adhar_id string, loan_id string) (string, error) {
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

// ******************************************** Approve Loan function *************************************************************

func (s *LoanContract) ApproveLoan(ctx contractapi.TransactionContextInterface, loan_id string) (string, error) {
	if len(loan_id) == 0 {
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

	loan.Approved = true
	loan.Status = "Active"
	txntmsp, err := ctx.GetStub().GetTxTimestamp()
	if err != nil {
		return "", fmt.Errorf("Failed while geting timestamp. %s", err.Error())
	}
	loan.ApprovedDate = time.Unix(txntmsp.Seconds, int64(txntmsp.Nanos)).String()
	loan.EndDate = time.Unix(txntmsp.Seconds, int64(txntmsp.Nanos)).AddDate(0, loan.Tenure, 0).String()

	for i := 1; i <= loan.Tenure; i++ {
		loan.Emi = append(loan.Emi, Repayment{time.Unix(txntmsp.Seconds, int64(txntmsp.Nanos)).AddDate(0, i, 0).String(), false})
	}

	for i := 1; i <= loan.Tenure; i++ {
		loan.Tax = append(loan.Tax, Repayment{time.Unix(txntmsp.Seconds, int64(txntmsp.Nanos)).AddDate(0, i, 0).String(), false})
	}

	loanAsBytes, err = json.Marshal(loan)
	if err != nil {
		return "", fmt.Errorf("Failed while marshling loan. %s", err.Error())
	}

	return ctx.GetStub().GetTxID(), ctx.GetStub().PutState(loan.Loan_ID, loanAsBytes)
}

// ******************************************** Redeem function *************************************************************

func (s *LoanContract) Redeem(ctx contractapi.TransactionContextInterface, loan_id string) (string, error) {
	if len(loan_id) == 0 {
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

	loan.Status = "Redeem"

	loanAsBytes, err = json.Marshal(loan)
	if err != nil {
		return "", fmt.Errorf("Failed while marshling loan. %s", err.Error())
	}

	return ctx.GetStub().GetTxID(), ctx.GetStub().PutState(loan.Loan_ID, loanAsBytes)
}

// ******************************************** pay emi *************************************************************

func (s *LoanContract) PayEMI(ctx contractapi.TransactionContextInterface, loan_id string) (string, error) {
	if len(loan_id) == 0 {
		return "", fmt.Errorf("Please pass the correct date")
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

	txntmsp, err := ctx.GetStub().GetTxTimestamp()
	if err != nil {
		return "", fmt.Errorf("Failed while geting timestamp. %s", err.Error())
	}

	for i := 0; i < len(loan.Emi); i++ {
		payDate, err := time.Parse("2006-01-02 15:04:05", loan.Emi[i].Date[:len(loan.Emi[i].Date)-20])
		fmt.Println("pay date", payDate)
		fmt.Println("checking before", payDate.Before(time.Unix(txntmsp.Seconds, int64(txntmsp.Nanos))))
		fmt.Println("checking After", payDate.AddDate(0, -1, 0).After(time.Unix(txntmsp.Seconds, int64(txntmsp.Nanos))))

		if err != nil {
			return "", fmt.Errorf("Failed while parsing date. %s", err.Error())
		}

		if payDate.Equal(time.Unix(txntmsp.Seconds, int64(txntmsp.Nanos))) || (payDate.After(time.Unix(txntmsp.Seconds, int64(txntmsp.Nanos))) && payDate.AddDate(0, -1, 0).Before(time.Unix(txntmsp.Seconds, int64(txntmsp.Nanos)))) {
			loan.Emi[i].Payment = true
			fmt.Println("loan", loan.Emi[i])
			break
		}
	}

	loanAsBytes, err = json.Marshal(loan)
	if err != nil {
		return "", fmt.Errorf("Failed while marshling loan. %s", err.Error())
	}

	return ctx.GetStub().GetTxID(), ctx.GetStub().PutState(loan.Loan_ID, loanAsBytes)
}

// ******************************************** pay tax *************************************************************

func (s *LoanContract) PayTax(ctx contractapi.TransactionContextInterface, loan_id string) (string, error) {
	if len(loan_id) == 0 {
		return "", fmt.Errorf("Please pass the correct date")
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

	txntmsp, err := ctx.GetStub().GetTxTimestamp()
	if err != nil {
		return "", fmt.Errorf("Failed while geting timestamp. %s", err.Error())
	}

	for i := 0; i < len(loan.Tax); i++ {
		payDate, err := time.Parse("2006-01-02 15:04:05", loan.Tax[i].Date[:len(loan.Tax[i].Date)-20])
		if err != nil {
			return "", fmt.Errorf("Failed while parsing date. %s", err.Error())
		}
		if payDate.Equal(time.Unix(txntmsp.Seconds, int64(txntmsp.Nanos))) || (payDate.After(time.Unix(txntmsp.Seconds, int64(txntmsp.Nanos))) && payDate.AddDate(0, -1, 0).Before(time.Unix(txntmsp.Seconds, int64(txntmsp.Nanos)))) {
			loan.Tax[i].Payment = true
			break
		}
	}

	loanAsBytes, err = json.Marshal(loan)
	if err != nil {
		return "", fmt.Errorf("Failed while marshling loan. %s", err.Error())
	}

	return ctx.GetStub().GetTxID(), ctx.GetStub().PutState(loan.Loan_ID, loanAsBytes)
}

// ******************************************** get loan by id *************************************************************

func (s *LoanContract) GetLoanById(ctx contractapi.TransactionContextInterface, loanID string) (*Loan, error) {
	if len(loanID) == 0 {
		return nil, fmt.Errorf("Please provide the correct loan id")
	}

	loanAsBytes, err := ctx.GetStub().GetState(loanID)

	if err != nil {
		return nil, fmt.Errorf("failed to read from world state. %s", err.Error())
	}
	if loanAsBytes == nil {
		return nil, fmt.Errorf("%s does not exist", loanID)
	}

	loan := new(Loan)
	_ = json.Unmarshal(loanAsBytes, loan)

	return loan, nil
}

func main() {

	chaincode, err := contractapi.NewChaincode(new(LoanContract))
	if err != nil {
		fmt.Printf("Error create fabcar chaincode: %s", err.Error())
		return
	}
	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting chaincodes: %s", err.Error())
	}

}
