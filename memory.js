(function($){
  $.fn.memory = function(options) {

    // Create some defaults, extending them with any options that were provided
    settings = $.extend({
      'rows'	: 	3,
      'cols' 	:	4,
      'size'	:	0,
      'images'	:	"",
      'existingImages'	:	false,
      'solved'	:	0,
      'solution':	0,
    }, options);
    
    //Variables
  	settings.size = settings.rows*settings.cols;
  	var first_open = "";
    
    //Methods
    methods = {
    	init : function(memory) {
    		memory.append('<span id="success"><h2>Loading images..</h2></span>'); //Show that images are loading
    		
    		//Generate the divs for the memory blocks
    		number = (settings.existingImages) ? settings.size/2 : settings.size;
			for(var i = 0; i < number; i++)
    			memory.append('<div></div>');
			
			$(window).load(function() {
				//If images are already in the memory container
				if(settings.existingImages)
					settings.images = $.makeArray(memory.children('div').children('img'));
				
				//Set solution length now that we have images defined
				settings.solution = settings.images.length;
				
				//Shuffle images
    			images = methods.shuffle(settings.images.concat(settings.images));
    			
				//Add shuffled images to cards
				if(settings.existingImages) {
					memory.children('div').each(function(index) {
						$(this).html('<img src="' + methods.getPath(images[index]) +'" class="cardImage"/>');
					});
				}
				
				//Scale the gaming cards to fit fullscreen
				methods.scale(memory);
		
				//Make cards clickable
				memory.children('div').click(function() {
					card = $(this).children('img');
					if(card.is(":hidden")) //Only make invisible cards clickable
						methods.compare(card); //Compares the selected card
				});
				
				$("#success").fadeToggle();
			});
    	},
    	
    	shuffle : function(param) {
    		//Initiate array for numbers and return array
    		random = new Array();
			copy = new Array();
	
			//Generate a new random order of numbers 0..<number of cards>
			while(random.length < settings.size) {
				number = Math.floor(Math.random() * settings.size);
				if($.inArray(number, random) === -1)
					random.push(number);
			}
	
			//Swap the order of the param array
			for(i = 0; i < settings.size; i++)
				copy.push(param[random[i]]);
	
			return copy;
    	},
    	
    	compare : function(card) {
    		card.fadeToggle('fast', function() {
				if(first_open === "")
					first_open = $(card); //Saves the first card that's opened
				else
					(first_open.attr('src') === card.attr('src')) ? methods.save(first_open, card) : setTimeout(methods.reset(first_open, card), 750);
			});
    	},
    	
    	scale : function(memory) {
    		viewportHeight = $(window).height();
			size = viewportHeight / 3 | 0;
	
			//Setting size of game field
			memory.width(size*4);
			memory.height(viewportHeight);
	
			//Adjust for borders
			border = 1;

			//Scales all the cards to the same size
			memory.children('div').each(function() {
				//Resize the div
				$(this).width(size-border);
				$(this).height(size-border);
		
				//Resize images in div
				image = $(this).children('img');
				(image.width() / image.height() > 1) ? image.height(size) : image.width(size);
		
				//Clip image accordingly
				image.css('clip','rect(0,' +(size-border) +'px, ' +(size-border) +'px, 0)');
			});
    	},
    	
    	save : function(card1, card2) {
    		card1.parent().css('opacity', '0.4');
			card2.parent().css('opacity', '0.4');
			first_open = "";
	
			//Check if this solution ends the game
			if(++settings.solved === settings.solution)
				$("#success").html('<h2>Congratulations, well done!</h2>').fadeToggle('slow');
    	},
    	
    	reset : function(card1, card2) {
    		card1.toggle();
			card2.toggle();
			first_open = "";
    	},
    	
    	getPath : function(image) {
    		return (settings.existingImages) ? $(image).attr('src') : image;
    	}
    	
    };	
     
     //Initiates the plugin
     methods.init(this);
	
	//Returns this to maintain chainability
	return this;
	
  };
})(jQuery);