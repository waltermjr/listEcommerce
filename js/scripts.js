var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "https://raw.githubusercontent.com/netshoes/front-end-recruitment/master/public/data/products.json", true);
    xhr.responseType = 'json';
    xhr.onreadystatechange = function() {
      var status = xhr.status;
      if (status === 200) { 
        if(xhr.response != null){
            xhr.response.products.forEach(element => {
                createProducts(element);
            });

            verifyCart();
        }
      } else {
        console.log(xhr.response);
      }
    };
    xhr.send();
};

var createProducts = function(product){
    var value = String(product.price.toFixed(2)).split('.');
    var container = document.createElement('li');
    container.setAttribute('id', product.id);
    container.dataset.id = product.id;
    container.dataset.currencyFormat = product.currencyFormat;
    container.dataset.title = product.title;
    container.dataset.price = product.price;
    container.dataset.style = product.style;
    container.dataset.img = "img/products/product" + product.id + ".jpg";
    container.dataset.conctPrice = product.currencyFormat + " " + product.price.toLocaleString('pt-BR', {maximumFractionDigits: 2, minimumFractionDigits: 2});

    var foto = document.createElement('div');
    foto.className = "foto";

    var titulo = document.createElement('div');
    titulo.className = "titulo";
    titulo.innerText = product.title;

    var preco = document.createElement('div');
    preco.className = "preco";
    preco.innerHTML = "<span>" + product.currencyFormat + "</span>" + value[0] + "<span>," + value[1] + "</span>";

    var img = document.createElement('img');
    img.setAttribute('src',"img/products/product" + product.id + ".jpg");

    var button = document.createElement('button');
    button.className = "comprarProd";
    button.innerText = "COMPRAR";
    button.addEventListener('click', function(){
        createListBag(container.dataset.id);
        var arr = [];
        try {
            if(JSON.parse(localStorage.getItem("products")).length > 0){
                var arr =  JSON.parse(localStorage.getItem("products"));
            }
        } catch (e) {
            localStorage.setItem("products", JSON.stringify(arr));
        }

        arr.push(container.dataset.id);
        localStorage.setItem("products", JSON.stringify(arr));
        document.getElementById("cart").classList = "cart open";
    });

    var parcela = document.createElement('div');
    parcela.className = "parcela";
    parcela.innerText = calcParcela(product.price,product.currencyFormat);

    foto.appendChild(img);
    foto.appendChild(button);

    container.appendChild(foto);
    container.appendChild(titulo);
    container.appendChild(preco);
    container.appendChild(parcela);

    document.getElementById("vitrine").appendChild(container);
};

var calcParcela = function(val,currencyFormat){
    var finalValue = val / 3;
    return "ou 3x " + currencyFormat + " " + finalValue.toLocaleString('pt-BR', {maximumFractionDigits: 2, minimumFractionDigits: 2})
}

var createListBag = function(productID){
    var product = document.getElementById(productID);
    
    var container = document.createElement('li');
    container.className = "item";

    var contItem = document.createElement('div');
    contItem.className = "contItem";

    var fotoItem = document.createElement('div');
    fotoItem.className = "fotoItem";

    var contInfo = document.createElement('div');
    contInfo.className = "contInfo";

    var name = document.createElement('div');
    name.className = "name";
    name.innerText = product.dataset.title;

    var size = document.createElement('div');
    size.className = "size";
    size.innerText = product.dataset.style;

    var quant = document.createElement('div');
    quant.className = "quant";
    quant.innerText = "Quantidade: 1";

    var price = document.createElement('div');
    price.className = "price";
    price.innerText = product.dataset.conctPrice;

    var delItem = document.createElement('div');
    delItem.addEventListener("click", function(){
        container.remove();
        subTotalVal(product.dataset.price,product.dataset.currencyFormat);
        var arr =  JSON.parse(localStorage.getItem("products"));
        var newArr = arr.filter(function(val){
            return parseInt(val) != product.dataset.id
        });
        localStorage.setItem("products", JSON.stringify(newArr));
    });
    delItem.className = "delItem";

    var img = document.createElement('img');
    img.setAttribute('src',product.dataset.img);

    fotoItem.appendChild(img);

    contInfo.appendChild(name);
    contInfo.appendChild(size);
    contInfo.appendChild(quant);

    contItem.appendChild(fotoItem);
    contItem.appendChild(contInfo);
    contItem.appendChild(price);
    contItem.appendChild(delItem);

    container.appendChild(contItem);

    document.getElementById("listCart").prepend(container);
    calcTotalPrice(product.dataset.price,product.dataset.currencyFormat);
}

var subTotalVal = function(price,currencyFormat){
    var newVal = parseFloat(document.getElementById("totalValue").dataset.val) - parseFloat(price);
    var valDiv = newVal / 10;
    document.getElementById("totalValue").dataset.val = newVal;
    document.getElementById("totalValue").innerText = "R$ " + newVal.toLocaleString('pt-BR', {maximumFractionDigits: 2, minimumFractionDigits: 2});
    document.getElementById("parcTotal").innerText = "ou em até 10x " + currencyFormat + " " + String(valDiv.toFixed(2)).replace(".",",");
    subItem();
}

var calcTotalPrice = function(val,currencyFormat){
    var valNow = parseFloat(document.getElementById("totalValue").dataset.val) + parseFloat(val);
    var valDiv = valNow / 10;
    document.getElementById("totalValue").innerText = "R$ " + valNow.toLocaleString('pt-BR', {maximumFractionDigits: 2, minimumFractionDigits: 2});
    document.getElementById("totalValue").dataset.val = valNow;
    document.getElementById("parcTotal").innerText = "ou em até 10x " + currencyFormat + " " + String(valDiv.toFixed(2)).replace(".",",");
    addItem();
}

var addItem = function(){
    document.getElementById("bagItems").innerText = parseInt(document.getElementById("bagItems").innerText) + 1;
    document.getElementById("checkOut").removeAttribute("disabled");
}

var subItem = function(){
    var val = parseInt(document.getElementById("bagItems").innerText) - 1;
    document.getElementById("bagItems").innerText = val;
    if(val == 0){
        document.getElementById("checkOut").setAttribute("disabled","true");
    }
}

var verifyCart = function(){
    var arr = [];
    try {
        if(JSON.parse(localStorage.getItem("products")).length > 0){
            var arr =  JSON.parse(localStorage.getItem("products"));
            arr.forEach(element => {
                createListBag(element);
            });
            document.getElementById("checkOut").removeAttribute("disabled");
            document.getElementById("cart").classList = "cart open";
        }
    } catch (e) {
        localStorage.setItem("products", JSON.stringify(arr));
    }
}

document.getElementById("btCart").addEventListener("click", function(){
    this.parentElement.classList.toggle("open");
})

document.getElementById("checkOut").addEventListener("click", function(){
    alert("Compra realizada com sucesso");
    var arr = [];
    localStorage.setItem("products", JSON.stringify(arr));
    document.location.reload();
})

getJSON();