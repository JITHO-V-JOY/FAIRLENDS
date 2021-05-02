
#chmod -R 0755 ./crypto-config

# Delet existing artifacts

#rm -rf ./crypto-config
#rm genesis.block mychannel.tx


# Generate Crypto artifacts for organizations
cryptogen generate --config=./crypto-config.yaml --output=./crypto-config