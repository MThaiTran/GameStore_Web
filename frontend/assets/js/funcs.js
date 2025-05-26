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

async function LogOut() {
  try {
      // Gửi yêu cầu tới API /auth/logout
      const response = await fetch('/auth/logout', {
          method: 'POST', // Hoặc GET tùy thuộc vào API của bạn
          headers: {
              'Content-Type': 'application/json',
              // Nếu API yêu cầu token trong header
              'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
      });

      // Kiểm tra phản hồi từ server
      if (response.ok) {
          // Xóa dữ liệu trong localStorage
          localStorage.removeItem("loggedInUser");
          localStorage.removeItem("token");
          // Chuyển hướng về trang đăng nhập
          location.href = "/signin";
      } else {
          console.error('Đăng xuất thất bại:', response.statusText);
          alert('Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại.');
      }
  } catch (error) {
      console.error('Lỗi khi gọi API đăng xuất:', error);
      alert('Không thể kết nối tới server. Vui lòng kiểm tra lại.');
  }
}

function DropDownMenu() {
  const dropdown = document.getElementById("dropdown-content");
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

async function AddToCollection(collection_name, gameId){
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  const userId = user.ID;

  console.log("User :" + userId + " Game: " + gameId);

  const response = await fetch(`http://localhost:5000/api/user/${userId}/${collection_name}`,{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          GameID: gameId
      })
  });
  
  if(!response.ok){
      alert(response.status);
      return
  } else{
      alert("Added!");
      document.getElementById("addTo" + collection_name).value = "Added to your " + collection_name;
  }
}

async function RemoveFromCollection(collection_name, gameId){
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  const userId = user.ID;

  console.log("User :" + userId + " Game: " + gameId);

  const response = await fetch(`http://localhost:5000/api/user/${userId}/${collection_name}/items/${gameId}`,{
      method: 'DELETE',
  });
  
  if(!response.ok){
      alert(response.status);
      return;
  } else{
      window.location.href = `/${collection_name}/${userId}`;
  }
}

async function Search() {
    const keyword = document.getElementById('searchInput').value;
    const category = document.getElementById('categoryFilter').value;
    const sortBy = document.getElementById('sortBy').value;
    
    // Build query parameters
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (category) params.append('category', category);
    if (sortBy) params.append('sortBy', sortBy);
    
    try {
        const response = await fetch(`/api/games/search?${params.toString()}`);
        if (!response.ok) {
            throw new Error('Search failed');
        }
        
        const games = await response.json();
        
        // Redirect to search results page with the results
        window.location.href = `/search-results?${params.toString()}`;
        
        return false; // Prevent form submission
    } catch (error) {
        console.error('Search error:', error);
        alert('An error occurred while searching. Please try again.');
        return false;
    }
}


