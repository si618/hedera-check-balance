import { getInput, setFailed, setOutput } from "@actions/core";
import { AccountBalanceQuery, Client, Hbar, HbarUnit } from "@hashgraph/sdk";

async function main() {
  try {
    const hederaNetwork = getInput("hedera-network").toLowerCase();
    const operatorId = getInput("operator-id");
    const operatorKey = getInput("operator-key");
    const failAction = getInput("fail-action").toLowerCase() !== "false";

    let accountId = getInput("account-id");
    if (accountId.length === 0) {
      accountId = operatorId;
    }

    const minimumBalance = getInput("minimum-balance");
    if (isNaN(minimumBalance) || isNaN(parseFloat(minimumBalance))) {
      setFailed(`minimum-balance ${minimumBalance} should be a number`);
      return;
    }
    const minimumHbars = new Hbar(minimumBalance, HbarUnit.Hbar);

    console.log(
      `Checking account ${accountId} balance on ${hederaNetwork} using operator ${operatorId}`
    );

    let client;

    switch (hederaNetwork) {
      case "mainnet":
        client = Client.forMainnet();
        break;
      case "previewnet":
        client = Client.forPreviewnet();
        break;
      default:
        client = Client.forTestnet();
    }

    client.setOperator(operatorId, operatorKey);

    const balance = await new AccountBalanceQuery()
      .setAccountId(accountId)
      .execute(client);

    setOutput("account-balance", balance.hbars);

    const isLessThan = balance.hbars
      .toBigNumber()
      .isLessThan(minimumHbars.toBigNumber());
    const result = isLessThan ? "below" : "above or equal to";
    const msg = `Balance of ${balance.hbars} is ${result} minimum ${minimumHbars}`;
    console.log(msg);

    if (failAction && isLessThan) {
      setFailed(msg);
    }
  } catch (error) {
    setFailed(error.message);
  }
}

void main();
