const sha256 = require('sha256')

class Blockchain {
  constructor () {
    this.chain = []
    this.pendingTransactions = []
    this.createNewBlock(1993, 'pepe', 'thefrog')
  }

  createNewBlock (nonce, previousBlockHash, hash) {
    const newBlock = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: this.pendingTransactions,
      nonce: nonce,
      hash: hash
    }

    this.pendingTransactions = []
    this.chain.push(newBlock)

    return newBlock
  }

  getLastBlock () {
    return this.chain[this.chain.length - 1]
  }

  createNewTransaction (amount, sender, recipient) {
    const newTransaction = {
      amount: amount,
      sender: sender,
      recipient: recipient
    }

    this.pendingTransactions.push(newTransaction)

    return this.getLastBlock()['index'] + 1
  }

  hashBlock (previousBlockHash, currentBlockData, nonce) {
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData)
    return sha256(dataAsString)
  }

  proofOfWork (previousBlockHash, currentBlockData) {
    let nonce = 0
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)

    while (hash.substring(0, 4) !== '0000') {
      nonce++
      hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)
      console.log(hash)
    }

    return nonce
  }
}

module.exports = Blockchain
