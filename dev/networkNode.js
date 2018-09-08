const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Blockchain = require('./blockchain')
const uuid = require('uuid/v1')
const port = process.argv[2]
const rp = require('request-promise')

const nodeAddress = uuid().split('-').join('')

const coin = new Blockchain()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/blockchain', function (req, res) {
  res.send(coin)
})

app.post('/transaction/broadcast', function(req, res){
  const newTransaction = coin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient)
  coin.addTransactionToPendingTransactions(newTransaction)

  const requestPromises = []
  coin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/transaction',
      method: 'POST',
      body: newTransaction,
      json: true
    }

    requestPromises.push(rp(requestOptions))

  })

  Promise.all(requestPromises).then(data => {
    res.json({note: 'Transaction created and broadcasted successfully.'})
  })
})

app.post('/transaction', function (req, res) {
  const newTransaction = req.body
  const blockIndex = coin.addTransactionToPendingTransactions(newTransaction)

  res.json({ note: `Transaction will be added in block ${blockIndex}.` })
})

// register an node and broadcast the node to the whole network
app.post('/register-and-broadcast-node', function (req, res) {
  const newNodeUrl = req.body.newNodeUrl

  // register new node with this node
  if (coin.networkNodes.indexOf(newNodeUrl) === -1) {
    coin.networkNodes.push(newNodeUrl)
  }

  const regNodesPromises = []
  // creating an array of requests to register-node endpoint to register new node with all other nodes in network
  coin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/register-node',
      method: 'POST',
      body: { newNodeUrl: newNodeUrl },
      json: true
    }
    // pushing our new request to request array
    regNodesPromises.push(rp(requestOptions))
  })

  // executing all our requests in array
  Promise.all(regNodesPromises).then(data => {
    const bulkRegisterOptions = {
      uri: newNodeUrl + '/register-nodes-bulk',
      method: 'POST',
      body: { allNetworkNodes: [...coin.networkNodes, coin.currentNodeUrl] },
      json: true
    }

    return rp(bulkRegisterOptions)
  })
    .then(data => {
      res.json({ node: 'New node registered with netrwork successfully.' })
    })
})

// accepts the newnode to be registered and does NOT broadcast it again!
app.post('/register-node', function (req, res) {
  const newNodeUrl = req.body.newNodeUrl
  const nodeNotAlredyPresent = (coin.networkNodes.indexOf(newNodeUrl) === -1)
  const notCurrentNode = coin.currentNodeUrl !== newNodeUrl

  if (nodeNotAlredyPresent && notCurrentNode) {
    coin.networkNodes.push(newNodeUrl)
  }
  res.json({ note: 'New node registered successfully.' })
})

// register multiple nodes at once
app.post('/register-nodes-bulk', function (req, res) {
  const allNetworkNodes = req.body.allNetworkNodes

  allNetworkNodes.forEach(networkNodeUrl => {
    const nodeNotAlredyPresent = (coin.networkNodes.indexOf(networkNodeUrl) === -1)
    const notCurrentNode = coin.currentNodeUrl !== networkNodeUrl
    if (nodeNotAlredyPresent && notCurrentNode) {
      coin.networkNodes.push(networkNodeUrl)
    }
  })

  res.json({ note: 'Bilkl registration successful.' })
})

app.get('/mine', function (req, res) {
  const lastBlock = coin.getLastBlock()
  const previousBlockHash = lastBlock['hash']

  const currentBlockData = {
    transaction: coin.pendingTransactions,
    index: lastBlock['index'] + 1
  }

  const nonce = coin.proofOfWork(previousBlockHash, currentBlockData)
  const blockHash = coin.hashBlock(previousBlockHash, currentBlockData, nonce)

  // coin.createNewTransaction(12.5, '00', nodeAddress)

  const newBlock = coin.createNewBlock(nonce, previousBlockHash, blockHash)

  const requestPromises = []
  coin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/receive-new-block',
      method: 'POST',
      body: {newBlock: newBlock},
      json: true
    }

    requestPromises.push(rp(requestOptions))    
  })

  Promise.all(requestPromises).then(data => {
    const requestOptions = {
      uri: coin.currentNodeUrl + '/transaction/broadcast',
      method: 'POST',
      body: {
        amount: 12.5,
        sender: "00",
        recipient: nodeAddress
      },
      json: true
    }
    return rp(requestOptions)
  }).then(data => {
    res.json({
      note: 'New block mined and broadcasted successfully',
      recipientAddr: nodeAddress,
      block: newBlock
    })
  })  
})

app.post('/receive-new-block', function(req, res){
  const newBlock = req.body.newBlock
  const lastBlock = coin.getLastBlock()
  const correctHash = (lastBlock.hash === newBlock.previousBlockHash)
  const correctIndex = ((lastBlock['index'] + 1) === (newBlock['index']))

  if (correctHash && correctIndex){
    coin.chain.push(newBlock)
    coin.pendingTransactions = []
    res.json({
      note: 'New block received and accepted.'
    })
  }else{
    res.json({
      note: 'New block rejected.'
    })
  }
})

app.listen(port, function () {
  console.log(`Listening on port ${port}...`)
})
