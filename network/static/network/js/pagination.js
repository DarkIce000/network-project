import { postCardAppend } from "./feed.js";

function pagination(currentPageNumber=1, paginationDiv, url, method="FEED", csrftoken, postDiv){
    let htmlDefination = `
        <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item"  > <button class="page-link" data-pagenumber="${currentPageNumber-1}" >Previous</button></li>
                <li class="page-item"  > <button class="page-link" data-pagenumber="${currentPageNumber-1}" >${currentPageNumber-1}</button></li>
                <li class="page-item"  > <button disabled class="page-link disabled" data-pagenumber="${currentPageNumber}" >${currentPageNumber}</button></li>
                <li class="page-item"  > <button class="page-link" data-pagenumber="${currentPageNumber+1}" >${currentPageNumber+1}</button></li>
                <li class="page-item"  > <button class="page-link" data-pagenumber="${currentPageNumber+1}" >Next</button></li>
            </ul>
        </nav>
    `
    paginationDiv.innerHTML = "";
    paginationDiv.innerHTML = htmlDefination; 

    const btns = document.querySelectorAll('button[data-pageNumber]'); 
    btns.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            postCardAppend(url, csrftoken, method, postDiv, { "pageNumber": event.target.dataset.pagenumber })
            pagination(Number(event.target.dataset.pagenumber), paginationDiv, url, method, csrftoken, postDiv);
        })
    })

}

export {pagination}