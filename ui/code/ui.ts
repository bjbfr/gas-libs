namespace Ui {
  
  /**
   * Returns the current Google Workspace App or null if none is defined.
   *
   * @returns GoogleAppsScript.Document.DocumentApp | GoogleAppsScript.Spreadsheet.SpreadsheetApp | null
   */
  export function get_app() {
    // const currentApp = Utils.gwapp();
    if (Utils.currentApp) {
      const { app } = Utils.currentApp;
      return app;
    }
    return null;
  }

  /**
   * Returns the UI element for the current Google Workspace App or null if if none is defined.
   * @returns  GoogleAppsScript.Base.Ui | null
   */
   export function get_ui(){
    const app = get_app();
    if(app){
      return app.getUi();
    }else{
      return null;
    }
  }
  /**
   * Alerts user with a message box with a OK button and containing {@link message} and titled {@link title} 
   * for the the current Google Workspace App.
   * @param {string} title 
   * @param {string} message 
   */
  export function alert_user(title:string,message:string){
      const ui = get_ui();
      if(ui)
        ui.alert(title, message, ui.ButtonSet.OK);
  }
  /**
   * Add menu named {@link menuName} with menu items listed in {@link items} 
   * for the the current Google Workspace App (if an app is recognized).
   * @param {string} menuName 
   * @param {[{item:string,handler:string}]} items 
   */
  export function add_menu(menuName:string,items:Array<{item:string,handler:string}>){
    const ui = get_ui();
    if(ui){
      let menu = ui.createMenu(menuName);
      items.forEach( ({item,handler}) => menu = menu.addItem(item,handler));
      menu.addToUi(); 
    }
  }
  /**
   * Propmt user with a message box with a OK/Cancel button containing {@link message} and titled {@link title} 
   * for the the current Google Workspace.
   * Returns user's answer or undefined if no app is recognized.
   * @param {string} title 
   * @param {string} message 
   * @returns GoogleAppsScript.Base.PromptResponse | undefined
   */
  export function prompt_user(title:string,message:string){
      const ui = get_ui();
      if(ui)
        return ui.prompt(title, message, ui.ButtonSet.OK_CANCEL);
      return;
  }
}
