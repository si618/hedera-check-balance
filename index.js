const core = require('@actions/core');
const {
    Client,
    AccountBalanceQuery,
    HbarUnit
} = require("@hashgraph/sdk");

async function main() {
    try {
        const hederaNetwork = core.getInput('hedera-network');
        const operatorId = core.getInput('operator-id');
        const operatorKey = core.getInput('operator-key');

        let accountId = core.getInput('account-id');
        if (accountId.length === 0) {
            accountId = operatorId;
        }

        const minimumBalance = core.getInput('minimum-balance');
        if (isNaN(minimumBalance) || isNaN(parseFloat(minimumBalance))) {
            core.setFailed(`minimum-balance ${minimumBalance} should be a number (in hbars)`);
            return;
        }
        let minimumHbars = Number(minimumBalance);

        console.log(
            `Checking balance of ${accountId} on ${hederaNetwork} using operator ${operatorId}`);

        let client;

        switch (hederaNetwork) {
            case "mainnet":
                client = Client.forMainnet();
                break;
            case "previewnet":
                client = Client.forPreviewnet();
                break;
            default:
                client = Client.forTestnet()
        }

        client.setOperator(operatorId, operatorKey);

        const balance = await new AccountBalanceQuery()
            .setAccountId(accountId)
            .execute(client);

        const hbars = balance.hbars.to(HbarUnit.Hbar).integerValue();

        core.setOutput('account-balance', hbars);

        var result = hbars < minimumHbars ? 'below' : 'above';
        console.log(`Balance ${hbars} ${result} minimum ${minimumHbars}`);

        if (hbars < minimumHbars) {
            core.setFailed('Account balance less than minimum');
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

void main();
