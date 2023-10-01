/// <reference path="../ui.ts"/>

function ui_onOpen() {
    Ui.add_menu('Test', [
        { item: 'item1', handler: ui_item1Handler.name },
        { item: 'item2', handler: ui_item2Handler.name }]
)
}

function ui_item1Handler() {
    Ui.alert_user("Test", "This is a test");
}

function ui_item2Handler() {
    Ui.prompt_user("Test", "This is another test");
}

// test_all
function ui_test_all(){
    return Unittest.run_all([])
}
