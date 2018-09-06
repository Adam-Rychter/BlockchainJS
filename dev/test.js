const Blockchain = require('./blockchain.js')
const bitcoin = new Blockchain()

// bitcoin.createNewBlock(2389, '0INA90SDNF90N', '90ANSD9FON9009N')

// bitcoin.createNewTransaction(100, 'ALEXIDSUYF897S', 'JENS8D7FY98ASD')

// bitcoin.createNewBlock(3490, '90ANSD9FON9009N', '75HU9FON9009N')

// bitcoin.createNewTransaction(1000, 'ALEXIDSUYF897S', 'JENS8D7FY98ASD')
// bitcoin.createNewTransaction(500, 'ALEXIDSUYF897S', 'JENS8D7FY98ASD')
// bitcoin.createNewTransaction(340, 'ALEXIDSUYF897S', 'JENS8D7FY98ASD')

// bitcoin.createNewBlock(1267, '75HU9FON9009N', 'F73JID9FON9009N')

const previousBlockHash = 'JSDHF87SDYFSD7FY89SD'
const currentBlockData = [
  {
    amount: 10,
    sender: 'DS78TF8S8D7FA',
    recipient: 'SDIUFGHY8I87SDFY'
  },
  {
    amount: 30,
    sender: 'SDIUFY8978SDS',
    recipient: '8S7DYTFS8D7FYDYJ'
  },
  {
    amount: 300,
    sender: 'S78DYF8S8D79FYD',
    recipient: '8DS8F9YGS87DYS8D7F'
  }
]

const nonce = 100

console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce))

console.log(bitcoin.chain[2])
