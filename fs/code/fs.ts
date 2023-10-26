namespace Fs {

  export const DIR_SEP = '/';
  export const DRIVE_ROOT_NAME = () => DriveApp.getRootFolder().getName();

  export enum MineType {
    DOC = 'application/vnd.google-apps.document',
    SHEET = 'application/vnd.google-apps.spreadsheet',
    TEXT = 'text/csv'
  }

  export type FileDesc = { id: string, name: string, type: MineType | undefined }
  export type DirDesc = { id: string, name: string }

  export type FileType = ReturnType<typeof Fs.openById>
  export type DriveFile = ReturnType<typeof DriveApp.getFileById>

  /**
   * 
   * @param param0 
   * @returns 
   */
  export function openById({ id, type }: FileDesc) {
    if (type === MineType.SHEET)
      return SpreadsheetApp.openById(id);
    else if (type === MineType.DOC)
      return DocumentApp.openById(id)
    return; 
  }
  /**
   * 
   * @param srcDir 
   * @param srcFile 
   * @param dstDir 
   * @param dstFile 
   * @param appName 
   * @returns 
   */
  export function copy_file(srcDir: AbsolutePath, srcFile: string, dstDir: AbsolutePath, dstFile: string) {

    // get srcFile id (and check if it exists) 
    let srcFileIter = DriveApp.getFilesByName(srcFile);
    const srcFileId = get_elt_id(srcDir, srcFileIter);
    if (!srcFileId) {
      const message = `Cannot find file ${srcFile} in directory: ${srcDir}.`;
      Logger.log(message);
      Ui.alert_user("Warning", message);
      return;
    }
    // find/create dstDir
    const dstDirId = find_mk_dir(dstDir);
    // list dir content
    const ls_dirs = list_files(dstDirId);
    // check if target already exists in dstDir, if yes move it to trash
    const ls_dir = ls_dirs.find(({ name }) => name === dstFile);
    if (ls_dir) {
      const { id } = ls_dir
      DriveApp.getFileById(id).setTrashed(true);

    }
    //copy 'srcFile' into 'dstDir' with name 'dstFile'
    return DriveApp.getFileById(srcFileId).makeCopy(dstFile, DriveApp.getFolderById(dstDirId));
  }
  /**
   * Lists files in a  directory represented by its {@link dirId}
   * @param dirId {string}
   * @returnsx
   * 
   */
  export function list_files(dirId: string): Array<FileDesc> {
    const ret = [];
    const iter = DriveApp.getFolderById(dirId).getFiles();
    while (iter.hasNext()) {
      const file = iter.next();
      ret.push({ id: file.getId(), name: file.getName(), type: Utils.fromString(MineType, file.getMimeType()) });
    }
    return ret;
  }
  /**
   * Lists directories in a  directory represented by its {@link dirId}
   * @param dirId {string}
   * @returns 
   */
  export function list_dirs(dirId: string): Array<DirDesc> {
    const ret = [];
    const iter = DriveApp.getFolderById(dirId).getFolders();
    while (iter.hasNext()) {
      const dir = iter.next();
      ret.push({ id: dir.getId(), name: dir.getName() });
    }
    return ret;
  }

  /**
   * Finds a directory from its path {@link pathDir} and returns its id.
   * Creates all missing elements along the directories chain.
   * @param pathDir {AbsolutePath}
   * @returns 
   */
  export function find_mk_dir(pathDir: Path): string {

    // dstDirIds = [{root,dirName,id}] for directories along the dstDir 
    const dstDirIds = path_parts(pathDir)
      .reduce(({ acc, root }, x) => {
        acc.push([root, x]);
        return { acc: acc, root: `${root}${x}${DIR_SEP}` };
      }, { acc: [], root: DIR_SEP } as { acc: Array<[AbsolutePath, string]>, root: string }
      )["acc"]
      .map(
        ([root, dirName]) => {
          return { root: root, dirName: dirName, id: get_elt_id(root, DriveApp.getFoldersByName(dirName)) }
        }
      );

    if (dstDirIds.length === 0)
      return DriveApp.getRootFolder().getId();

    // Logger.log(`dstDirIds: ${JSON.stringify(dstDirIds)}`);

    // detect the first non-existing directory (if any)
    let index = dstDirIds.findIndex(({ id }) => id === undefined)
    if (index !== -1) {
      let prev_dir: GoogleAppsScript.Drive.Folder;
      if (index === 0) {
        prev_dir = DriveApp.getRootFolder();
      } else {
        let prev_id = dstDirIds[index - 1].id as string; // cannot be undefined
        prev_dir = DriveApp.getFolderById(prev_id);
      }
      //create folders
      dstDirIds.slice(index).forEach(({ dirName }) => prev_dir = prev_dir.createFolder(dirName));
      return prev_dir.getId();
    } else {
      return dstDirIds[dstDirIds.length - 1].id as string; // cannot be undefined
    }
  }
  /**
   * Retrieves the id of an element (file or folder) based on its name and an iterator of possible candidates.
   * Returns undefined if none of the candidates matches the name.
   * @param root {AbsolutePath}
   * @param iter {GoogleAppsScript.Drive.FileIterator|GoogleAppsScript.Drive.FolderIterator}
   * @returns 
   */
  export function get_elt_id(root: AbsolutePath, iter: GoogleAppsScript.Drive.FileIterator | GoogleAppsScript.Drive.FolderIterator): string | undefined {

    while (iter.hasNext()) {
      let elt = iter.next();
      let path = get_elt_path(elt);
      if (path === root) {
        return elt.getId();
      }
    }
    return;
  }
  /**
   * Returns the path of {@link elt}
   * @param elt {GoogleAppsScript.Drive.File|GoogleAppsScript.Drive.Folder} 
   * @returns 
   */
  export function get_elt_path(elt: GoogleAppsScript.Drive.File | GoogleAppsScript.Drive.Folder): string | undefined {

    if (!elt) return;

    let path = [];

    let iter = elt.getParents();
    while (iter.hasNext()) {
      let folder = iter.next();
      path.push(folder.getName());
      iter = folder.getParents();
    }

    return drive_to_unix(
      path_from_parts(path.reverse())
    );

  }
  /**
   * Splits a path into parts (reverse operation of path_from_parts)
   * @param path 
   * @returns 
   */
  export function path_parts(path: Path): Array<string> {
    return path.split(DIR_SEP).filter(p => p !== '');
  }
  /**
   * Assembles {@link parts} into a path (reverse operation of path_parts)
   * @param parts 
   * @returns 
   */
  export function path_from_parts(parts: Array<string>): AbsolutePath {
    if (parts.length == 0) {
      return DIR_SEP;
    } else {
      return DIR_SEP + parts.join(DIR_SEP) + DIR_SEP;
    }
  }
  /**
   * Converts a unix path into a drive one (reverse operation of drive_to_unix)
   * @param path {AbsolutePath}
   * @returns 
   */
  export function unix_to_drive(path: AbsolutePath): AbsolutePath {
    if (!path.startsWith(`${DIR_SEP}${DRIVE_ROOT_NAME()}`))
      return `${DIR_SEP}${DRIVE_ROOT_NAME()}${path}`;
    else
      return path;
  }
  /**
   * Converts a drive path into a unix one (reverse operation of unix_to_drive)
   * @param path {AbsolutePath}
   * @returns 
   */
  export function drive_to_unix(path: AbsolutePath): AbsolutePath {
    return path_from_parts(
      path_parts(path).filter(p => p != DRIVE_ROOT_NAME())
    )
  }
  /***
   * 
   */
  export function get_file_content(file: DriveFile) {
    return file.getBlob().getDataAsString();
  }
  type AddSrcCallback = ((fileDesc: FileDesc) => { header: string[], values: any[] }) | null
  export const srcFileId = (fileDesc: FileDesc) => ({ header: ['fileId'], values: [fileDesc.id] })
  export const srcFileName = (fileDesc: FileDesc) => ({ header: ['File'], values: [fileDesc.name] })
  /**
   * Reads csv data contains in file pointed by {@link fileDesc}. 
   * Source data description: {@sep} is the fields separator, {@eol} is the End of Line separator, {@hasHeader} states whether there is an header or not.
   * {addSrcCallback} enables one to choose piece of information to be added about the file from which data is read.
   * @param fileDesc {FileDesc} file descriptor
   * @param addSrcCallback {fileDesc:FileDesc => ({header: string[],values: any[]})}
   * @param hasHeader {boolean}
   * @param sep {string}
   * @param eol {string}
   */
  const push_array = (c: any[], vs: any[]) => vs.forEach(v => c.push(v))
  export function csv_data(fileDesc: FileDesc, addSrcCallback: AddSrcCallback = null, hasHeader: boolean = true, sep: string = ';', eol: string = '\r\n', quoted_values: boolean = false) {
    try {
      const file = DriveApp.getFileById(fileDesc.id);
      const content = get_file_content(file).trim();
      const csv_data = content.split(eol).map(line => line.split(sep));
      if (csv_data.length > 0) {
        if (addSrcCallback) {
          const { header, values } = addSrcCallback(fileDesc);
          csv_data.forEach((row, i) => {
            if (i === 0) {
              if (hasHeader) {
                if (header) push_array(row, header)
              } else {
                push_array(row, values)
              }
            }// i === 0
            else
              push_array(row, values)
          });
        }
        if (quoted_values) {
          csv_data.forEach(row => row.forEach((value, i) => { row[i] = value.replace(/^"|"$/g, '') }))
        }
      }
      const { res, errors } = Utils.check_tabular_data(csv_data);
      if (!res) {
        console.log(`Data read is not tabular (Row #,Number of columns):\n ${errors} Vs expected: ${csv_data[0].length}`)
      } else {
        return csv_data;
      }
    } catch (e: any) {
      console.log(`Exception in ${e.message}`)
    }
    return;
  }
}