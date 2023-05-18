let subnetMap = {};
let maxNetSize = 0;
let infoColumnCount = 5
$('#btn_go').on('click', function() {
    reset();
})

$('#btn_reset').on('click', function() {
    reset();
})

function reset() {
        let rootCidr = get_network($('#network').val(), $('#netsize').val()) + '/' + $('#netsize').val()
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
    console.log(this.dataset.subnet)
    mutate_subnet_map(this.dataset.mutateVerb, this.dataset.subnet, subnetMap)
    renderTable();
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
            addRow(subnet_split[0], parseInt(subnet_split[1]), (infoColumnCount + maxDepth - depth))
        }
    }
}

function addRow(network, netSize, colspan) {
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
        '                <td class="note"><label><input type="text" class="form-control shadow-none p-0"></label></td>\n' +
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
    console.log(network)
    console.log(netSize)
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
            if (verb === 'split') {
                let netSplit = mapKey.split('/')
                let new_networks = split_network(netSplit[0], parseInt(netSplit[1]))
                subnetTree[mapKey][new_networks[0]] = {}
                subnetTree[mapKey][new_networks[1]] = {}
            } else if (verb === 'join') {
                subnetTree[mapKey] = {}
            } else {
                // How did you get here?
            }
        }
    }
}

$( document ).ready(function() {
    reset();
});