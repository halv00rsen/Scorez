
Methods = {
	format_date: function(date) {
	    return moment(date).calendar(null, {
			sameDay: '[Today at] HH:mm',
			lastDay: '[Yesterday at] HH:mm',
			lastWeek: '[Last] dddd [at] HH:mm',
			thisWeek: 'dddd [at] HH:mm',
			sameElse: 'dddd DD/MM/YY [at] HH:mm'
		});
	}
}
