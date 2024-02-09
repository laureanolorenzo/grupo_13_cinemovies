function removeWhiteSpace(str) {
	let forbiddenChars = ['#', '%', '&', '{', '}', '\\', '<', '>', '*', '?', '/', ' ', '$', '!', "'", '"', ':', '@', '+', '`', '|', '=',':','.'];
    let strArray = str.split(' ');
    let strArrayToCapitalize = strArray.slice(1);
    strArrayToCapitalize = strArrayToCapitalize.map(x => x.charAt(0).toUpperCase() + x.slice(1)).join('');
    let newStr = strArray[0].concat(strArrayToCapitalize);
	for (const i of forbiddenChars) {
		newStr = newStr.replace(i,'_');
	}
	return newStr;
}
module.exports = removeWhiteSpace;