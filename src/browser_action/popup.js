$('#export').on('click', function() {
	chrome.tabs.query({url: "*://app.roll20.net/editor/"}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {
			action: "loadAttributes",
			payload: localStorage,
			character: $('#character').val()
		}, function(response) {
			$('#timestamp_export').html(getCurrentTime());
		});
	});
});

$('#import').on('click', function() {
	chrome.tabs.query({url: "*://www.myth-weavers.com/sheetview.php?sheetid=" + getSheetID()}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {
			action: "getAttributes"
		}, function(attributes) {
			localStorage.clear();
			for (var name in attributes) {
				localStorage.setItem(name, attributes[name]);
			}
			$('#timestamp_import').html(getCurrentTime());
		});
	});
});

// Save functions
$('#character').on('change', function() {
	chromeSetItem('character', $(this).val());
});

$('#sheetid').on('change', function() {
	chromeSetItem('sheetid', getSheetID());
});

// Populate existing data
chromeGetItem('character', function(val) {
	$('#character').val(val);
});

chromeGetItem('sheetid', function(val) {
	$('#sheetid').val(val);
});

chromeGetItem('timestamp_import', function(val) {
	$('#timestamp_import').html(val);
});

chromeGetItem('timestamp_export', function(val) {
	$('#timestamp_export').html(val);
});

function getSheetID() {
	var input = $('#sheetid').val();
	return (!isNaN(parseInt(input))) ? input : "*";
}

function getCurrentTime() {
	var currentdate = new Date(); 
	var datetime = currentdate.getFullYear() + "-" +
					(currentdate.getMonth()+1)  + "-" +
					currentdate.getDate() + " @ " +
					currentdate.getHours() + ":" +
					currentdate.getMinutes() + ":" +
					currentdate.getSeconds();
    return datetime;
}

function chromeSetItem(key, val) {
	var data = {};
	data[key] = val;
	chrome.storage.local.set(data);
}

function chromeGetItem(key, callback) {
	chrome.storage.local.get(key, function(item) {
		callback(item[key]);
	});
}