exports.get = async (event) => {}

exports.connect = async (event) => {
    try {
        const accForm = event["body-json"];
        return { 
            bankId: accForm.bankId,
            accountId: "fakeAcc113",
            SchemeName: "IBAN",
            Identification: "GB83BANK43215378060931",
            Name: "Debit Account",
            dateAuthorised: "2018-09-06"
        };
    } catch (err) {
        throw new Error('[500] Internal Server Error');
    }
}