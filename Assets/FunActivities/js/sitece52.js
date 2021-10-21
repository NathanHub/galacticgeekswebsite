// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your Javascript code.
function estimate(form) {

	var budget = 1000;

	for (var i = 0; i < form.elements.length; i++) {
		if (form.elements[i].checked == true) {
			budget = budget * form.elements[i].value;
		}
	}

	budget = Math.round(budget);

	// format estimate
	var formatted_budget = budget.toString();
	formatted_budget = formatted_budget.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
	document.getElementById("estimate").innerHTML = "<p style=\"text-align: center; color:#838081; font-size: 24px; font-weight: 700;\">Estimate: $" + formatted_budget + "*</p>";

	var solo_time;
	var solo_units;

	if (budget >= 50000) {
		solo_time = Math.round(budget / 50000).toFixed(1);
		solo_units = "years";
	}
	else if (budget >= 4000) {
		solo_time = Math.round(budget / 4200).toFixed(1);
		solo_units = "months";
	}
	else {
		solo_time = Math.round(budget / 1000).toFixed(1);
		solo_units = "weeks";
	}

	var descr = "<p style=\"text-align: center; color:#838081; font-size: 24px; font-weight: 700;\">Or you could make it yourself in about " + solo_time + " " + solo_units + "</p>";
	document.getElementById("description").innerHTML = descr;

}