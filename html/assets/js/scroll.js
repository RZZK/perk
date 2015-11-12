$('body').bind('touchmove', function(e){e.preventDefault()})

function disableScroll()
{
	$('body').bind('touchmove', function(e){ e.preventDefault() });
}
function enableScroll()
{
	$('body').unbind('touchmove');
}
