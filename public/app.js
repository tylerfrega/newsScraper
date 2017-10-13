$(document).ready(function(){
    $(document).on('click', '.viewComments', displayComments);
    $(document).on('click', '.submit', postComment)

})

    
    function displayComments(){
        var linkHolder = $(this).parent();
        var thisId = linkHolder.attr("data-id");
        
        $.ajax({
            method: "GET",
            url: "/articles/" + thisId
          })
          .done(function(data){
            console.log(data)
            data.comment.forEach(function(element) {
                linkHolder.append(`<div class="comment"> ${element.body} </div>`)
                
            });
          })

        var id = linkHolder.attr('data-id');
        linkHolder.append(` <input type="text" class="form-control" id="${id}"></input> <button class="submit btn">submit comment</button>`);
        $(this).hide()
    }


    function postComment(){
        var thisId = $(this).parent().attr("data-id");
        var linkHolder = $(this).parent(); 
        var commentText = $(`#${thisId}`).val();
       
            $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                body: $(`#${thisId}`).val() 
            }
            })
            .done(function(data) {
                linkHolder.append(`<div class="comment"> ${commentText} </div>`)
            });
        
    }
    