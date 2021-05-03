
#chmod -R 0755 ./crypto-config

# Delet existing artifacts

#rm -rf ./crypto-config
#rm genesis.block mychannel.tx


# Generate Crypto artifacts for organizations

#cryptogen generate --config=./crypto-config.yaml --output=./crypto-config

SYS_CHANNEL="sys-channel"

CHANNEL_NAME="mychannel"

echo $CHANNEL_NAME


#Generate System Genisis Block

configtxgen -profile OrdererGenesis -configPath ../../configtx -channelID $SYS_CHANNEL -outputBlock ../../channel/genisis.block

# Generate channel configuration block

configtxgen -profile BasicChannel -configPath ../../configtx -outputCreateChannelTx ../../channel/mychannel.tx -channelID $CHANNEL_NAME