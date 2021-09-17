
function initDraggable() {
    $('.forked').draggable({
        revert: 'invalid',
        containment: ".page-name",
        cursor: "grabbing"
    });
}
initDraggable();

$("body").on('DOMSubtreeModified', "#container", function() {

    initDraggable();
});
function removeForkFromPageById(forkId) {
    $('[fork-id='+forkId+']').transition({
        animation  : 'zoom',
        onComplete : function() {
            $('[fork-id='+forkId+']').remove();
        }
    });
}
function deleteFork(component){
    let forkId = $(component).parents().eq(1).attr('fork-id');
    removeForkFromStorageById(forkId);
    removeForkFromPageById(forkId);
    console.log('fork ' + forkId + " deleted");
}

$.expr[':']['hasText'] = function(node, index, props){
    return node.innerHTML.includes(props[3]);
}
function banPairs(component) {

    let pairs = $(component).attr('fork-pairs').split(';');
    console.log(pairs);

    pairs.forEach(pair => {
        currentUser.settings.bannedPairs.push({
            title: pair
        });

        $('.forked:hasText('+pair+')').each(function() {
            let forkId = $(this).attr('fork-id');
            removeForkFromPageById(forkId);
        });
    });

    $.ajax({
        type:"PUT",
        contentType: "application/json",
        dataType: "json",
        url: api_url + "user/settings",
        data: JSON.stringify(currentUser.settings),
        success: function(response) {
            console.log(response);
        },
        error: function(error) {
            console.log(error);
        }
    });
}