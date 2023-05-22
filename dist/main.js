let subnetMap = {};
let subnetNotes = {};
let maxNetSize = 0;
let infoColumnCount = 5
// NORMAL mode:
//   - Smallest subnet: /30
//   - Two reserved addresses per subnet:
//     - Network Address (network + 0)
//     - Broadcast Address (last network address)
// AWS mode (future):
//   - Smallest subnet: /28
//   - Two reserved addresses per subnet:
//     - Network Address (network + 0)
//     - AWS Reserved - VPC Router
//     - AWS Reserved - VPC DNS
//     - AWS Reserved - Future Use
//     - Broadcast Address (last network address)
let operatingMode = 'NORMAL'
let noteTimeout;
let minSubnetSize = 30
let inflightColor = '#ffffff'

$('input#network,input#netsize').on('input', function() {
    $('#input_form')[0].classList.add('was-validated');
})

$('#color_palette div').on('click', function() {
    inflightColor = $(this).css('background-color')
})

$('#calcbody').on('click', '.row_address, .row_range, .row_usable, .row_hosts, .note', function(event) {
    $(this).parent().css('background-color', inflightColor)
})

$('#btn_go').on('click', function() {
    reset();
})

$('#importBtn').on('click', function() {
    importConfig($('#importExportArea').val())
})


$('#btn_import_export').on('click', function() {
    $('#importExportArea').val(JSON.stringify(exportConfig(), null, 2))
})

function reset() {
    if (operatingMode === 'AWS') {
        minSubnetSize = 28
    } else {
        minSubnetSize = 30
    }
    let cidrInput = $('#network').val() + '/' + $('#netsize').val()
    let rootNetwork = get_network($('#network').val(), $('#netsize').val())
    let rootCidr = rootNetwork + '/' + $('#netsize').val()
    if (cidrInput !== rootCidr) {
        show_warning_modal('<div>Your network input is not on a network boundary for this network size. It has been automatically changed:</div><div class="font-monospace pt-2">' + $('#network').val() + ' -> ' + rootNetwork + '</div>')
    }
    $('#network').val(rootNetwork)
    subnetMap = {}
    subnetMap[rootCidr] = {}
    maxNetSize = parseInt($('#netsize').val())
    /*
    subnetMap = {
        '10.0.0.0/16': {
            '10.0.0.0/17': {},
            '10.0.128.0/17': {
                '10.0.128.0/18': {
                    '10.0.128.0/19': {},
                    '10.0.160.0/19': {
                        '10.0.160.0/20': {},
                        '10.0.176.0/20': {
                            '10.0.176.0/21': {
                                '10.0.176.0/22': {
                                    '10.0.176.0/23': {},
                                    '10.0.178.0/23': {}
                                },
                                '10.0.180.0/22': {}
                            },
                            '10.0.184.0/21': {}
                        }
                    }
                },
                '10.0.192.0/18': {
                    '10.0.192.0/19': {},
                    '10.0.224.0/19': {
                        '10.0.224.0/20': {},
                        '10.0.240.0/20': {
                            '10.0.240.0/21': {},
                            '10.0.248.0/21': {
                                '10.0.248.0/22': {},
                                '10.0.252.0/22': {
                                    '10.0.252.0/23': {},
                                    '10.0.254.0/23': {
                                        '10.0.254.0/24': {},
                                        '10.0.255.0/24': {}
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    */
    renderTable();
}

$('#calcbody').on('click', 'td.split,td.join', function(event) {
    // HTML DOM Data elements! Yay! See the `data-*` attributes of the HTML tags
    mutate_subnet_map(this.dataset.mutateVerb, this.dataset.subnet, subnetMap)
    renderTable();
})

$('#calcbody').on('keyup', 'td.note input', function(event) {
    // HTML DOM Data elements! Yay! See the `data-*` attributes of the HTML tags
    let delay = 1000;
    clearTimeout(noteTimeout);
    noteTimeout = setTimeout(function(element) {
        console.log('CAP')
        subnetNotes[element.dataset.subnet] = element.value
    }, delay, this);
})

$('#calcbody').on('focusout', 'td.note input', function(event) {
    // HTML DOM Data elements! Yay! See the `data-*` attributes of the HTML tags
    clearTimeout(noteTimeout);
    subnetNotes[this.dataset.subnet] = this.value
})


function renderTable() {
    // TODO: Validation Code
    $('#calcbody').empty();
    let maxDepth = get_dict_max_depth(subnetMap, 0)
    addRowTree(subnetMap, 0, maxDepth)
}

function addRowTree(subnetTree, depth, maxDepth) {
    for (let mapKey in subnetTree) {
        if (Object.keys(subnetTree[mapKey]).length > 0) {
            addRowTree(subnetTree[mapKey], depth + 1, maxDepth)
        } else {
            let subnet_split = mapKey.split('/')
            let notesWidth = '30%';
            if ((maxDepth > 5) && (maxDepth <= 10)) {
                notesWidth = '25%';
            } else if ((maxDepth > 10) && (maxDepth <= 15)) {
                notesWidth = '20%';
            } else if ((maxDepth > 15) && (maxDepth <= 20)) {
                notesWidth = '15%';
            } else if (maxDepth > 20) {
                notesWidth = '10%';
            }
            addRow(subnet_split[0], parseInt(subnet_split[1]), (infoColumnCount + maxDepth - depth), notesWidth)
        }
    }
}

function addRow(network, netSize, colspan, notesWidth) {
    // TODO: do some checking here for smaller networks like /32, probably some edge cases to watch for.
    let addressFirst = ip2int(network)
    let addressLast = subnet_last_address(addressFirst, netSize)
    // Will need to adjust this for AWS mode
    let usableFirst = addressFirst + 1
    let usableLast = addressLast - 1
    let hostCount = 1 + usableLast - usableFirst
    let newRow =
        '            <tr id="row_' + network.replace('.', '-') + '_' + netSize + '">\n' +
        '                <td class="row_address">' + network + '/' + netSize + '</td>\n' +
        '                <td class="row_range">' + int2ip(addressFirst) + ' - ' + int2ip(addressLast) + '</td>\n' +
        '                <td class="row_usable">' + int2ip(usableFirst) + ' - ' + int2ip(usableLast) + '</td>\n' +
        '                <td class="row_hosts">' + hostCount + '</td>\n' +
        '                <td class="note" style="width:' + notesWidth + '"><label><input type="text" class="form-control shadow-none p-0" data-subnet="' + network + '/' + netSize + '" value="' + (subnetNotes[network + '/' + netSize] || '') + '"></label></td>\n' +
        '                <td rowspan="1" colspan="' + colspan + '" class="split rotate" data-subnet="' + network + '/' + netSize + '" data-mutate-verb="split"><span>/' + netSize + '</span></td>\n'
    if (netSize > maxNetSize) {
        // This is wrong. Need to figure out a way to get the number of children so you can set rowspan and the number
        // of ancestors so you can set colspan.
        // DONE: If the subnet address (without the mask) matches a larger subnet address
        // in the heirarchy that is a signal to add more join buttons to that row, since they start at the top row and
        // via rowspan extend downward.
        let matchingNetworkList = get_matching_network_list(network, subnetMap).slice(1)
        for (const i in matchingNetworkList) {
            let matchingNetwork = matchingNetworkList[i]
            let networkChildrenCount = count_network_children(matchingNetwork, subnetMap, [])
            newRow += '                <td rowspan="' + networkChildrenCount + '" colspan="1" class="join rotate" data-subnet="' + matchingNetwork + '" data-mutate-verb="join"><span>/' + matchingNetwork.split('/')[1] + '</span></td>\n'
        }
    }
    newRow += '            </tr>';

    $('#calcbody').append(newRow)
}


// Helper Functions
function ip2int(ip) {
    return ip.split('.').reduce(function(ipInt, octet) { return (ipInt<<8) + parseInt(octet, 10)}, 0) >>> 0;
}

function int2ip (ipInt) {
    return ( (ipInt>>>24) +'.' + (ipInt>>16 & 255) +'.' + (ipInt>>8 & 255) +'.' + (ipInt & 255) );
}

function subnet_last_address(subnet, netSize) {
    return subnet + subnet_addresses(netSize) - 1;
}

function subnet_addresses(netSize) {
    return 2**(32-netSize);
}

function get_dict_max_depth(dict, curDepth) {
    let maxDepth = curDepth
    for (let mapKey in dict) {
        let newDepth = get_dict_max_depth(dict[mapKey], curDepth + 1)
        if (newDepth > maxDepth) { maxDepth = newDepth }
    }
    return maxDepth
}


function get_join_children(subnetTree, childCount) {
    for (let mapKey in subnetTree) {
        if (Object.keys(subnetTree[mapKey]).length > 0) {
            childCount += get_join_children(subnetTree[mapKey])
        } else {
            return childCount
        }
    }
}

function count_network_children(network, subnetTree, ancestryList) {
    // TODO: This might be able to be optimized. Ultimately it needs to count the number of keys underneath
    // the current key are unsplit networks (IE rows in the table, IE keys with a value of {}).
    let childCount = 0
    for (let mapKey in subnetTree) {
        if (Object.keys(subnetTree[mapKey]).length > 0) {
            childCount += count_network_children(network, subnetTree[mapKey], ancestryList.concat([mapKey]))
        } else {
            if (ancestryList.includes(network)) {
                childCount += 1
            }
        }
    }
    return childCount
}

function get_network_children(network, subnetTree) {
    // TODO: This might be able to be optimized. Ultimately it needs to count the number of keys underneath
    // the current key are unsplit networks (IE rows in the table, IE keys with a value of {}).
    let subnetList = []
    for (let mapKey in subnetTree) {
        if (Object.keys(subnetTree[mapKey]).length > 0) {
            subnetList.push.apply(subnetList, get_network_children(network, subnetTree[mapKey]))
        } else {
            subnetList.push(mapKey)
        }
    }
    return subnetList
}

function get_matching_network_list(network, subnetTree) {
    let subnetList = []
    for (let mapKey in subnetTree) {
        if (Object.keys(subnetTree[mapKey]).length > 0) {
            subnetList.push.apply(subnetList, get_matching_network_list(network, subnetTree[mapKey]))
        }
        if (mapKey.split('/')[0] === network) {
            subnetList.push(mapKey)
        }
    }
    return subnetList
}

function get_network(networkInput, netSize) {
    let ipInt = ip2int(networkInput)
    netSize = parseInt(netSize)
    for (let i=31-netSize; i>=0; i--) {
        ipInt &= ~ 1<<i;
    }
    return int2ip(ipInt);
}

function split_network(networkInput, netSize) {
    let subnets = [networkInput + '/' + (netSize + 1)]
    let newSubnet = ip2int(networkInput) + 2**(32-netSize-1);
    subnets.push(int2ip(newSubnet) + '/' + (netSize + 1))
    return subnets;
}

function mutate_subnet_map(verb, network, subnetTree) {
    for (let mapKey in subnetTree) {
        if (Object.keys(subnetTree[mapKey]).length > 0) {
            mutate_subnet_map(verb, network, subnetTree[mapKey])
        }
        if (mapKey === network) {
            let netSplit = mapKey.split('/')
            let netSize = parseInt(netSplit[1])
            if (verb === 'split') {
                if (netSize < minSubnetSize) {
                    let new_networks = split_network(netSplit[0], netSize)
                    subnetTree[mapKey][new_networks[0]] = {}
                    subnetTree[mapKey][new_networks[1]] = {}
                    // Copy note to both children and delete Delete parent note
                    subnetNotes[new_networks[0]] = subnetNotes[mapKey]
                    subnetNotes[new_networks[1]] = subnetNotes[mapKey]
                    delete subnetNotes[mapKey]
                }
            } else if (verb === 'join') {
                // Keep the note of the first subnet (which matches the network address) and lose the second subnet's note
                // Could consider changing this to concatenate the notes into the parent, but I think this is more intuitive
                // Find first (smallest) subnet note which matches the exact network address (this would be the top network in the join scope)
                let smallestMatchingNetworkSize = 0
                for (let subnetCidr in subnetNotes) {
                    if (subnetCidr.startsWith(netSplit[0])) {
                        if (parseInt(subnetCidr.split('/')[1]) > smallestMatchingNetworkSize) {
                            smallestMatchingNetworkSize = subnetCidr.split('/')[1]
                        }
                    }
                }
                subnetNotes[mapKey] = subnetNotes[netSplit[0] + '/' + smallestMatchingNetworkSize]
                // Delete all notes of subnets under this collapsed subnet
                let removeKeys = get_network_children(mapKey, subnetTree[mapKey], [])
                for (let removeKey in removeKeys) {
                    subnetNotes[removeKey] = ''
                }
                // And delete the subnets themselves
                subnetTree[mapKey] = {}
            } else {
                // How did you get here?
            }
        }
    }
}


function show_warning_modal(message) {
    var notifyModal = new bootstrap.Modal(document.getElementById("notifyModal"), {});
    $('#notifyModal .modal-body').html(message)
    notifyModal.show()
}

$( document ).ready(function() {
    reset();
    importConfig('{"config_version":"1","subnets":{"10.0.0.0/16":{"10.0.0.0/17":{"10.0.0.0/18":{},"10.0.64.0/18":{}},"10.0.128.0/17":{"10.0.128.0/18":{"10.0.128.0/19":{},"10.0.160.0/19":{"10.0.160.0/20":{"10.0.160.0/21":{"10.0.160.0/22":{},"10.0.164.0/22":{}},"10.0.168.0/21":{}},"10.0.176.0/20":{"10.0.176.0/21":{"10.0.176.0/22":{"10.0.176.0/23":{},"10.0.178.0/23":{}},"10.0.180.0/22":{}},"10.0.184.0/21":{}}}},"10.0.192.0/18":{"10.0.192.0/19":{},"10.0.224.0/19":{}}}}},"notes":{}}')
});

function exportConfig() {
    return {
        'config_version': '1',
        'subnets': subnetMap,
        'notes': subnetNotes
    }
}

function importConfig(text) {
    // TODO: Probably need error checking here
    text = JSON.parse(text)
    if (text['config_version'] === '1') {
        subnetMap = text['subnets'];
        subnetNotes = text['notes'];
        renderTable()
    }
}