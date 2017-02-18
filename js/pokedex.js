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
			$("#pokemons").append("<tr> <td> "+ getPokemonId(data.results[i].url) +" </td> <td> " + firstLetterUpper(data.results[i].name) + " </td> </tr>");
			$("tr").last().on("click", {value: data.results[i].url}, function(e){getPokemonDetails(e.data.value)});
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
	$("#pokemon_list").slideUp();
	$("#pokemon_details").slideDown();
	$
	$.get(url).done( function(data){
		console.log(data);
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

function changeActive(){
	$('.nav a').click(function(e) {
		$("ul").find(".active").removeClass("active");
		$(this).parent().addClass("active");
	});
}


