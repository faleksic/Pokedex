/*
sends get request to the given url and adds the data to the table
checks if there is a previous page or a next page if there is none
it disables the buttton, else it calls getPokemons with new url
*/
function getPokemons(url="http://pokeapi.co/api/v2/pokemon/"){
	//sending get request
	$.get(url).done( function(data){
		console.log();
		//checking is there data in previous atrribute
		if(!data.previous){
			//disableing previous button
			$("#prev").attr("disabled", "disabled");
		}
		//else enable button, remove all events and add new on click event
		else{
			if(typeof $("#prev").attr("disabled") !== typeof undefined && $("#prev").attr("disabled") !== false){
				$("#prev").removeAttr("disabled");
			}
			$("#prev").unbind();
			$("#prev").click(function(){getPokemons(data.previous)});
		}
		//checking is there data in next atrribute
		if(!data.next){
			$("#next").attr("disabled", "disabled");
		}
		//else enable button, remove all events and add new on click event
		else{
			if(typeof $("#next").attr("disabled") !== typeof undefined && $("#next").attr("disabled") !== false){
				$("#next").removeAttr("disabled");
			}
			$("#next").unbind();
			$("#next").click(function(){getPokemons(data.next)});
		}
		//remove all rows from the table except the first one
		$("#pokemons tr").slice(1).remove();
		//append data to table and add click listener to every row
		for(var i=0; i<data.results.length; i++){
			$("#pokemons").append("<tr> <td> "+ getPokemonId(data.results[i].url) +
			" </td> <td> " + firstLetterUpper(data.results[i].name) + "<img src='img/pokeball.png' alt='pokeball' ></td>");
			$("td").last().css("cursor", "pointer");
			//listener on click that calls getPokemonDetails function if clicked on row
			$("td").last().on("click", {value: data.results[i].url}, function(e){
				if(e.target !== e.currentTarget)
					return; 
				getPokemonDetails(e.data.value);
			});
			//image listener to add element to my pokemon list
			$("td img").last().on("click",{value: data.results[i]}, function(e){addToMyPokemon(e.data.value);});
		}
	});
}

//returns the string with capital first letter
function firstLetterUpper(word){
	return word.charAt(0).toUpperCase() + word.slice(1);
}

//returns the pokemon id sliced from the url of pokemon link
function getPokemonId(url){
	return url.slice(33, url.length-1);
}

function getPokemonDetails(url){
	//get all dd elements that don't have ul child and set ul to empty string
	for(var i=0; i<$("dd:not(:has(ul))").length; i++){
		 $("dd:not(:has(ul))")[i].innerText = "";
	}
	//get all dd elements that have ul child and set ul to empty string
	for(var i=0; i<$("dd > ul").length; i++){
		 $("dd > ul")[i].innerText = "";
	}
	$("#pokemon_details").slideDown();
	$("#pokemon_list").hide();
	$("#my_pokemon").hide();
	
	//get some pokemon data and set the values
	$.get(url).done( function(data){
		$("#id").text(data.id);
		$("#name").text(firstLetterUpper(data.name));
		$("#height").text(data.height);
		$("#weight").text(data.weight);
		for(var i=0; i<data.abilities.length; i++){
			$("#abilities").append("<li>" + firstLetterUpper(data.abilities[i].ability.name) + "</li>");
		}
		for(var sprite in data.sprites){
			if(data.sprites[sprite]){
				$("#sprites").append("<li> <img src='"+ data.sprites[sprite] + "' ></li>");
			}
		}
		for(var i=0; i<data.stats.length; i++){
			$("#stats").append(
			"<li>" + firstLetterUpper(data.stats[i].stat.name) + 
			"<ul><li>Base stat: " + data.stats[i].base_stat + "</li><li>Effort: " + data.stats[i].effort
			+ "</li></ul></li>"
			);
		}
		for(var i=0; i<data.types.length; i++){
			$("#types").append("<li>" + firstLetterUpper(data.types[i].type.name) + "</li>");
		}
	});
}

// adding click event on navigation list elements
function changeActive(){
	$('.nav a').click(function(e) {
		//changing active style to the element that is clicked
		$("ul").find(".active").removeClass("active");
		$(this).parent().addClass("active");
		//hide all divs with data
		$(".container").children().hide();
		//check is there any pokemons in my pokemon list
		//if not show image, else shows table
		if($(this).attr("href") === "#my_pokemon"){
			if($("#my_pokemons tbody").children().length < 2){
				$("#found").css("display", "none");				
				$("#not_found").css("display", "inline");				
			}
			else{
				$("#found").css("display", "inline");				
				$("#not_found").css("display", "none");
			}
		}
		//reads href attribute of given <a> element
		//and finds element with that id and slide it down
		$($(this).attr("href")).slideDown();
		if($(".alert").length>0)
			$(".alert").remove();
	});
	//set top padding on navigation height when window is ready
	$( window ).ready(function() {
		$("body").css("padding-top", $("nav").height());
	});
	//set top padding on navigation height when window is resized
	$( window ).resize(function() {
		$("body").css("padding-top", $("nav").height());
	});
}

//add to my pokemon list
function addToMyPokemon(pokemon){
	//check is that pokemon already in the list
	var cells= $("#my_pokemons td:has(img)");
	for(var i=0; i<cells.length; i++){
		if(cells[i].innerText == firstLetterUpper(pokemon.name)){
			$(".alert").remove();
			$($("h1").first()).after("<div class='alert alert-danger'>You have already caught that pokemon</div>");
			return;
		}
	}
	//add pokemon to my pokemon list
	$("#my_pokemons").append("<tr> <td> "+ getPokemonId(pokemon.url) +
	" </td> <td>" + firstLetterUpper(pokemon.name) + "<img src='img/pokeball-open.png' alt='pokeball open' ></td>");
	//on row click get pokemon details
	$("td").last().on("click", {value: pokemon.url}, function(e){
		if(e.target !== e.currentTarget)
			return; 
		getPokemonDetails(e.data.value);
	});
	$("td").last().css("cursor", "pointer");
	//on image click remove pokemon
	$("td img").last().on("click", {value: pokemon.name}, function(e){removeMyPokemon($($(this).parent()).parent(), e.data.value);});
	$(".alert").remove();
	$($("h1").first()).after("<div class='alert alert-success'>You have caught "+ firstLetterUpper(pokemon.name) +"!</div>");
}

//removes pokemon from my pokemon list
function removeMyPokemon(row, name){
	row.remove();
	$(".alert").remove();
	$($("h1").last()).after("<div class='alert alert-success'>You have released " + firstLetterUpper(name) + " </div>");
	//if there aren't any rows in the list shows the image after 2 seconds
	if($("#my_pokemons tbody").children().length < 2){
		setTimeout(function(){
			$("#found").css("display", "none");				
			$("#not_found").css("display", "inline");
			$("#not_found").css("display", "inline");
		}
		, 2000);
	}	
}
