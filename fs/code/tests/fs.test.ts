/// <reference path="../fs.ts"/>

//test_get_file_path
function fs_test_get_file_path() {
  return Unittest.run<GoogleAppsScript.Drive.File | GoogleAppsScript.Drive.Folder, string | undefined, string>(
    "test_get_file_path",
    [
      { input: DriveApp.getFolderById('17zu3McC6cCKpsbjwG9YfaMixA_48jNp2'), expected: "/SASU-BB-IMMO/src/" }, // directory TEMPLATES in /SASU-BB-IMMO/src/ (/SASU-BB-IMMO/src/TEMPLATES) 
      { input: DriveApp.getFileById('1tmgZe4Yd7wf26CbXZrpX20VdYoXqxny8'), expected: "/FormationML/" }  // file "product_category_name_translation.csv" in /FormationML/
    ],
    (input, _) => Fs.get_elt_path(input),
    (input) => input.getId()
  );
}
//test_path_parts
function fs_test_path_parts() {
  return Unittest.run<string, Array<string>>(
    "path parts",
    [{ input: `/${Fs.DRIVE_ROOT_NAME}/a/b/c/`, expected: [Fs.DRIVE_ROOT_NAME, 'a', 'b', 'c'] }],
    (input, _) => Fs.path_parts(input)
  );
}
//test_unix_to_drive
function fs_test_unix_to_drive() {
  return Unittest.run<string, string>(
    "unix to drive",
    [
      { input: "/a/b/c/", expected: `/${Fs.DRIVE_ROOT_NAME}/a/b/c/` },
      { input: `/${Fs.DRIVE_ROOT_NAME}/a/b/c/`, expected: `/${Fs.DRIVE_ROOT_NAME}/a/b/c/` }
    ],
    (input, _) => Fs.unix_to_drive(input)
  );
}
//test_drive_to_unix
function fs_test_drive_to_unix() {
  return Unittest.run<string, string>(
    "drive to unix",
    [
      { input: `/${Fs.DRIVE_ROOT_NAME}/a/b/c/`, expected: "/a/b/c/" },
      { input: "/a/b/c/", expected: "/a/b/c/" }
    ],
    (input, _) => Fs.drive_to_unix(input)
  );
}
//test_unix_to_drive_to_unix
function fs_test_unix_to_drive_to_unix() {
  return Unittest.run<string, string>(
    "unix to drive to unix",
    [
      { input: `/${Fs.DRIVE_ROOT_NAME}/a/b/c/`, expected: '/a/b/c/' },
      { input: '/a/b/c/', expected: '/a/b/c/' }
    ],
    (input, _) => Fs.drive_to_unix(Fs.unix_to_drive(input))
  );
}
//test_drive_to_unix_to_drive
function fs_test_drive_to_unix_to_drive() {
  return Unittest.run<string, string>(
    "drive to unix to drive",
    [
      { input: `/${Fs.DRIVE_ROOT_NAME}/a/b/c/`, expected: `/${Fs.DRIVE_ROOT_NAME}/a/b/c/` },
      { input: '/a/b/c/', expected: `/${Fs.DRIVE_ROOT_NAME}/a/b/c/` }
    ],
    (input, _) => Fs.unix_to_drive(Fs.drive_to_unix(input))
  );
}
//test_list_dir
function fs_test_list_dir() {

  return Unittest.run<string, Array<Fs.FileDesc>>(
    "list dir",
    [
      {
        input: '13sGA0_gXxq0OVwRePOHfNXV3Tns-iE_a',
        expected: [
          { id: "11RqCdU_z6D0Anv-u838UtEamENVhmfU1ZiBAQKeMv9k", name: "list_sheet", type: Fs.MineType.SHEET },
          { id: "1XBEf0niRzIh1vAuXov7RoAt3lvnpP27cSRF4Qplm3RM", name: "list_doc", type: Fs.MineType.DOC }
        ]
      }
    ],
    (input, _) => Fs.list_dir(input)
  )
}

function fs_test_csv_data() {

  return Unittest.run<string, any[][] | undefined>(
    "csv_data",
    [
      {
        input: '1pAze6gupbsMNHcGJFUeqkOhsKgJIUkMQ',
        expected: [
          ["Date", "Code journal", "Numéro du compte", "Type", "Débit", "Crédit", "Solde mouvement", "Solde bancaire", "Libellé", "Montant de TVA total", "Pièces", "Date d'ajout pièces", "Commentaire"], 
          ["07/07/2023", "BQ", "", "Virement", "", "55,00", "55,00", "55,00", "Virement de Benjamin BOUCHARD - Creditor Name SEPA : BB IMMO - De: M  BOUCHARD BENJAMIN", "", "", "", ""], 
          ["26/09/2023", "BQ", "", "Virement", "9,48", "", "-9,48", "426,90", "Abonnement Shine - 26 septembre", "", "ACH_2023-09-26_abonnement_shine_-_26_septembre_95f4af2d-8045-42f4-9b92-484c9e9252d2.pdf", "26/09/2023", ""]
        ]
      }
    ],
    (input) => Fs.csv_data({ id: input, name: '', type: Fs.MineType.TEXT })
  );

}


function fs_test_all() {
  return Unittest.run_all([
    "fs_test_get_file_path",
    "fs_test_path_parts",
    "fs_test_unix_to_drive",
    "fs_test_drive_to_unix",
    "fs_test_unix_to_drive_to_unix",
    "fs_test_drive_to_unix_to_drive",
    "fs_test_list_dir",
    "fs_test_csv_data"
  ])
}


// type MineType = keyof GoogleAppsScript.Base.MimeType

// function fs_test_mine_type(){
//   return [
//     {id:"11RqCdU_z6D0Anv-u838UtEamENVhmfU1ZiBAQKeMv9k",name:"list_sheet",type:"GOOGLE_DOCS"},
//     {id:"1XBEf0niRzIh1vAuXov7RoAt3lvnpP27cSRF4Qplm3RM",name:"list_doc",type:Fs.DOCUMENT_TYPE}
//   ].map(
//     x => ({name:x.name,type:x.type,mine_type: DriveApp.getFileById(x.id).getMimeType()})
//   )
// }

// function test_copy_file(){
//   Fs.copy_file("/SASU-BB-IMMO/","bb-immo-7021-iban-fr.pdf","/SASU-BB-IMMO/test/a/b/c","");
//   Fs.copy_file("/SASU-BB-IMMO/","bb-immo-7021-iban-fr.pdf","/riri/fifi/loulou","");
// }
