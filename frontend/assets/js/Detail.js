function AddToCart() {
    document.getElementById("addToCart").value = "Added to your cart";
}

function AddToWishlist() {
    document.getElementById("addToWishlist").value = "Added to your wishlist";
}

function GoToPayment() {
    window.location.href = "../html/PaymentPage.html";
}

const imgListDetails = [
    "Sp2.png",
    "Sp3.png",
    "Sp4.png",
    "Sp5.png",
    "Sp6.png",
];

const defaultPath = "assets/Images/";

let currentItemName = "";

// function ShowDetailImg(index) {
//     document.getElementById("detailImg").src = defaultPath + currentItemName + "/" + imgListDetails[index - 1];
// }

window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const itemID = params.get("itemID");
    const itemName = ConvertID(itemID);
    currentItemName = itemName;


    document.getElementById("detailImg").src = defaultPath + itemName + "/Sp2.png";
    let images = document.getElementById("imgSlider").getElementsByTagName("img");
    let i = 0;
    for (let img of images) {
        img.src = defaultPath + itemName + "/" + imgListDetails[i++];
    }

    document.getElementById("rightPanel").getElementsByTagName("img")[0].src = defaultPath + itemName + "/Sp1.png";

    let currentGame = FindGameByIName(itemName);

    document.getElementById("itemNameTitle").innerText = currentGame.name;
    document.getElementById("lDate").innerText = currentGame.lDate;
    document.getElementById("rDate").innerText = currentGame.rDate;
    document.getElementById("dev").innerText = currentGame.dev;
    document.getElementById("publisher").innerText = currentGame.publisher;
    document.getElementById("priceTag").innerText = "$" + currentGame.price;
};

function GameDetails(iName, name, rDate, lDate, dev, publisher, price) {
    this.iName = iName;
    this.name = name;
    this.rDate = rDate;
    this.lDate = lDate;
    this.dev = dev;
    this.publisher = publisher;
    this.price = price;
}

const g01 = new GameDetails("RainWorld", "Rain World", "01/01/2000", "01/02/2020", "MT1.studio", "MT1.studio", 9.99);
const g02 = new GameDetails("GOW", "God of War", "01/01/2000", "01/02/2020", "MT1.studio", "MT1.studio", 10.99);
const g03 = new GameDetails("Celeste", "Celeste", "01/01/2000", "01/02/2020", "MT1.studio", "MT1.studio", 15.99);
const g04 = new GameDetails("ROR2", "Risk of Rain 2", "01/01/2000", "01/02/2020", "MT1.studio", "MT1.studio", 17.99);
const g05 = new GameDetails("StardewValley", "Stardew Valley", "01/01/2000", "01/02/2020", "MT1.studio", "MT1.studio", 20.99);

const gameList = [g01, g02, g03, g04, g05];

function ConvertID(id) {
    if (id == 1) return "RainWorld";
    if (id == 2) return "GOW";
    if (id == 3) return "Celeste";
    if (id == 4) return "ROR2";
    if (id == 5) return "StardewValley";
}

function FindGameByIName(name) {
    console.log(gameList);
    for (let game of gameList) {
        if (game.iName == name) return game;
    }
    return null;
}

