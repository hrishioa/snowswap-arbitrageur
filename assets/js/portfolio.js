let pickleFarm;
let cachedPickleContract = null;
let defaultFarmAddress = "0xbd17b1ce622d73bd438b9e658aca5996dc394b0d";

let ERC20ABI = JSON.parse('[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]');
let uniswapABI = JSON.parse('[{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount0Out","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1Out","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Swap","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint112","name":"reserve0","type":"uint112"},{"indexed":false,"internalType":"uint112","name":"reserve1","type":"uint112"}],"name":"Sync","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MINIMUM_LIQUIDITY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"burn","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getReserves","outputs":[{"internalType":"uint112","name":"_reserve0","type":"uint112"},{"internalType":"uint112","name":"_reserve1","type":"uint112"},{"internalType":"uint32","name":"_blockTimestampLast","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_token0","type":"address"},{"internalType":"address","name":"_token1","type":"address"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"kLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"mint","outputs":[{"internalType":"uint256","name":"liquidity","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"price0CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"price1CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"skim","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount0Out","type":"uint256"},{"internalType":"uint256","name":"amount1Out","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"swap","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"sync","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token0","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"token1","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]')

//################################ Loading functions

if(window.ethereum) {
  console.log("Enabling...");
  window.web3 = new Web3(window.ethereum);
  window.ethereum.enable().then(async () => {
    console.log("Enabled.");
    loaded = true;
    // getPositions("0x420E7b56927EDfd45B126a0373C4b66ce96F68C6");
    pickleFarm = await initializePickleFarm("0x420E7b56927EDfd45B126a0373C4b66ce96F68C6") // 3Crv
    // pickleFarm = await initializePickleFarm("0xbd17b1ce622d73bd438b9e658aca5996dc394b0d", "0xfa53a46c2F9131C37Eb41C1c3a8af95418199A9F") // renBTC
    // pickleFarm = await initializePickleFarm("0xbd17b1ce622d73bd438b9e658aca5996dc394b0d", "0x420E7b56927EDfd45B126a0373C4b66ce96F68C6") // Staking & pDAI
    appendToResults(getPickleFarmStr(pickleFarm));
    // console.log("Pickle farm loaded.");
  })
} else {
  appendToResults("No metamask detected.", false);
}

function getPositions(forceAddress) {
  if(!loaded)
    return appendToResults("Please wait for the page to finish loading. KTHXBAI", false)

  let address = forceAddress || $('#myAddress').val();

  if(!window.web3.utils.isAddress(address))
    return appendToResults("Invalid address", false);

  appendToResults("Loading positions", true);

  initializePickleFarm(address).then(farm => {
    pickleFarm = farm;
    appendToResults(getPickleFarmStr(pickleFarm), true);
  })
}

//################################ Utility Functions

function loadEtherscanContract(address) {
  return new Promise((resolve, reject) => {
    address = window.web3.utils.toChecksumAddress(address);
    $.getJSON('https://api.etherscan.io/api?module=contract&action=getabi&address='+address+'&apiKey=SAGEZQUGE76DD1AEFIV1CYA821S72QABRM', function (data) {
      try {
        let contractABI = JSON.parse(data.result);
        if(contractABI)
          resolve(new window.web3.eth.Contract(contractABI, address));
        else
          reject(null);
      } catch(err) {
        console.log(err);
        reject(null);
      }
    });
  })
}

function etherScanLinkAddress(address) {
  return `https://etherscan.io/address/${address}`;
}

function etherScanLinkTx(txid) {
  return `https://etherscan.io/tx/${txid}`;
}

//################################ Event processing

async function addMetadata(events) {
  addOrdering(events);
  await addTimestamp(events);
}

function addOrdering(events) {
  events.map(event => {
    event.ordering = (event.blockNumber*100000)+event.transactionIndex;
  });
}

async function addTimestamp(events) {
  await Promise.all(events.map(async event => {
    event.timestamp = new Date((await window.web3.eth.getBlock(event.blockNumber)).timestamp*1000);
  }))
}

//################################# Pickle Farm Functions

async function initializePickleFarm(myAddress, farmAddress) {
  if(!farmAddress)
    farmAddress = defaultFarmAddress;
  else if(!window.web3.utils.isAddress(farmAddress))
    return appendToResults("Invalid farm address provided");

  farmAddress = window.web3.utils.toChecksumAddress(farmAddress);

  myAddress = window.web3.utils.toChecksumAddress(myAddress);

  console.log("Initializing pickle farm");

  let farmContract;
  if(!cachedPickleContract || cachedPickleContract._address !== farmAddress) {
    console.log("loading farm contract");
    farmContract = new window.web3.eth.Contract(pickleFarmABI, farmAddress);
    // farmContract = await loadEtherscanContract(farmAddress);
    cachedPickleContract = farmContract;
  } else {
    farmContract = cachedPickleContract;
  }

  let poolCount = parseFloat(await farmContract.methods.poolLength().call());

  let pickleContract = new window.web3.eth.Contract(ERC20ABI, await farmContract.methods.pickle().call());

  let pickleDecimals = parseFloat(await pickleContract.methods.decimals().call());

  let pickleWithdraws = await pickleContract.getPastEvents("Transfer", {
    filter: {
      from: farmAddress,
      to: myAddress
    },
    fromBlock: 0,
    toBlock: 'latest'
  });

  await addMetadata(pickleWithdraws);

  let pools = await Promise.all([...Array(poolCount).keys()].map(async index => {
    let ret = {
      poolInfo: await farmContract.methods.poolInfo(index).call(),
      userInfo: await farmContract.methods.userInfo(index, myAddress).call(),
      pendingPickles: parseFloat(await farmContract.methods.pendingPickle(index, myAddress).call())
    }

    ret.tokenContract = new window.web3.eth.Contract(ERC20ABI, ret.poolInfo.lpToken);

    let pickleJar = await loadPickleJar(ret.poolInfo.lpToken, ret.userInfo.amount, myAddress);

    if(pickleJar) {
      ret.type = "pickleJar";
      ret.jar = pickleJar;
    }

    ret.tokenName = await ret.tokenContract.methods.name().call();

    if(ret.type !== "pickleJar" && ret.tokenName.search(/Uniswap/i) !== -1) {
      try {
        let uniswapContract = await new window.web3.eth.Contract(uniswapABI, ret.poolInfo.lpToken);
        let token0 = new window.web3.eth.Contract(ERC20ABI, await uniswapContract.methods.token0().call());
        let token1 = new window.web3.eth.Contract(ERC20ABI, await uniswapContract.methods.token1().call());
        ret.token0Name = await token0.methods.name().call();
        ret.token1Name = await token1.methods.name().call();
        ret.type = "uniswap";
      } catch(err) {
        console.log("Error trying to load uniswap contract - ",err);
      }
    }

    ret.decimals = parseFloat(await ret.tokenContract.methods.decimals().call());

    ret.withdraws = await farmContract.getPastEvents("Withdraw", {
      filter: {
        user: myAddress,
        pid: String(index),
      },
      fromBlock: 0,
      toBlock: 'latest'
    });

    await addMetadata(ret.withdraws);

    ret.deposits = await farmContract.getPastEvents("Deposit", {
      filter: {
        user: myAddress,
        pid: String(index),
      },
      fromBlock: 0,
      toBlock: 'latest'
    });

    await addMetadata(ret.deposits);

    ret.positions = calculatePositions(ret.deposits, ret.withdraws, ret.decimals);

    calculateRewards(ret.positions, ret.withdraws, ret.pendingPickles, pickleWithdraws);
    await addPickleValue(ret.positions);

    return ret;
  }));

  console.log("Initialized Farm");

  return {
    farmAddress,
    farmContract,
    myAddress,
    poolCount,
    pickleContract,
    pools,
    pickleWithdraws,
    pickleDecimals
  }
}

//################################# Financial Functions

function calculatePositions(paramDeposits, paramWithdraws, decimals, verbose) {
  deposits = JSON.parse(JSON.stringify(paramDeposits));
  withdraws = JSON.parse(JSON.stringify(paramWithdraws));

  withdraws = withdraws.sort((a,b) => a.ordering-b.ordering);

  let positions = [];

  for(let i=0;i<withdraws.length;i++) {
    let withdraw = withdraws[i];

    let withdrawAmount = withdraw.event === "Transfer" ? parseFloat(withdraw.returnValues.value) : parseFloat(withdraw.returnValues.amount);

    if(verbose)
      console.log("Processing withdrawal ",i," on block ",withdraw.blockNumber, ", ordering ", withdraw.ordering, " for ",withdrawAmount/(10**decimals));

    if(withdrawAmount === 0) {
      if(verbose)
        console.log("Skipping for zero withdrawal");
      continue;
    }

    let validDeposits = deposits.filter(deposit => deposit.ordering < withdraw.ordering)
                                .sort((a,b) => b.ordering-a.ordering);

    if(verbose)
      console.log("Found ",validDeposits.length," possible deposits");

    for(let j=0;j<validDeposits.length;j++) {
      let deposit = validDeposits[j];
      let depositAmount = deposit.event === "Transfer" ? parseFloat(deposit.returnValues.value) : parseFloat(deposit.returnValues.amount);

      if(verbose)
        console.log("*** Trying to match with deposit on block ",deposit.blockNumber, ", ordering ", deposit.ordering, " of ",depositAmount/(10**18));

      if(depositAmount === 0) {
        if(verbose)
          console.log("*** Skipping emptied deposit...");
        continue;
      }

      let depositEvent = paramDeposits.find(pDeposit => pDeposit.ordering === deposit.ordering);
      let withdrawEvent = paramWithdraws.find(pWithdraw => pWithdraw.ordering === withdraw.ordering);

      if(depositAmount >= withdrawAmount) {
        if(verbose)
          console.log("*** Matched ", (depositAmount === withdrawAmount ? "exact": "full"), " value of remaining withdrawal amount - ",withdrawAmount/(10**decimals));
        let position = {
          amount: withdrawAmount,
          open: false,
          opened: depositEvent.timestamp,
          closed: withdrawEvent.timestamp,
          depositEvent,
          withdrawEvent,
        };
        position.timeAmount = position.amount*(position.closed-position.opened);
        positions.push(position);
        if(deposit.event === "Transfer") // This is hacky, I know
          deposit.returnValues.value = parseFloat(deposit.returnValues.value) - withdrawAmount;
        else
          deposit.returnValues.amount = parseFloat(deposit.returnValues.amount) - withdrawAmount;
        withdrawAmount = 0;
        break;
      } else {
        if(verbose)
          console.log("*** Matched partial value (",depositAmount(10**decimals),") of remaining withdrawal amount - ",withdrawAmount/(10**decimals));
        let position = {
          amount: depositAmount,
          open: false,
          opened: depositEvent.timestamp,
          closed: withdrawEvent.timestamp,
          depositEvent,
          withdrawEvent,
        };
        position.timeAmount = position.amount*(position.closed-position.opened);
        positions.push(position);
        withdrawAmount -= depositAmount;
        if(deposit.event === "Transfer") // This is hacky too so shoot me
          deposit.returnValues.value = 0;
        else
          deposit.returnValues.amount = 0;
        continue;
      }

      if(withdrawAmount <= 0) {
        if(verbose)
          console.log("This shouldnt' happen, exiting out of innter loop.");
        break;
      }
    }

    if(withdrawAmount) {
      if(verbose)
        console.log("Unmatched withdrawal amount - ",withdrawAmount/(10**decimals))
    } else {
      if(verbose)
        console.log("Fully matched withdrawal amount.");
    }
  }

  let remainingDeposits = deposits.filter(deposit => deposit.event === "Transfer" ? parseFloat(deposit.returnValues.value) > 0 : parseFloat(deposit.returnValues.amount) > 0).sort((a,b) => a.ordering-b.ordering);

  let remainingDepositAmount = remainingDeposits.reduce((acc, cur) => acc+(cur.event === "Transfer" ? parseFloat(cur.returnValues.value) : parseFloat(cur.returnValues.amount)), 0);
  if(remainingDepositAmount)
    if(verbose)
      console.log(String(remainingDeposits.length)+" Unreconciled deposits - ",remainingDepositAmount/(10**decimals));

  for(let j=0;j<remainingDeposits.length;j++) {
    let deposit = remainingDeposits[j];
    let depositAmount = deposit.event === "Transfer" ? parseFloat(deposit.returnValues.value) : parseFloat(deposit.returnValues.amount);

    let depositEvent = paramDeposits.find(pDeposit => pDeposit.ordering === deposit.ordering);

    if(verbose)
      console.log("Adding unreconciled deposit of ",depositAmount/(10**decimals)," to position...");

    let position = {
      amount: depositAmount,
      open: true,
      opened: depositEvent.timestamp,
      depositEvent,
    };
    position.timeAmount = position.amount*(new Date()-position.opened);
    positions.push(position);
  }

  return positions;
}

function calculateRewards(positions, withdraws, pendingPickles, pickleWithdraws, verbose) {
  if(pendingPickles)
    assignRewardToPosition(pendingPickles, new Date(), positions, true);

  for(let i=0;i<withdraws.length;i++) {
    let withdraw = withdraws[i];

    if(verbose)
      console.log(" ===== Considering account withdraw ",i, " of ",parseFloat(withdraw.returnValues.amount));

    let matchingPickleWithdraws = pickleWithdraws.filter(pWithdraw => pWithdraw.ordering === withdraw.ordering && !pWithdraw.used);
    matchingPickleWithdraws.map(pWithdraw => pWithdraw.used = true);

    if(verbose)
      console.log("Found ",matchingPickleWithdraws.length," matching pickle withdraws");

    matchingPickleWithdraws.map(pWithdraw => {
      if(verbose)
        console.log(" =========== Considering pickle withdraw of size ",parseFloat(pWithdraw.returnValues.value)/(10**18))
      assignRewardToPosition(parseFloat(pWithdraw.returnValues.value), pWithdraw.timestamp, positions, false)
    });
  }
}

function assignRewardToPosition(rewardAmount, rewardTimestamp, positions, pending, verbose) {
  let eligiblePositions = positions.filter(position => position.open || position.closed >= rewardTimestamp);
  let totalTimeAmount = eligiblePositions.reduce((acc, cur) => acc+cur.timeAmount, 0);

  if(verbose)
    console.log(" ====== Found ",eligiblePositions.length," eligible positions for reward at ",rewardTimestamp, " for amount ",rewardAmount, " total timeAmount is ",totalTimeAmount);

  eligiblePositions.map(position => {
    if(isNaN(parseFloat(position.rewardPickles)))
      position.rewardPickles = 0;
    if(isNaN(parseFloat(position.pendingPickles)))
      position.pendingPickles = 0;

    position.rewardPickles += rewardAmount*(position.timeAmount/totalTimeAmount);
    if(pending)
      position.pendingPickles += rewardAmount*(position.timeAmount/totalTimeAmount);
    if(verbose)
      console.log(" ====== Distributed ",rewardAmount*(position.timeAmount/totalTimeAmount)/(10**18)," to position ",position);
  })
}

async function addPickleValue(positions) {
  let PEPair = await getPickleETHPair();
  let EUPair = await getETHUSDTPair();

  await Promise.all(positions.map(async position => {
    if(position.rewardPickles)
      position.rewardUSDT = await EUPair.swap0to1(await PEPair.swap0to1(position.rewardPickles));
    if(position.pendingPickles)
      position.pendingUSDT = await EUPair.swap0to1(await PEPair.swap0to1(position.pendingPickles));
  }));
}

//################################## PickleJar Functions

let pickleJarABI = JSON.parse(`[{"inputs":[{"internalType":"address","name":"_token","type":"address"},{"internalType":"address","name":"_governance","type":"address"},{"internalType":"address","name":"_controller","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"available","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"balance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"controller","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"depositAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"earn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getRatio","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"governance","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"reserve","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"harvest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"max","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"min","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_controller","type":"address"}],"name":"setController","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_governance","type":"address"}],"name":"setGovernance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_min","type":"uint256"}],"name":"setMin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_shares","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawAll","outputs":[],"stateMutability":"nonpayable","type":"function"}]`);
let pickleFarmABI = JSON.parse(`[{"inputs":[{"internalType":"contract PickleToken","name":"_pickle","type":"address"},{"internalType":"address","name":"_devaddr","type":"address"},{"internalType":"uint256","name":"_picklePerBlock","type":"uint256"},{"internalType":"uint256","name":"_startBlock","type":"uint256"},{"internalType":"uint256","name":"_bonusEndBlock","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"EmergencyWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Recovered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"BONUS_MULTIPLIER","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_allocPoint","type":"uint256"},{"internalType":"contract IERC20","name":"_lpToken","type":"address"},{"internalType":"bool","name":"_withUpdate","type":"bool"}],"name":"add","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"bonusEndBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_devaddr","type":"address"}],"name":"dev","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"devFundDivRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"devaddr","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"}],"name":"emergencyWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_from","type":"uint256"},{"internalType":"uint256","name":"_to","type":"uint256"}],"name":"getMultiplier","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"massUpdatePools","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"address","name":"_user","type":"address"}],"name":"pendingPickle","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pickle","outputs":[{"internalType":"contract PickleToken","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"picklePerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"poolInfo","outputs":[{"internalType":"contract IERC20","name":"lpToken","type":"address"},{"internalType":"uint256","name":"allocPoint","type":"uint256"},{"internalType":"uint256","name":"lastRewardBlock","type":"uint256"},{"internalType":"uint256","name":"accPicklePerShare","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"poolLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_allocPoint","type":"uint256"},{"internalType":"bool","name":"_withUpdate","type":"bool"}],"name":"set","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_bonusEndBlock","type":"uint256"}],"name":"setBonusEndBlock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_devFundDivRate","type":"uint256"}],"name":"setDevFundDivRate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_picklePerBlock","type":"uint256"}],"name":"setPicklePerBlock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"startBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalAllocPoint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"}],"name":"updatePool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"name":"userInfo","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"rewardDebt","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]`);

async function loadPickleJar(farmAddress, shares, myAddress) {
  let pickleJar = {
    address: window.web3.utils.toChecksumAddress(farmAddress)
  };

  pickleJar.contract = new window.web3.eth.Contract(pickleJarABI, pickleJar.address);

  try {
    pickleJar.ratio = parseFloat(await pickleJar.contract.methods.getRatio().call());
  } catch(err) {
    // Not a pickle farm
    return null;
  }

  pickleJar.balance = parseFloat(await pickleJar.contract.methods.balance().call());
  if(shares) {
    pickleJar.coins = ((pickleJar.ratio/(10**18))*parseFloat(shares));
    pickleJar.shares = parseFloat(shares);
  }

  pickleJar.decimals = parseFloat(await pickleJar.contract.methods.decimals().call());
  pickleJar.baseTokenContract = new window.web3.eth.Contract(ERC20ABI, await pickleJar.contract.methods.token().call());
  pickleJar.baseTokenDecimals = parseFloat(await pickleJar.baseTokenContract.methods.decimals().call());
  pickleJar.baseTokenName = await pickleJar.baseTokenContract.methods.name().call();

  if(pickleJar.baseTokenName.search(/Uniswap/i) !== -1) {
    try {
      let uniswapContract = await new window.web3.eth.Contract(uniswapABI, await pickleJar.contract.methods.token().call());
      let token0 = new window.web3.eth.Contract(ERC20ABI, await uniswapContract.methods.token0().call());
      let token1 = new window.web3.eth.Contract(ERC20ABI, await uniswapContract.methods.token1().call());
      pickleJar.token0Name = await token0.methods.name().call();
      pickleJar.token1Name = await token1.methods.name().call();
      pickleJar.jarType = "uniswap";
    } catch(err) {
      console.log("Error trying to load uniswap contract - ",err);
    }
  }

  pickleJar.events = await getPickleJarEvents(pickleJar, myAddress);

  // TODO: Somehow reconcile old and new jars due to the bug

  pickleJar.positions = calculatePositions(pickleJar.events.deposits, pickleJar.events.withdraws, pickleJar.decimals);
  pickleJar.positions = collapseOpenPositions(pickleJar.positions);

  calculateJarProfit(pickleJar);

  return pickleJar;
}

// TODO: Maybe add actual signature check for type of function
// let depositHash = window.web3.eth.abi.encodeFunctionSignature(pickleJarABI.filter(f => f.name==="deposit")[0]);
// let withdrawHash = window.web3.eth.abi.encodeFunctionSignature(pickleJarABI.filter(f => f.name==="withdraw")[0]);

function collapseOpenPositions(positions) {
  positions.map(position => position.depositEvents = [position.depositEvent]);

  let openPositions = positions.filter(position => position.open).sort((a, b) => a.opened-b.opened);
  let newPositions = positions.filter(position => !position.open);

  if(openPositions.length) {
    let openPosition = openPositions[0];
    openPositions.slice(1).map(position => {
      openPosition.depositEvents.push(position.depositEvent);
      openPosition.amount += position.amount;
    });

    newPositions.push(openPosition);
  }
  return newPositions;
}

let yieldQuantumMs = 1000*60*60*24.0;
let yearMs         = 1000*60*60*24*365.25;

function calculateJarProfit(jar, verbose) {
  jar.positions.map(position => {
    position.openingTokens = (parseFloat(position.amount)/parseFloat(position.depositEvents.reduce((acc, event) => acc+parseFloat(event.returnValues.value), 0)))*(parseFloat(position.depositEvents.reduce((acc, event) => acc+parseFloat(event.tokenEvent.returnValues.value), 0)));
  })

  jar.positions.map(position => {
    if(!jar.shares || !jar.coins) {
      position.closingTokens = position.openingTokens;
    } else {
      if(!position.open && !position.withdrawEvent)
        position.closingTokens = (parseFloat(position.amount)/parseFloat(position.withdrawEvent.returnValues.value))*parseFloat(position.withdrawEvent.tokenEvent.returnValues.value);
      else // This will give a mathematically wrong result without open position collapsing
        position.closingTokens = (parseFloat(position.amount)/parseFloat(jar.shares))*parseFloat(jar.coins);
    }

    position.profitTokens = position.closingTokens - position.openingTokens;

    let quantumsPassed = ((position.open ? new Date() : new Date(position.closed))-new Date(position.opened))/yieldQuantumMs;

    position.interestRate = (position.profitTokens/quantumsPassed)/position.openingTokens;
    position.yieldRate = ((1+position.interestRate)**(yearMs/yieldQuantumMs))-1;

    if(verbose)
      console.log("openingTokens - ",position.openingTokens, ", closingTokens - ",position.closingTokens, " open position - ",position.open, " position - ",position, ", jar - ",jar);

    if(verbose)
      console.log("Got profit ",position.profitTokens/(10**jar.baseTokenDecimals), jar.baseTokenName," for ",((position.open ? new Date() : new Date(position.closed))-new Date(position.opened))/(1000*60*60*24)," days with APY% ",position.yieldRate*100.0);
  });


}

async function getPickleJarEvents(jar, myAddress, verbose) {
  let deposits = await jar.contract.getPastEvents("Transfer", {
    filter: {
      from: "0x0000000000000000000000000000000000000000",
      // from: jar.address,
      to: myAddress,
    },
    fromBlock: 0,
    toBlock: "latest"
  });

  addMetadata(deposits);

  if(deposits.length)
    if(verbose)
      console.log("Found ",deposits.length," deposit transactions for jar ",jar.baseTokenName, " - ",deposits," at ",jar.address);

  let tokenDeposits = await jar.baseTokenContract.getPastEvents("Transfer", {
    filter: {
      from: myAddress,
      to: jar.address
    },
    fromBlock: 0,
    toBlock: "latest"
  })

  addOrdering(tokenDeposits);

  if(tokenDeposits.length)
    if(verbose)
      console.log("Found ",tokenDeposits.length, " token deposit transactions for ",jar.baseTokenName);

  deposits.map(deposit => {
    let matchingTokenEvent = tokenDeposits.find(tD => tD.ordering === deposit.ordering)
    if(matchingTokenEvent) {
      deposit.tokenEvent = matchingTokenEvent;
    } else {
      console.log("************** FAILED TO FIND MATCHING TOKEN TX FOR DEPOSIT *************************");
    }
  })

  let withdraws = await jar.contract.getPastEvents("Transfer", {
    filter: {
      from: myAddress,
      to: "0x0000000000000000000000000000000000000000",
      // to: jar.address,
    },
    fromBlock: 0,
    toBlock: "latest"
  });

  addMetadata(withdraws);

  if(withdraws.length)
    if(verbose)
      console.log("Found ",withdraws.length," withdraw transactions for jar ",jar.baseTokenName," at ",jar.address);

  let tokenWithdraws = await jar.baseTokenContract.getPastEvents("Transfer", {
    filter: {
      from: jar.address,
      to: myAddress,
    },
    fromBlock: 0,
    toBlock: "latest"
  })

  addOrdering(tokenWithdraws);

  if(tokenWithdraws.length)
    if(verbose)
      console.log("Found ",tokenWithdraws.length, " token withdraw transactions for ",jar.baseTokenName);

  withdraws.map(withdraw => {
    let matchingTokenEvent = tokenWithdraws.find(tD => tD.ordering === withdraw.ordering)
    if(matchingTokenEvent) {
      withdraw.tokenEvent = matchingTokenEvent;
    } else {
      console.log("************** FAILED TO FIND MATCHING TOKEN TX FOR withdraw *************************");
    }
  })

  if(verbose)
    console.log("Submitting ",deposits.length," deposits and ",withdraws.length," withdraws for jar ",jar.baseTokenName);

  return {
    deposits,
    withdraws
  }
}

//################################## Token Price (Uniswap) functions

let PickleETHPair, ETHUSDTPair, DaiETHPair;

async function getPickleETHPair() {
  if(!PickleETHPair)
    PickleETHPair = await loadUniSwapPair("0xdc98556ce24f007a5ef6dc1ce96322d65832a819");

  return PickleETHPair;
}

async function getDaiETHPair() {
  if(!DaiETHPair)
    DaiETHPair = await loadUniSwapPair("0xa478c2975ab1ea89e8196811f51a7b7ade33eb11");

  return DaiETHPair;
}


async function getETHUSDTPair() {
  if(!ETHUSDTPair)
    ETHUSDTPair = await loadUniSwapPair("0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852");

  return ETHUSDTPair;
}

async function loadUniSwapPair(contractAddress) {
  let pair = {
    contract: new window.web3.eth.Contract(uniswapABI, contractAddress)
  };

  pair.token0 = new window.web3.eth.Contract(ERC20ABI, await pair.contract.methods.token0().call());
  pair.token1 = new window.web3.eth.Contract(ERC20ABI, await pair.contract.methods.token1().call());
  pair.token0Name = await pair.token0.methods.name().call();
  pair.token1Name = await pair.token1.methods.name().call();
  pair.token0Decimals = await pair.token0.methods.decimals().call();
  pair.token1Decimals = await pair.token1.methods.decimals().call();

  let reserves = await pair.contract.methods.getReserves().call();
  pair.token0Reserves = parseFloat(reserves[0]);
  pair.token1Reserves = parseFloat(reserves[1]);
  pair.swap0to1 = async function(tokenZeroes) {
    return (this.token1Reserves*tokenZeroes)/(this.token0Reserves+tokenZeroes);
  }
  pair.swap1to0 = async function(tokenOnes) {
    return (this.token0Reserves*tokenOnes)/(this.token1Reserves+tokenOnes);
  }

  return pair;
}

//################################## Display Functions

function getPickleFarmStr(pickleFarm) {
  if(!pickleFarm.pools.length)
    return "No farms found";
  return pickleFarm.pools.map(pool => {
    if(!pool.positions.length)
      return null;

    let jarStr = "";

    if(pool.type === "pickleJar" && pool.jar && pool.jar.shares) {
      jarStr += `\n\nCurrently in <a href="${etherScanLinkAddress(pool.poolInfo.lpToken)}" target="_blank">Pickle Jar ${pool.tokenName}</a> (${(pool.jar.shares/(10**18)).toFixed(2)}) shares`;
      jarStr += `\nDeposit Worth ${(pool.jar.coins/(10**pool.jar.baseTokenDecimals)).toFixed(2)} ${pool.jar.baseTokenName}`;
    }

    if(pool.jar && pool.jar.positions.length) {
      jarStr += "\n\n" + pool.jar.positions.map(position => {
        let positionStr = "\t\tJar Position:";
        positionStr  += `\n\t<a href="${etherScanLinkTx(position.depositEvents[0].transactionHash)}" target="_blank">Opened</a> on ${position.opened.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}${position.closed ? `, <a href="${etherScanLinkTx(position.withdrawEvent.transactionHash)}" target="_blank">Closed</a> on ${position.closed.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}` : ""}`;

        positionStr += `\n\tShares: ${(position.amount/(10**pool.decimals)).toFixed(2)} ${pool.tokenName}`;
        positionStr += `\n\tShare worth when opened: ${(position.openingTokens/(10**pool.jar.baseTokenDecimals)).toFixed(5)} ${pool.jar.baseTokenName}`;
        positionStr += `\n\t${position.open ? "Current" : "Closing"} share worth: ${(position.closingTokens/(10**pool.jar.baseTokenDecimals)).toFixed(5)} ${pool.jar.baseTokenName}`;
        positionStr += `\n\tDays in Position: ${(((position.open ? new Date() : new Date(position.closed))-new Date(position.opened))/(1000*60*60*24)).toFixed(2)}`;
        positionStr += `\n\tAPY: ${(position.yieldRate*100.0).toFixed(2)}%`;
        // positionStr += `\n\tTotal Reward: ${(position.rewardPickles/(10**pickleFarm.pickleDecimals)).toFixed(4)} Pickles`;
        return positionStr;
      }).join("\n\n");
    }

    let farmName = "";
    if(pool.type==="pickleJar" && pool.jar.jarType === "uniswap")
      farmName = `Farm for ${pool.jar.token0Name}/${pool.jar.token1Name} Pickle Jar`;
    else if(pool.type === "uniswap")
      farmName = `Farm for ${pool.token0Name}/${pool.token1Name} pair`;
    else
      farmName = `${pool.tokenName} Farm`;

    return `\t\t${farmName}: \n\n`+pool.positions.map(position => {
      let positionStr = `<a href="${etherScanLinkTx(position.depositEvent.transactionHash)}" target="_blank">Opened</a> on ${position.opened.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}${position.closed ? `, <a href="${etherScanLinkTx(position.withdrawEvent.transactionHash)}" target="_blank">Closed</a> on ${position.closed.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}` : ""}`;

      positionStr += `\nAmount: ${(position.amount/(10**pool.decimals)).toFixed(10)} ${pool.tokenName}`;
      positionStr += `\nTotal Reward: ${(position.rewardPickles/(10**pickleFarm.pickleDecimals)).toFixed(4)} Pickles ($${(position.rewardUSDT/(10**6)).toFixed(2)})`;
      if(position.pendingPickles)
        positionStr += `\nPending Reward (of total): ${(position.pendingPickles/(10**pickleFarm.pickleDecimals)).toFixed(4)} Pickles ($${(position.pendingUSDT/(10**6)).toFixed(2)})`;
      return positionStr;
    }).join("\n\n")+jarStr;
  }).filter(str => str !== null).join("\n\n");
}

function appendToResults(data, success) {
  document.getElementById("results").innerHTML = data+`\n<hr class="border border-${success ? "success": "danger"}"/>\n`+document.getElementById("results").innerHTML;
}