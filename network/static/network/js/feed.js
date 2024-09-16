
// displaying cards to the cardDiv
function postCardAppend(url, csrftoken, method, parentDiv, body){

    const loggedin_user = document.querySelector('[name=loggedin_user]').value; 

    // clearing div
    parentDiv.innerHTML = "";

    // latest feed from server
    let feedData; 
    fetch(url, {
        headers: {"X-CSRFToken": csrftoken},
        method: method, 
        body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then((result) => {

        // creating and appending cards to parentDiv
        if (result){
            for( let post of result){
                let buttonColor =  post.likeUsers.includes(loggedin_user) ? "btn-success" : "btn-primary"; 
                let postCard = `
                    <div class="card mb-3" style="width: 30rem;">
                        <div class="card-body clearfix" id="">
                            <div class="col d-none" id="edit-mode-${post.id}"> 
                                <h5 class="card-title">${post.user} ${ post.user === loggedin_user ? '<button class="btn btn-outline-primary float-end" data-save-id="'+ post.id + '">Save</button>' : '' }</h5>
                                <textarea class="" data-textarea-${post.id}=${post.id} >${post.postText}</textarea>
                            </div>
                            <div class="col" id="view-mode-${post.id}">
                                <h5 class="card-title">${post.user} ${ post.user === loggedin_user ? '<button class="btn btn-outline-primary float-end" data-edit-id="' + post.id + '">Edit</button>' : '' }</h5>
                                <p class="card-text" data-posttext-${ post.id }=${post.id}>${post.postText}</p>
                                <button class="btn ${buttonColor}" id="${ post.id }" data-id="${ post.id }" >👍 ${post.likeCount}</button> 
                            </div>
                            <small class="ms-auto"> ${ post.timestamp } </small>
                        </div>
                    </div>
                `
                parentDiv.innerHTML += postCard; 
            }

            const btns = document.querySelectorAll('button[data-id]'); 
            // like a post if clicked  
            btns.forEach((element) => {
                element.addEventListener('click', (event) => {
                    likeOrUnlikePost(event.target.dataset.id); 
                })
            })

            const editBtns = document.querySelectorAll('button[data-edit-id]');
            // edit a post 
            editBtns.forEach((element) => {
                element.addEventListener('click', (event) => {
                    const id = event.target.dataset.editId; 
                    const viewDiv = document.getElementById(`view-mode-${id}`);
                    const editDiv = document.getElementById(`edit-mode-${id}`);
                    viewDiv.classList.add('d-none');
                    editDiv.classList.remove('d-none');
                })
            })
            
            const saveBtns = document.querySelectorAll('button[data-save-id]');
            // edit a post 
            saveBtns.forEach((element) => {
                element.addEventListener('click', (event) => {
                    const id = event.target.dataset.saveId; 
                    const viewDiv = document.getElementById(`view-mode-${id}`);
                    const editDiv = document.getElementById(`edit-mode-${id}`);
                    editDiv.classList.add('d-none');
                    viewDiv.classList.remove('d-none');

                    // post text 
                    const postText = document.querySelector('textarea[data-textarea-'+ id + ']').value
                    console.log(postText)

                    fetch('/post/edit/', {
                        headers: {"X-CSRFToken": csrftoken},
                        method : "POST", 
                        body: JSON.stringify({
                            postId : id, 
                            postText : postText, 
                        })
                    })
                    .then(response => response.json())
                    .then((result) => {
                        const cardTextTag = document.querySelector('p[data-posttext-'+ id +']');
                        cardTextTag.innerText = "";
                        cardTextTag.innerText = result['postText'];
                    })
                })
            })

        }else{
            parentDiv.innerHTML = "Sorry, We cannot fetch your feed"
        }
    })

    return feedData; 
    
}

// handling like or unlike button functionality
function likeOrUnlikePost(postId){
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    fetch('/', {
        headers:{"X-CSRFToken": csrftoken}, 
        method: "PUT", 
        body: JSON.stringify({
            postId : postId,
        })
    })
    .then(response => response.json())
    .then((result) => {
       const button = document.getElementById(`${result[0].id}`);
       if(button.classList.contains('btn-primary')){
        button.classList.remove('btn-primary'); 
        button.classList.add('btn-success');
       }else{
        button.classList.remove('btn-success');
        button.classList.add('btn-primary'); 
       } 
       button.innerHTML = `👍 ${result[0].likeCount}`
    })
}

export { postCardAppend, likeOrUnlikePost }; 