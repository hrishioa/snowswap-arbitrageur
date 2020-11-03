let pickleFarm;
let cachedPickleContract = null;
let defaultFarmAddress = "0xbd17b1ce622d73bd438b9e658aca5996dc394b0d";

let ERC20ABI = JSON.parse('[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]');

//################################ Loading functions

if(window.ethereum) {
  console.log("Enabling...");
  window.web3 = new Web3(window.ethereum);
  window.ethereum.enable().then(async () => {
    console.log("Enabled.");
    loaded = true;
    // pickleFarm = await initializePickleFarm("0xbd17b1ce622d73bd438b9e658aca5996dc394b0d", "0xe86ce08c49f7b9de5ac287bcf2d5066ab49028aa") // 3Crv
    // pickleFarm = await initializePickleFarm("0xbd17b1ce622d73bd438b9e658aca5996dc394b0d", "0xfa53a46c2F9131C37Eb41C1c3a8af95418199A9F") // renBTC
    // pickleFarm = await initializePickleFarm("0xbd17b1ce622d73bd438b9e658aca5996dc394b0d", "0x420E7b56927EDfd45B126a0373C4b66ce96F68C6") // Staking & pDAI
    // appendToResults(getPickleFarmStr(pickleFarm));
    // console.log("Pickle farm loaded.");
  })
} else {
  appendToResults("No metamask detected.", false);
}

function getPositions() {
  if(!loaded)
    return appendToResults("Please wait for the page to finish loading. KTHXBAI", false)

  let address = $('#myAddress').val();

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
    farmContract = await loadEtherscanContract(farmAddress);
    cachedPickleContract = farmContract;
  } else {
    farmContract = cachedPickleContract;
  }

  let poolCount = parseInt(await farmContract.methods.poolLength().call());

  let pickleContract = new window.web3.eth.Contract(ERC20ABI, await farmContract.methods.pickle().call());

  let pickleDecimals = parseInt(await pickleContract.methods.decimals().call());

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
      pendingPickles: parseInt(await farmContract.methods.pendingPickle(index, myAddress).call())
    }

    ret.tokenContract = new window.web3.eth.Contract(ERC20ABI, ret.poolInfo.lpToken);

    let pickleJar = await loadPickleJar(ret.poolInfo.lpToken, ret.userInfo.amount);

    if(pickleJar) {
      ret.type = "pickleJar";
      ret.jar = pickleJar;
    }

    ret.tokenName = await ret.tokenContract.methods.name().call();

    ret.decimals = parseInt(await ret.tokenContract.methods.decimals().call());

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

    let withdrawAmount = parseInt(withdraw.returnValues.amount);

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
      let depositAmount = parseInt(deposit.returnValues.amount);

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
        deposit.returnValues.amount = parseInt(deposit.returnValues.amount) - withdrawAmount;
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


  let remainingDeposits = deposits.filter(deposit => parseInt(deposit.returnValues.amount) > 0).sort((a,b) => a.ordering-b.ordering);

  let remainingDepositAmount = remainingDeposits.reduce((acc, cur) => acc+cur.returnValues.amount, 0);
  if(remainingDepositAmount)
    if(verbose)
      console.log("Unreconciled deposits - ",remainingDepositAmount/(10**decimals));

  for(let j=0;j<remainingDeposits.length;j++) {
    let deposit = remainingDeposits[j];
    let depositAmount = parseInt(deposit.returnValues.amount);

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

function calculateRewards(positions, withdraws, pendingPickles, pickleWithdraws) {
  if(pendingPickles)
    assignRewardToPosition(pendingPickles, new Date(), positions, true);

  for(let i=0;i<withdraws.length;i++) {
    let withdraw = withdraws[i];

    console.log(" ===== Considering account withdraw ",i, " of ",parseInt(withdraw.returnValues.amount));

    let matchingPickleWithdraws = pickleWithdraws.filter(pWithdraw => pWithdraw.ordering === withdraw.ordering && !pWithdraw.used);
    matchingPickleWithdraws.map(pWithdraw => pWithdraw.used = true);

    console.log("Found ",matchingPickleWithdraws.length," matching pickle withdraws");

    matchingPickleWithdraws.map(pWithdraw => {
      console.log(" =========== Considering pickle withdraw of size ",parseInt(pWithdraw.returnValues.value)/(10**18))
      assignRewardToPosition(parseInt(pWithdraw.returnValues.value), pWithdraw.timestamp, positions, false)
    });
  }
}

function assignRewardToPosition(rewardAmount, rewardTimestamp, positions, pending) {
  let eligiblePositions = positions.filter(position => position.open || position.closed >= rewardTimestamp);
  let totalTimeAmount = eligiblePositions.reduce((acc, cur) => acc+cur.timeAmount, 0);

  console.log(" ====== Found ",eligiblePositions.length," eligible positions for reward at ",rewardTimestamp, " for amount ",rewardAmount, " total timeAmount is ",totalTimeAmount);

  eligiblePositions.map(position => {
    if(isNaN(parseInt(position.rewardPickles)))
      position.rewardPickles = 0;
    if(isNaN(parseInt(position.pendingPickles)))
      position.pendingPickles = 0;

    position.rewardPickles += rewardAmount*(position.timeAmount/totalTimeAmount);
    if(pending)
      position.pendingPickles += rewardAmount*(position.timeAmount/totalTimeAmount);
    console.log(" ====== Distributed ",rewardAmount*(position.timeAmount/totalTimeAmount)/(10**18)," to position ",position);
  })
}

//################################## PickleJar Functions

let pickleJarABI = JSON.parse(`[{"inputs":[{"internalType":"address","name":"_token","type":"address"},{"internalType":"address","name":"_governance","type":"address"},{"internalType":"address","name":"_controller","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"available","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"balance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"controller","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"depositAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"earn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getRatio","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"governance","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"reserve","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"harvest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"max","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"min","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_controller","type":"address"}],"name":"setController","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_governance","type":"address"}],"name":"setGovernance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_min","type":"uint256"}],"name":"setMin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_shares","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawAll","outputs":[],"stateMutability":"nonpayable","type":"function"}]`);

async function loadPickleJar(farmAddress, shares) {
  let pickleJar = {
    address: window.web3.utils.toChecksumAddress(farmAddress)
  };

  pickleJar.contract = new window.web3.eth.Contract(pickleJarABI, pickleJar.address);

  // First test if it is a farm
  try {
    pickleJar.ratio = parseInt(await pickleJar.contract.methods.getRatio().call());
  } catch(err) {
    console.log(farmAddress," is not a pickle address it looks like");
    // console.log(err);
    return null;
  }

  pickleJar.balance = parseInt(await pickleJar.contract.methods.balance().call());
  if(shares) {
    pickleJar.coins = ((pickleJar.ratio/(10**18))*parseFloat(shares));
    pickleJar.shares = parseInt(shares);
  }

  pickleJar.baseToken = new window.web3.eth.Contract(ERC20ABI, await pickleJar.contract.methods.token().call());
  pickleJar.baseTokenDecimals = parseInt(await pickleJar.baseToken.methods.decimals().call());
  pickleJar.baseTokenName = await pickleJar.baseToken.methods.name().call();

  return pickleJar;
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
      jarStr += `\n\nCurrently in Pickle Jar ${pool.tokenName} (${(pool.jar.shares/(10**18)).toFixed(2)}) shares`;
      jarStr += `\nDeposit Worth ${(pool.jar.coins/(10**pool.jar.baseTokenDecimals)).toFixed(2)} ${pool.jar.baseTokenName}`;
    }

    return `Farm ${pool.tokenName}: \n\n`+pool.positions.map(position => {
      let positionStr = `<a href="${etherScanLinkTx(position.depositEvent.transactionHash)}">Opened</a> on ${position.opened.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}${position.closed ? `, <a href="${etherScanLinkTx(position.withdrawEvent.transactionHash)}">Closed</a> on ${position.closed.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}` : ""}`;

      positionStr += `\nAmount: ${(position.amount/(10**pool.decimals)).toFixed(10)} ${pool.tokenName}`;
      positionStr += `\nTotal Reward: ${(position.rewardPickles/(10**pickleFarm.pickleDecimals)).toFixed(4)} Pickles`;
      if(position.pendingPickles)
        positionStr += `\nPending Reward (of total): ${(position.pendingPickles/(10**pickleFarm.pickleDecimals)).toFixed(4)} Pickles`;
      return positionStr;
    }).join("\n\n")+jarStr;
  }).filter(str => str !== null).join("\n\n");
}

function appendToResults(data, success) {
  document.getElementById("results").innerHTML = data+`\n<hr class="border border-${success ? "success": "danger"}"/>\n`+document.getElementById("results").innerHTML;
}