const gameList = [
    "RainWorld",
    "StardewValley",
    "GOW",
    "ROR2",
    "Celeste"
];

let currentFItem = 1;

function GoToDetailPage(index = currentFItem){
    // alert("1");
    window.location.href = `ItemDetail.html?itemID=${encodeURIComponent(index-1)}`;
}

function GoToPaymentPage(){
    window.location.href = "PaymentPage.html";
}

function GoToBill(){
    window.location.href = "BillPage.html";
}

function GoToLibrary(){
    window.location.href = "LibraryPage.html";
}