const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index,data,previousHash =""){
        this.index = index;
        this.date = new Date();
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.createHash();
    }
    createHash(){
        return SHA256(this.index+this.date+this.previousHash+this.data+this.previousHash).toString();
    }
}

class BlockChain{
    constructor(genesis){
        this.chain = [this.createFirstBlock(genesis)];
    }

    createFirstBlock(genesis){
        return new Block(0,genesis);
    }

    getLastBlock(){
        return this.chain[this.chain.length -1];
    }

    addBlock(data){
        let previousBlock = this.getLastBlock();
        let block = new Block(previousBlock.index +1,data,previousBlock.hash);
        this.chain.push(block);
    }
}

let naniCoin = new BlockChain('Info del genesis')
naniCoin.addBlock('Este es el primero')
naniCoin.addBlock('Otro bloque')
console.log(JSON.stringify(naniCoin.chain,null,2))