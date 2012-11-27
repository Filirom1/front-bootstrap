$(function(){
  $('body').on('click', 'a', function(e){
    /* If you have external links handle it here */
    var $a = $(e.target).closest('a');
    var href = $a.attr('href');

    if(href === '#') return; // Escape the null link
    if(href.indexOf('http') != -1) return; // Escape external links
    if(href.indexOf('mailto:') != -1) return; // Escape
    if(href.indexOf('tel:') != -1) return; // Escape
    if(href.indexOf('img') != -1) return; // Escape
    sd.router.navigate(href, true);
    return false;
  });
});
