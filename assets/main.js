function guessStation(input){
    query = input.val();
    $.ajax({
        url: 'https://db-hafas.juliuste.de/locations?query='+query,
        dataType: 'json',
        success: function(res){
            console.log(res[0].id);
            if(res.length>0&&!input.next('input').attr('value')){
                input.attr('value', res[0].id);
                input.val(res[0].name);
            }
            else{
                input.val(null);
            }
        },
        error: function(data){
            input.val(null);
        }
    });
}
// AUTO COMPLETION

$('#from').autocomplete({
	serviceUrl: 'https://db-hafas.juliuste.de/locations',
	paramName: 'query',
	transformResult: function(response) {
		return {
			suggestions: $.map($.parseJSON(response).slice(0,5), function(dataItem) {
				return { value: dataItem.name, data: dataItem.id};
			})
		}
	},
	onSelect: function(suggestion) {
		$('#from').attr('value', suggestion.value);
        $('#from-id').attr('value', suggestion.data);
		$('#to').focus();
	}
})

$('#to').autocomplete({
	serviceUrl: 'https://db-hafas.juliuste.de/locations',
	paramName: 'query',
	transformResult: function(response) {
		return {
			suggestions: $.map($.parseJSON(response).slice(0,5), function(dataItem) {
				return { value: dataItem.name, data: dataItem.id};
			})
		}
	},
	onSelect: function(suggestion) {
		$('#to').attr('value', suggestion.value);
        $('#to-id').attr('value', suggestion.data);
		$('#submit').focus();
	}
})

$('.station').focusout(function(){
    if(!$(this).attr('value')){
        guessStation($(this));
    }
});