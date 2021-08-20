// Hey there curious monkey ;)
// Copyright 2016 by Hugo Peters

var requiredTopScroll = false;
var hasSlideshow = false;

$( document ).ready(function() 
{
	"use strict";

	$('meta[name=viewport]').attr('content','width='+$(window).width()+',user-scalable=no');

	// Bind events for when we unload
	$(window).on('beforeunload', function() {
		$("#preloader-frame").velocity("fadeIn", 
		{ 
			delay: 0, 
			duration: 200
		});
	});
    
	// Create video elements, do not autoplay, preload only
	if ($('#hero1-video').length)
	{
		$('#hero1-video').vide('res/video/hero1/hero1', {
			muted: true,
			resizing: true,
			autoplay: false,
			loop: true
		});
	}
	
	// Force page to be loaded at the top
	var url = window.location.href;
	var hasIdSubstring = url.includes('#');

	if (!hasIdSubstring) 
	{
		window.location.replace(url + "#");
		requiredTopScroll = true;
	}
	else
	{
		var urlIdSubstring = url.substring(url.lastIndexOf('#'));
		requiredTopScroll = urlIdSubstring.length == 1;
	}

	// Yeah.
	setHeroSize(requiredTopScroll, false);
	socialIconsBind();
	introSetBegin();

	//$('.work-content').flickity();

	// Init syntax highlighting :D	
	SyntaxHighlighter.all();

	// Init image slider
	try
	{ 
		$("#background-slider").backstretch(cachedBackgroundSlideshow, 
			{duration: 6000, fade: 750}); 
		hasSlideshow = true;
	} 
	catch(e) { }

	// Init asset player
});

window.onload = function() 
{
	"use strict";

    /* I'm really confused why this has to be delayed... chrome... */
    setTimeout(function() 
    {
    	if (!requiredTopScroll) {
    		pageScrollToUrlId(false);
    	}
    	else {
    		getPageScrollElemForChanging().scrollTop(0);
    	}
    }, 80);

    if (!hasSlideshow)
    {
    	var ppContents = $('#pp-container');

    	if (ppContents.length)
    	{
    		ppContents.css({"opacity" : 1});
    	}
    }

    if (_livePreview)
    {
    	var ppContents = $('#pp-container');

    	if (ppContents.length)
    	{
    		ppContents.css({"opacity" : 1});
    	}

    	$("#preloader-frame").css({"display" : "none"});
    	onPreloaderFadeOutDone();
    }
	else
	{
		// Fade out the preloader and start videos
	    setTimeout(function()
		{
			if ($('#hero1-video').length)
			{
				$('#hero1-video').data('vide').getVideoObject().play();
			}
			
			$("#preloader-frame").velocity("fadeOut", 
			{ 
				delay: 500, 
				duration: 1200,
				complete: onPreloaderFadeOutDone
			});
		}, 100); /* Wait 200ms before fading */
	}
};

var centerIt = function (el /* (jQuery element) Element to center */) {
    if (!el) {
        return;
    }
    var moveIt = function () 
	{
        var winWidth = $(window).width();
        var winHeight = $(window).height();
        el.css("position","absolute").css("left", ((winWidth / 2) - (el.width() / 2)) + "px").css("top", ((winHeight / 2) - (el.height() / 2) + getPageScrollElem().scrollTop()) + "px");
    }; 
    $(window).resize(moveIt);
    moveIt();
};

window.onbeforeunload = function()
{
	_gaq.push(['_trackPageview', '/bounce']);
	return null;
};

function setPageHeight(elem, multip)
{
 	function setHeight() 
	{
		var windowHeight = $(window).innerHeight();
		elem.css('min-height', windowHeight * multip);
  	}
  	setHeight();
}

function getPageScrollElem()
{
	return $('body');
}

function getPageScrollElemForChanging()
{
	return getPageScrollElem();
}

function getPageScrollTop()
{
	return getPageScrollElem().scrollTop();
}

/**************************************
* Preloader functions
**************************************/
function onPreloaderFadeOutDone()
{
	"use strict";
	
	// Remove preloader elements
	//$('#preloader-frame').remove();
	// Reset overflow
	//$('#outer-container').css({"overflow":"visible"});
	// Will automatically toggle the menu bar if needed
	//menubarAutoResize();
	// Activate page scroll spies
	bindScrollSpies();
	// Enable hamburger functionality in menu bar
	menubarHamburger();
	// Bind the actions for the projects
	workBindActions();
	// Menu bar functionality
	menubarBind();
	// Accordions
	accordionBind();
	// Show the menu bar after a timeout
	setTimeout(function() { menubarShow(true); }, 400);
	// Shrink the hero after a timeout
	if (requiredTopScroll)
	{
		setTimeout(function() { if (!heroExpanderVisible) { setHeroSize(false, true); } 
						  } , 1200);
	}

	if ($('#pp-container').length && !_livePreview && hasSlideshow)
	{
		setTimeout(projectPageShowContents, 1200);
	}
	
	introDoAnimate();  
}

function bindScrollSpies()
{
	// hero resizing
	heroScrollSpy();
}

/**************************************
* Intro functions
**************************************/
function introSetBegin()
{
	$('#avatar-container').css({"display":"none"});
	// $('#social-links').css({"display":"none"});
}

function introDoAnimate()
{
	if ($(window).width() >= 550) {
		//heroShowForeground(true, true);
	}
	
	// Animate the avatar!
	/* $('#avatar-container').velocity("transition.bounceDownIn",
	{
		display: "inline-block"
	});
	$('#social-links').velocity("transition.bounceDownIn",
	{
		display: "inline-block",
		/* The transform element in the style attr causes the button functionality to be broken,
		   so remove it entirely *//*
		complete: function() { $('#social-links').removeAttr( 'style' ); },
		delay: 200
	}); */
}

/**************************************
* Social icon functions
**************************************/
var curSelectedSocialIcon = null;

function socialIconsBind()
{
	$('.social-icon').on(
	{
		mouseenter: function(){
			socialIconChangeHover(true, $(this));
		},
		mouseleave: function(){
			socialIconChangeHover(false, $(this));
		},
		onclick: function(){
			socialIconClick($(this));
		}
	});
	
	$('#social-links').on(
	{
		mouseenter: function(){
			socialIconContainerChangeHover(true, $(this));
		},
		mouseleave: function(){
			socialIconContainerChangeHover(false, $(this));
		}
	});
}

function socialIconChangeHover(isHovering, elem)
{
	if (isHovering) {
		curSelectedSocialIcon = elem;
	}
	else {
		curSelectedSocialIcon = null;
	}
	
	// Animate the icons that aren't the selected one one
	$('.social-icon').each(function(i, elemOther)
   	{
		if (elemOther.id !== elem.context.id)
		{
			$.Velocity.animate(elemOther, "stop");
			$.Velocity.animate(elemOther, 
			{
				opacity: (isHovering ? 0.25 : 0.6),
			}, 300);
		}
	});
	
	// Animate the selected one
	$.Velocity.animate(elem, "stop");
	$.Velocity.animate(elem, {opacity: (isHovering ? 1 : 0.6)}, 150);
	
	socialPageCover(isHovering, elem);
}

function socialIconClick(elem)
{
	// Force-fade out the frame
	socialIconContainerChangeHover(false, elem);
}

function socialIconContainerChangeHover(isHovering, elem)
{
	if (!isHovering)
	{
		socialPageCover(false, elem);
	}
}

function socialPageCover(show, elem)
{
	var $titleName = "social-pagecover-title";
	var $childName = "social-pagecover";
	var $container = $("#social-pagecover-container");
	
	if (show)
	{
		var $childCount = $container.find('#' + $childName).length;
		var $childElem = null;
		var $titleElem = null;
		
		// Create the page frame if it doesn't exist, otherwise reset the current one
		if ($childCount > 0)
		{
			$('#' + $childName).velocity("stop");
			
			var $titleElemTest = $('#' + $titleName);
			if ($titleElemTest !== null) {
				$titleElemTest.remove();
			}
		}
		else {
			// Create an instance of the frame
			$container.append("<div id=\"" + $childName + "\"></div>");
		}

		// Always make a new title... fancy change anim was too hacky :/
		$container.append("<div id=\"" + $titleName + "\"></div>");

		$childElem = $('#' + $childName);
		$titleElem = $('#' + $titleName);
		
		$titleElem.text(elem.data("friendly"));
		centerIt($titleElem);
		$titleElem.velocity("transition.bounceIn");
		
		// Animate the panel -> fade to color & opacity
		$childElem.velocity("stop");
		$childElem.velocity(
			{
				backgroundColor: elem.data("color"),
				opacity: 0.8
			}, 150);
	}
	else
	{
		// Fade out the page frame
		$('#' + $childName).velocity("stop");
		$('#' + $childName).velocity({opacity: 0}, 
		{
			duration: 400,
			complete: function()
			{
				$container.empty();	
			},
		});
		$('#' + $titleName).velocity("stop");
		$('#' + $titleName).velocity("transition.bounceOut", 300);
	}
}

/**************************************
* Hero functions
**************************************/
var heroExpanderVisible = false;

var heroExpanderHeightCss = function(newHeight)
{
	return {"height": newHeight+"px", "line-height":newHeight+"px"};
};

function heroExpanderShow(enable)
{
	heroExpanderVisible = enable;
	var elem = $("#hero-expand");
	
	elem.velocity("stop");
	elem.velocity(enable ? "transition.slideDownBigIn" : "transition.slideDownBigOut",
   	{
		delay: 300,
		/* Bind expander events if it's enabled */
		complete: enable ? heroExpander : null
	});
}

function heroExpander()
{
	var elem = $("#hero-expand");
	
	var animateTo = function(newHeight, doNotStop)
	{
		if (!doNotStop) {
			elem.velocity("stop");
		}
		
		elem.velocity(heroExpanderHeightCss(newHeight), 200);
	};
	
	elem.hover(function() {
		animateTo(70, false); /* Increase size on hover */
	}, function() {
		animateTo(50, false); /* Decrease size on unhover */
	});
	
	elem.click(function() {
		setHeroSize(true, true);
		elem.unbind(jQuery.click);
		elem.unbind(jQuery.hover);
		
		// Scroll to the top. First unbind exsiting scroll spy
		getPageScrollElem().unbind(jQuery.scroll);
		
		getPageScrollElem().velocity('scroll', 
	   	{
			duration: 500, 
			offset:0,
			complete: function() { animateTo(50, true); bindScrollSpies(); }
		});
	});
}

function setHeroSize(makeFull, doAnimate)
{
	var elem = $(".hero-wrapper");
	var multip = makeFull ? 1 : 0.7;
	var windowHeight = $(window).innerHeight();
	
	if (doAnimate) {
		elem.velocity({"min-height" : windowHeight * multip}, 500);
	}
	else {
		elem.css({"min-height" : windowHeight * multip});
	}

	heroExpanderShow(makeFull === false);
}

function heroScrollSpy()
{
	var elem = $(".hero-wrapper"); 

	var updateHeroScroll = function()
	{
		if (!heroExpanderVisible)
		{
			var scrollTop = getPageScrollTop();
			var breakpoint = (elem.position().top + elem.height() * 0.05);

			if (scrollTop >= breakpoint) {
				setHeroSize(false, true);
			}
		}
	};
	
	getPageScrollElem().scroll(updateHeroScroll);
}

function heroShowForeground(enable, animate)
{
	var elem = $('.hero-fg');
	
	elem.velocity("stop");
	
	if (enable) 
	{ 
		elem.css({"visibility": "visible"});
		if (animate) {
			elem.velocity("transition.fadeIn");
		}
	}
	else 
	{
		if (animate) {
			elem.velocity("transition.fadeOut");
		}
		else {
			elem.css({"visibility": "hidden"});
		}
	}
}

/**************************************
* Menubar functions
**************************************/
var menubarIsActive = false;
var menubarHbgrIsActive = false;
var menubarHbgrIsBusy = false;

function menubarShow(enable)
{
	var menubar = $('#menubar-container');
	
	if (enable === menubarIsActive) {
		return;
	}
	
	menubar.velocity("stop");
	
	if (enable) {
		menubar.velocity("transition.slideDownIn", 300);
	}
	else {
		menubar.velocity("transition.slideUpOut", 300);
	}
	
	menubarIsActive = enable;
}

function hamburgerTransition(enable)
{
	var elem = $('#hamburger-menu');
	
	elem.velocity("stop");
	
	if (enable) {
		elem.css({"display": "block"});
	}
	
	elem.velocity(
	{
		"margin-right": enable ? "0" : "-300px",
	},
	{
		duration: 400,
		complete: function() {
			if (!enable) {
				elem.css({"display": "none"});	
			}
		}
	});
}

function menubarHamburgerShow(enable)
{
	var hbgrIcon = $('#menubar-hamburger-icon');
	var hbgrElem = $('#hamburger-menu');
	var page = $('#page');

	page.velocity("stop");

	menubarHbgrIsActive = enable;
		
	if (enable) {
		/* Enable */
		hbgrIcon.addClass('is-active');
		hamburgerTransition(true);
		page.velocity({"margin-left": "-300px"}, 400);
	}
	else {
		/* Disable */
		hbgrIcon.removeClass('is-active');
		hamburgerTransition(false);
		page.velocity({"margin-left": "0px"}, 400);
	}
}

function menubarHamburger()
{
	var hbgrIcon = $('#menubar-hamburger-icon');

	hbgrIcon.click(function()
   	{
		menubarHamburgerShow(!menubarHbgrIsActive);
	});
}

function menubarBind()
{
	function doMenuItem(elem)
	{
		var targetId = elem.data("target-element");

		if (targetId == undefined)
		{
			return;
		}

		var target = $(targetId);

		if (target.length)
		{
			/* On the current page */
			pageScrollToElement(target, true);
		}
		else
		{
			/* Go back to the home page */
			window.location.href = _siteUrl + targetId;
		}
	}

	$(".menubar-item").click(function() 
	{
		doMenuItem($(this));
	});

	$(".hamburger-menu-item").click(function() 
	{
		if (!menubarHbgrIsBusy)
		{		
			menubarHbgrIsBusy = true;
			menubarHamburgerShow(false);
			var target = $(this);
			setTimeout(function() { doMenuItem(target); menubarHbgrIsBusy = false; }, 400);
		}
	});

	$("#menubar-title").click(function()
	{
		var target = $("#hero1-video");

		if (target.length)
		{
			pageScrollToElement(target, true);
		}
		else
		{
			window.location.href = _siteUrl;
		}
	});
}

/**************************************
* Work functions
**************************************/
function workBindActions()
{
	$('.ws-item--ext').click(function()
	{
		//var $url = $(this).data('action');
		//var $win = window.open($url, '_blank');
		//$win.focus();
		lity($(this).data('action'));
	});
}

function pageScrollToUrlId(doAnimate)
{
	var url = window.location.href;

	if (!url.includes('#')) {
		return;
	}

	var id = url.substring(url.lastIndexOf('#'));

	if (id.length > 1)
	{
		pageScrollToElement($(id), doAnimate);
	}
}

function pageScrollToElement(elem, doAnimate)
{
	var scroller = getPageScrollElemForChanging();

	if (!doAnimate)
	{
		scroller.scrollTop(elem.offset().top);
	}
	else
	{
		scroller.velocity("stop");
		scroller.velocity("scroll", { offset: elem.offset().top, duration: 500, easing: "easeInOutQuat" });
	}
}

function accordionBind()
{
	$('.accordion').click(function(e) {
	  	e.preventDefault();
	  
	    var $this = $(this);
	  
	    if ($this.next().hasClass('visible')) {
	        $this.next().removeClass('visible');
	        $this.next().slideUp(350);
	        $this.removeClass('active');
	        $this.find('.accordion-icon').removeClass('rotate');
	    } else {
	        $this.parent().parent().find('li .accordion-inner').removeClass('visible');
	        $this.parent().parent().find('li .accordion-inner').slideUp(350);
	        $this.next().toggleClass('visible');
	        $this.next().slideToggle(350);
	        $this.toggleClass('active');
        	$this.find('.accordion-icon').toggleClass('rotate');

			var pageTitle = document.getElementsByClassName("pp-title")[0].getElementsByTagName("span")[0].outerText;
        	var accordionTitle = $this.children("span").text();
        	var eventStr = "A-" + pageTitle + ": " + accordionTitle;

        	ga('send', 'event', eventStr, "active");
	    }
	});
}

/**************************************
* Project page functions
**************************************/
function projectPageShowContents()
{
	var projectpage = $('#pp-container');

	projectpage.velocity("transition.fadeIn");
}

/**************************************
* GA functions
**************************************/
function trackResume()
{
	ga('send', 'event', "Resume (menubar)", "click");
}






















