document.addEventListener('DOMContentLoaded', (event)=> {
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value; 
    // get the followings list
    fetch('followings', {
        headers: { "X-CSRFToken": csrftoken}, 
        method: "FEED"
    })
    .then(response => response.json())
    .then((result) => {
        console.log(result); 
        // append the followings div
        const followingsDiv =  document.querySelector('#followings-div'); 
        followingsAppend(csrftoken,followingsDiv, result);
    })
}) 

function followingsAppend(csrftoken, parentDiv, result){
    parentDiv.innerHTML = ""; 
    for(let profile of result){
        console.log(profile)
        let card = `
                    <div class="card mb-3" style="max-width: 540px;">
                        <div class="row g-0 h-100">
                            <div class="col-md-4">
                                <img src="${ profile.picture }" class="img-fluid rounded-start" alt="profile picture ">
                            </div>
                            <div class="col-md-8 h-100">
                                <div class="card-body d-col-flex justify-content-evenly">
                                    <h5 class="card-title">${profile.username}</h5>
                                    <p class="card-text">${profile.email }</p>
                                    <button class="btn btn-primary" id="${profile['username']}" onclick="followUnfollow('${csrftoken}', '${profile['username']}')"> Unfollow </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    ` 
            parentDiv.innerHTML += card; 

    }
}


function followUnfollow(csrftoken, username){
    // follow Btn
    const followBtn = document.getElementById(username);

    // then fetch 
    fetch(`/u/${username}`, {
        headers: {"X-CSRFToken": csrftoken}, 
        method: "PUT", 
    })
    .then(response => response.json())
    .then((result) => {
        result[0].followings.includes(username) ? followBtn.innerHTML = "Unfollow" : followBtn.innerHTML = "Follow";
    })
}