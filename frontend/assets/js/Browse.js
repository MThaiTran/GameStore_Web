window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const keyword = params.get("keyword");

    let keywordToShow = "You have search for \"" + keyword + "\"";
    let recordToShow = "We have found " + "10" + " results about your keyword, check it out."

    if (keyword) {
        document.getElementById("context").querySelector("h1").innerText = keywordToShow;
        document.getElementById("context").querySelector("p").innerText = recordToShow;
    } else {
        // document.getElementById("context").querySelector("h1").innerText = "No search keyword provided.";
    }
};

