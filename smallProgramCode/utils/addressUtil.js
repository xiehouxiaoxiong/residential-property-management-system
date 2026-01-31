function getCurrentDate(date) {
	var year = date.getFullYear()
	var month = date.getMonth() + 1
	var day = date.getDate()
	month = (month < 10) ? "0" + month : month;
	return year + "-" + month + "-" + day
}

function getCurrentTime(date) {
	var hour = date.getHours()
	var minute = date.getMinutes()
	return hour + ":" + minute
}

function getEndDate(date) {
	var year = date.getFullYear()
	var month = date.getMonth() + 1
	var day = date.getDate()
	if (month == 12) {
		year += 1;
		month = 1;
	} else {
		month += 1;
	}
	month = (month < 10) ? "0" + month : month;
	return year + "-" + month + "-" + day;
}

export {
	getCurrentDate,
	getCurrentTime,
	getEndDate
}