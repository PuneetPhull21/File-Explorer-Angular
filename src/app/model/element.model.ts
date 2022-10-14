export class FolderSttucture {
  id: string;
  name: string;
  isFolder: boolean;
  parentId: string;
  referenceId?: string;
  constructor(id: string, name: string, isFolder: boolean, parent: string) {
    this.id = id;
    this.name = name;
    this.isFolder = isFolder;
    this.parentId = parent;
  }
}
