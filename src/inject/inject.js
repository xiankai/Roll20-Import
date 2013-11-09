chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == "loadAttributes") {
        fillAttributes(request.payload, request.character);
        sendResponse(true);
    }

    if (request.action == "getAttributes") {
        sendResponse(getAttributes());
    }
});

function getAttributes() {
    // HERE, I DECLARE, MINE VARS
    var skill_hash = {},
        attributes = {},
        i, j, k, m,
        name, val, skill
        whitelist = [
            'Name',
            'Level',
            'HP',
            'AC',
            'ACTouch',
            'ACFlat',
            'Init',
            'Speed',
            'Fort',
            'Reflex',
            'Will',
            'MBAB',
            'RBAB'
        ],
        abilities = ['Str', 'Dex', 'Con', 'Int', 'Wis', 'Cha'];

    // Abilities
    for (i in abilities) {
        var ability = abilities[i];
        whitelist.push(ability);
        whitelist.push(ability + 'Mod');
    }

    // Skills
    for (j = 1; j <= 38; j++) {
        whitelist.push('Skill' + j);
        whitelist.push('Skill' + j + 'Mod');
    }

    for (k in whitelist) {
        name = whitelist[k];
        val = $('input[name=' + name + ']').val();

        if (typeof val === 'string') {
            val = val.replace('+', '');
        }

        if (name.substr(0, 5) === 'Skill') {
            // Discard all non-numbers to get the index
            var index = name.replace(/\D+/g, "");

            if (!skill_hash.hasOwnProperty(index)) {
                skill_hash[index] = {};
            }

            if (name.substr(-3) === 'Mod') {
                // Skill value
                skill_hash[index]['val'] = val;
            } else {
                // Skill name
                skill_hash[index]['name'] = val;
            }

            // Add skills later
            continue;
        }

        attributes[name] = val;
    }

    // Add back the skills
    for (m in skill_hash) {
        skill = skill_hash[m];
        attributes[skill.name] = skill.val;
    }

    return attributes;
}

function fillAttributes(attributes, character) {
    var target_window;
    var char_id;

    $('.character .namecontainer').each(function() {
        if ($.trim($(this).text()).substr(0, character.length) === character) {
            // Get char ID for future reference
            char_id = $(this).parents('.character').data('characterid');

            // Open dialog
            $(this).parents('.character').click();

            // Store dialog reference
            target_window = $('.dialog[data-characterid=' + char_id + ']');
            return false;
        }
    })

    // Edit character
    target_window.parents('.ui-dialog').find('.ui-dialog-titlebar .editcharacter').click();

    // Edit attributes
    $('a[data-tab="attributesabilities"]').click();
    
    // Clear attributes
    $('.deleteattr').click();

    // Fill in attributes
    for (var name in attributes) {
        addAttribute(name, attributes[name]);
    }

    // Save
    target_window.find("button:contains('Save Changes')").click();
}

function addAttribute(key, val) {
    $('.addattrib').click();
    if (key === "Name") {
        return;
    }

    // Recently added attribute
    $('.attrib:last').find('.attrname').find('input').val(key);
    $('.attrib:last').find('.current').find('input').val(val);
}