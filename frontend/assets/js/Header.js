
window.addEventListener("DOMContentLoaded", function() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const signed = document.getElementById("signedProfilePanel");
  const unsigned = document.getElementById("unSignedProfilePanel");
  if (user) {
    signed.style.display = "block";
    unsigned.style.display = "none";
    document.getElementById("usernameHeader").innerText = user.username;
    document.getElementById('profile-link').href = `/profile/${user.ID}`;
    document.getElementById('cart-link').href = `/cart/${user.ID}`;
    document.getElementById('wishlist-link').href = `/wishlist/${user.ID}`;
    document.getElementById('library-link').href = `/library/${user.ID}`;
    
    if (user.RoleID !== 1) {
      const adminLinks = document.querySelectorAll(".admin-only");
      adminLinks.forEach(el => el.style.display = "none");
    }
  } else {
    signed.style.display = "none";
    unsigned.style.display = "block";
  }
});

function LogOut() {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("token");
  location.href = "SignIn.html";
}

function DropDownMenu() {
  const dropdown = document.getElementById("dropdown-content");
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}
