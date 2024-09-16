import { postCardAppend } from "./feed.js";
import { pagination } from "./pagination.js";

document.addEventListener('DOMContentLoaded', (event) => {
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const loggedinUser = document.querySelector('[name=loggedin_user]').value; 

    // to do: follow functionality 
    const followBtn = document.querySelector('#follow-btn'); 
    followBtn.addEventListener('click', (event) => {
        followUnfollow(csrftoken, followBtn, loggedinUser);
    })

    // posts 
    const postDiv = document.querySelector('#post-div');
    const paginationDiv = document.querySelector('#pagination-div');
    postCardAppend(location.href, csrftoken, "FEED", postDiv, {"pageNumber": 1})
    pagination(1, paginationDiv, location.href, "FEED", csrftoken, postDiv);
})

function followUnfollow(csrftoken, followBtn, loggedinUser){
    fetch(location.href, {
        headers: {"X-CSRFToken": csrftoken}, 
        method: "PUT"
    })
    .then(response => response.json())
    .then((result) => {
        console.log(result);                //
        result[0].followings.includes(location.href.split('/')[4]) ? followBtn.innerHTML = "Unfollow" : followBtn.innerHTML = "Follow";
    })
}
