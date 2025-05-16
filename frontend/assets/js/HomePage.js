function GoToBrowsePage() {
    window.location.href = ("../html/BrowsePage.html");
}

function ShowFItem(index) {
    let imgPath = "assets/Images/" + gameList[index - 1] + "/Sp1.png";
    document.getElementById("bigImage").style.backgroundImage = `url('${imgPath}')`;
    currentFItem = index;
}

function AddToWishlist() {
    // alert("XXXX");
    // document.getElementById("add").getElementsByTagName("h2").innerText  = "Added !";
    document.getElementById("add").getElementsByTagName("h2")[0].innerText = "Added to your wishlist";
}



