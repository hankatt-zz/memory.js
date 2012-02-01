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
    
  	//Calculate size of the game field
  	settings.size = settings.solution = settings.rows*settings.cols;
  	
  	/* #################################
  	 * DEFINITION OF A MEMORY CARD
  	 *
  	 * Methods: save*, reset and compareTo
  	 * *save includes checking for memory completion
  	 * ################################# */
  	card = {
  		compareTo : function(card) {
  			return this.image.attr('src') === card.image.attr('src');
  		},
  		
  		reset : function() {
  			image = this.image;  			
  			this.image = "undefined";
  			image.fadeToggle();
  		},
  		
  		save : function() {
  			this.image.parent().css('opacity', '0.4');
  			this.image = "undefined";
  			//Check if this solution ends the game
			if(++settings.solved === settings.solution) {
				$("#authors").fadeToggle('slow');
				$("#success-wrapper").html("<h2>Congratulations, well done!</h2><p>Don't miss my portfolio at <a href='http://www.henrikwiberg.com' target='_blank'>henrikwiberg.com</a></p>").fadeToggle('slow');
			}
  		},
  		
  		image : "undefined"
  	};
  	
  	//Create two cards based on card object we'll use when playing
  	cards = [];
    cards.push(jQuery.extend(true, {}, card));
    cards.push(jQuery.extend(true, {}, card));
    
    /* #################################
  	 * DEFINITION OF GAME METHODS
  	 *
  	 * Methods: init, shuffle, scale, getPath
  	 * 
  	 * init GENERATES THE GAME AND MAKES IT WORK,
  	 * THE GAME FIELD IS CREATED, IMAGES ARE SHUFFLED,
  	 * GAME FIELD IS SCALED, MAKE CARDS CLICKABLE.
  	 *
  	 * shuffle TAKES AN ARRAY AND RETURNS A
  	 * SHUFFLED COPY.
  	 *
  	 * scale TAKES A DIV AND FITS IT TO THE BROWSER WINDOW
  	 *
  	 * getPath RETURNS THE PATH TO A IMAGE WHETHER IT'S
  	 * A jQuery object OR AN EXISTING image ATTACHED
  	 * THROUGH THE PARAMS.
  	 *
  	 * ################################# */
    methods = {
    	init : function(memory) {
    		//Show that images are loading
    		$("#play-link").html('<img alt="Play" id="play" src="/assets/loading.PNG" />');
    		
    		//Generate the divs for the memory blocks
    		number = (settings.existingImages) ? settings.size/2 : settings.size;
			for(var i = 0; i < number; i++)
    			memory.append('<div></div>');
			
			//When everything is loaded, set up the memory game
			$(window).load(function() {
				//If images are already in the memory container
				if(settings.existingImages) {
					settings.images = $.makeArray(memory.children('div').children('img'));
				
				//Duplicate settings.images and shuffle cards
    			settings.images = methods.shuffle(settings.images.concat(settings.images));
    			
				//Add shuffled images to cards
				if(settings.existingImages) {
					memory.children('div').each(function(index) {
						$(this).html('<img src="' + methods.getPath(settings.images[index]) +'" class="cardImage"/>');
					});
				}
				
				//Scale the gaming cards to fit fullscreen
				methods.scale(memory);
		
				//Make cards clickable and define what happens when clicked
				memory.children('div').click(function() {
					//Sets the clicked card to a jQuery image object
					card = $(this).children('img');
					
					//Only make hidden cards clickable
					if(card.is(":hidden") && cards[1].image === "undefined") {
						card.fadeToggle('fast', function() {
							//Set the first card to the clicked card
							if(cards[0].image === "undefined")
								cards[0].image = card;
							else {
								//Set the second card to the clicked card
								cards[1].image = card;
								
								//Now that two cards are open, compare them
								if(cards[1].compareTo(cards[0])) {
									//The cards were equal so save both of them
									cards[0].save();
									cards[1].save();
								} else {
									//The cards were not equal so reset them
									cards[0].reset();
									cards[1].reset();
								}
							}	
						});
					}
				});
				
				//Image to show when the game has loaded
				$("#play-link").html('<img alt="Play" id="play" src="/assets/play.png" />');
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
    	
    	scale : function(memory) {
    		viewportHeight = $(window).height();
    		availableWidth = $(window).width() - 160;
    		
    		//<number with decimals> | 0 cuts the decimals
    		if(viewportHeight > availableWidth)
    			size = availableWidth / 4 | 0;
    		else
				size = viewportHeight / 3 | 0;
	
			//Setting size of game field
			memory.width(size*4);
			memory.height(viewportHeight);
	
			//Adjust for borders
			border = 0;

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
    	
    	//Return the path for an image
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