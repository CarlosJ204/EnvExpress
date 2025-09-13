// ======== Blockchain (para navegador con localStorage) ========
class Block {
  constructor(index, data, previousHash = "") {
    this.index = index;
    this.date = new Date();
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.createHash();
  }
  createHash() {
    const payload = `${this.index}|${this.date}|${
      this.previousHash
    }|${JSON.stringify(this.data)}`;
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
    this.saveToStorage();
    return block;
  }
  saveToStorage() {
    localStorage.setItem("blockchain", JSON.stringify(this.chain));
  }
  loadFromStorage() {
    const stored = localStorage.getItem("blockchain");
    if (stored) {
      const parsed = JSON.parse(stored);
      this.chain = parsed.map((b) => {
        const block = new Block(b.index, b.data, b.previousHash);
        block.date = b.date; 
        block.hash = b.hash; 
        return block;
      });
    }
  }
}

// 🔹 Inicializar blockchain (única para todas las páginas)
const naniCoin = new BlockChain({ mensaje: "génesis" });
naniCoin.loadFromStorage();

// ----------------- Registro de envío -----------------
const formRegistro = document.getElementById("form-registro");
if (formRegistro) {
  console.log("entro en el if de registro");
  formRegistro.addEventListener("submit", (e) => {
    e.preventDefault();

    const envio = {
      destinatario: document.getElementById("destinatario").value.trim(),
      origen: document.getElementById("origen").value.trim(),
      destino: document.getElementById("destino").value.trim(),
      valor: Number(document.getElementById("valor").value),
      descripcion: document.getElementById("descripcion").value.trim(),
      dimension: document.getElementById("dimension").value.trim(),
      peso: Number(document.getElementById("peso").value),
    };

    const historial = new BlockChain({
      estado: "En ciudad de origen",
      ciudadActual: envio.origen,
    });

    const nuevo = naniCoin.addBlock({ envio, historial: historial.chain });

    console.log("Nuevo envío registrado:", nuevo);
    console.log("Cadena completa:", JSON.stringify(naniCoin.chain, null, 2));
    alert(`✅ Envío registrado. Hash: ${nuevo.hash.slice(0, 16)}...`);

    formRegistro.reset();
  });
}
//------------------ Mostrar las Actualizaciones en el Modal -----------------
document.addEventListener("DOMContentLoaded", () => {
  const modalForm = document.getElementById("modal-form");
  const form = document.getElementById("form-tracking");
  const guideCode = document.getElementById("guide-code");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const hash = guideCode.value.trim();
    const block = naniCoin.chain.find((b) => b.hash === hash);
    if(!block){
      alert("❌ No se encontró un envío con ese codigo de guia.");
      return;
        }
    });

    const data = block.data || {};
    modalForm.document.getElementById("modal-guide-code").value = block.hash;
    modalForm.document.getElementById("modal-state").value = data.envio ? data.envio.estado : "N/A";
    modalForm.document.getElementById("modal-current-city").value = data.envio ? data.envio.ciudadActual : "N/A";

    modal.show();


});
// ----------------- Actualización de estado -----------------
const formActualizar = document.getElementById("form-update");
if (formActualizar) {
  formActualizar.addEventListener("submit", (e) => {
    e.preventDefault();

    const hashBase = document.getElementById("hashBase").value.trim();
    const ciudadActual = document.getElementById("ciudad-actual").value.trim();
    const estado = document.getElementById("estado").value.trim();

    // Buscar el bloque original por hash
    const bloqueBase = naniCoin.chain.find((b) => b.hash === hashBase);
    if (!bloqueBase) {
      alert("❌ No se encontró un envío con ese hash.");
      return;
    }

    const historial = new BlockChain({
      estado: "Genesis",
      ciudadActual: "Inicio",
    });
    
    historial.chain = bloqueBase.data.historial.map(
      (b) => new Block(b.index, b.data, b.previousHash)
    );
    historial.addBlock({ estado, ciudadActual });

    bloqueBase.data.historial = historial.chain;
    naniCoin.saveToStorage();


    console.log("Estado actualizado:", nuevo);
    console.log("Cadena completa:", JSON.stringify(naniCoin.chain, null, 2));

    alert(`✅ Estado actualizado. Nuevo hash: ${nuevo.hash.slice(0, 16)}...`);
    formActualizar.reset();

  });
}

// ----------------- Verificación de envío -----------------
const formVerificar = document.getElementById("form-verification");
if (formVerificar) {
  formVerificar.addEventListener("submit", (e) => {
    e.preventDefault();

    const hashBase = document.getElementById("hashBase").value.trim();
    const estadoPaquete = document.getElementById("package-state").value.trim();

    // Buscar el bloque original por hash
    const bloqueBase = naniCoin.chain.find((b) => b.hash === hashBase);
    if (!bloqueBase) {
      alert("❌ No se encontró un envío con ese hash.");
      return;
    }

    const historial = new BlockChain({
      estado: "Genesis",
      ciudadActual: "Inicio",
    });

    historial.chain = bloqueBase.data.historial.map((b) => {
      const block = new Block(b.index, b.data, b.previousHash);
      block.date = b.date;
      block.hash = b.hash;
      return block;
    });


    const valorPago = bloqueBase.data.envio.valor;

    const nuevoHistorial = historial.addBlock({
      estado:"Recibido",
      estadoPaquete,
      valorPago,
      verificadoEn: new Date().toISOString(),
    });

    bloqueBase.data.historial = historial.chain;
    naniCoin.saveToStorage();

    console.log("Nueva verificación añadida:", nuevoHistorial);
    console.log("Cadena completa:", JSON.stringify(naniCoin.chain, null, 2));

    alert(`✅ Verificación añadida. Nuevo hash: ${nuevoHistorial.hash.slice(0, 16)}...`);
    formVerificar.reset();
  });
}
