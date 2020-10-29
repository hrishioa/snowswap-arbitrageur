// Snowswap arbitrage bot

// Contract addreses here - https://docs.yearn.finance/developers/deployed-contracts-registry

let balances = {
  'yDAI': {
    amount: 4990.25,
    pricePerShare: 1077098232872389633,
    contractAddress: "0xACd43E627e64355f1861cEC6d3a6688B31a6F952",
  },
  'yUSDC': {
    amount: 5033.66,
    pricePerShare: 1034775801659238408,
    contractAddress: "0x597aD1e0c13Bfe8025993D9e79C69E1c0233522e",
  },
  'yUSDT': {
    amount: 5038.51,
    pricePerShare: 1036695279386445924,
    contractAddress: "0x2f08119c6f07c006695e079aafc638b8789faf18",
  },
  'yTUSD': {
    amount: 5042.08,
    pricePerShare: 1054078462713844676,
    contractAddress: "0x37d19d1c4E1fa9DC47bD1eA12f742a0887eDa74a"
  },
};

Object.keys(balances).map(coin => {
  balances[coin].finalAmount = (balances[coin].amount*balances[coin].pricePerShare)/(10**18)
})

console.log(balances);