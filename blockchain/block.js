// ======== Blockchain (para navegador) ========
class Block {
  constructor(index, data, previousHash = "") {
    this.index = index;
    this.date = new Date().toISOString(); // ISO para hashing determinista
    this.data = data;                      // objeto con campos del form
    this.previousHash = previousHash;
    this.hash = this.createHash();
  }
  createHash() {
    // Usar JSON.stringify para no perder estructura del objeto
    const payload = `${this.index}|${this.date}|${this.previousHash}|${JSON.stringify(this.data)}`;
    return CryptoJS.SHA256(payload).toString();
  }
}

class BlockChain {
  constructor(genesisData) {
    this.chain = [this.createFirstBlock(genesisData)];
  }
  createFirstBlock(genesisData) {
    return new Block(0, genesisData, "0");
  }
  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }
  addBlock(data) {
    const prev = this.getLastBlock();
    const block = new Block(prev.index + 1, data, prev.hash);
    this.chain.push(block);
    return block;
  }
}

// ======== Instancia global (demo) ========
const naniCoin = new BlockChain({ mensaje: "Info del génesis" });

// ======== Captura del formulario ========
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-registro");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const envio = {
      destinatario: document.getElementById("destinatario").value.trim(),
      destino: document.getElementById("destino").value.trim(),
      valor: Number(document.getElementById("valor").value),
      descripcion: document.getElementById("descripcion").value.trim(),
      dimension: document.getElementById("dimension").value.trim(),
      peso: Number(document.getElementById("peso").value),
    };

    const nuevo = naniCoin.addBlock(envio);

    console.log("Bloque añadido:", nuevo);
    console.log("Cadena completa:", JSON.stringify(naniCoin.chain, null, 2));
    alert(`Envío registrado. Hash: ${nuevo.hash.slice(0,16)}...`);

    form.reset();
  });
});
