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
                linkHolder.append(`<div> ${element.body} </div>`)
                
            });
            //$(this).parent().append(`<div>${data}</div>`)
          })

        var id = linkHolder.attr('data-id');
        linkHolder.append(` <input id="${id}"></input> <button class="submit">submit comment</button>`);
        $(this).hide()
    }


    function postComment(){
        var thisId = $(this).parent().attr("data-id");
        var linkHolder = $(this).parent(); 
        let val = $(`#${thisId}`).val();
       
        
            $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                body: $(`#${thisId}`).val() 
            }
            })
            // With that done
            .done(function(data) {
                // Empty the notes section
                linkHolder.append(`<div> ${val} </div>`)
            });
        
    }
    