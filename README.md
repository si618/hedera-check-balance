# Hedera check account balance action
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/si618/hedera-check-balance/Test)

Github Action to [check balance](https://docs.hedera.com/guides/docs/hedera-api/cryptocurrency-accounts/cryptogetaccountbalance) of a Hedera account, optionally failing if there are insufficient hbars.

## Inputs

### `hedera-network`

The Hedera `"mainnet"`, `"testnet"` or `"previewnet"` network in which the account exists. Defaults to `"testnet"` if not set or invalid.

### `operator-id`

[**Required**] The account id of the operator.

### `operator-key`

[**Required**] The private key of the operator. Set using [Github Secret](https://docs.github.com/en/actions/reference/encrypted-secrets).

### `minimum-balance`

[**Required**] The minimum balance in hbars for the action to succeed.

### `account-id`

The account id being checked, defaulting to `operator-id` if not set.

### `fail-action`

Fail this action if account balance is below minimum. Valid values are `true` or `false`. Defaults to `true`.

## Outputs

### `account-balance`

The account balance in ℏ (hbars).

## Example usage

```yaml
- name: Check Ħ account balance
  uses: si618/hedera-check-balance@latest
  with:
    operator-id: ${{ secrets.OPERATOR_ID }}
    operator-key: ${{ secrets.OPERATOR_KEY }}
    minimum-balance: 100 # 100ℏ needed to run tests
```
