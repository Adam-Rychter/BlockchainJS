const Blockchain = require('./blockchain.js')

const bitcoin = new Blockchain()

bitcoin.createNewBlock(2389, '0INA90SDNF90N', '90ANSD9FON9009N')

bitcoin.createNewTransaction(100, 'ALEXIDSUYF897S', 'JENS8D7FY98ASD')

bitcoin.createNewBlock(3490, '90ANSD9FON9009N', '75HU9FON9009N')

bitcoin.createNewTransaction(1000, 'ALEXIDSUYF897S', 'JENS8D7FY98ASD')
bitcoin.createNewTransaction(500, 'ALEXIDSUYF897S', 'JENS8D7FY98ASD')
bitcoin.createNewTransaction(340, 'ALEXIDSUYF897S', 'JENS8D7FY98ASD')

bitcoin.createNewBlock(1267, '75HU9FON9009N', 'F73JID9FON9009N')

// console.log(bitcoin.chain[1])
// console.log(bitcoin)
console.log(bitcoin.chain[2])
