import { postCardAppend } from "./feed.js";
import { pagination } from "./pagination.js";

document.addEventListener('DOMContentLoaded', (event) => {
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const postDiv = document.querySelector('#post-div'); 
    const paginationDiv = document.querySelector('#pagination-div');


    postCardAppend('allposts', csrftoken, "FEED", postDiv, {"pageNumber": 1});

    pagination(2, paginationDiv, 'allposts', "FEED", csrftoken, postDiv);
})
