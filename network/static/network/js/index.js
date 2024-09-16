import { postCardAppend } from "./feed.js";
import {pagination} from './pagination.js'

document.addEventListener('DOMContentLoaded', (event) => {
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const postDiv = document.querySelector('#post-div'); 
    const postFormDiv = document.querySelector('#post-form');
    const paginationDiv = document.querySelector('#pagination-div')

    // appending post form 
    postFormAppend(postFormDiv, csrftoken);

    // feed cards 
    postCardAppend('/', csrftoken, "FEED", postDiv, {"pageNumber": 1});
    
    // posting logic
    const postButton = document.querySelector('#post-btn');
    postButton.addEventListener('click', (event)=> {

        // grab text 
        const postText = document.querySelector('#postText').value; 
        posting(postDiv, postText); 

        // clear the text area
        document.querySelector('#postText').value = "";
    })

    const postTextarea = document.querySelector('#postText'); 
    postTextarea.addEventListener('keyup', (event)=> {
        console.log(event);
        if(event.key === "Enter"){
            const postText = postTextarea.value; 
            // grab text 
            posting(postDiv, postText); 

            // clear the text area
            document.querySelector('#postText').value = "";
        }
    })
    
    // pagination
    pagination(2, paginationDiv, '/', "FEED", csrftoken, postDiv);

})

// top input form 
function postFormAppend(parentDiv){
    let postForm = `
        <div class="mb-3">
            <label for="postText" class="form-label">What is happing..?</label>
            <textarea class="form-control" id="postText" rows="3"></textarea>
            <button class="btn btn-primary my-3" id="post-btn">Post</button>  
        </div>
    `;
    parentDiv.innerHTML = "";
    parentDiv.innerHTML = postForm; 
}




// handling posting 
function posting(postDiv, text){
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    postCardAppend('/', csrftoken, "POST", postDiv, { "postText": text});
}