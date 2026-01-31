let compareDate = (date1, date2) => {
	let tmp1 = date1.getTime();
	let tmp2 = date2.getTime();
	return tmp1 - tmp2
}

module.exports.compareDate = compareDate